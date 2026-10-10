/**
 * q-mp-300 — Characterize DiceSelector selection / enable-disable / soft paths.
 *
 * Tests only. Structural asserts on button.disabled, early-return soft paths,
 * and mid-roll cancel/reset — no player-facing copy pins, no src edits, no
 * nullish product clear (held behind #727 / q-mp-308).
 */
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  DiceSelector,
  createRollButton,
} from '../../src/core/dice/dice-selector';
import { COMMON_DICE_SETS } from '../../src/core/dice/types';

function mockSteppedRandom(): void {
  let n = 0;
  vi.spyOn(Math, 'random').mockImplementation(() => {
    n += 1;
    return (n % 997) / 997;
  });
}

function mount(options: ConstructorParameters<typeof DiceSelector>[1] = {}): {
  root: HTMLDivElement;
  selector: DiceSelector;
} {
  const root = document.createElement('div');
  document.body.appendChild(root);
  const selector = new DiceSelector(root, {
    diceSet: COMMON_DICE_SETS.standard,
    ...options,
  });
  return { root, selector };
}

function rollBtn(root: HTMLElement): HTMLButtonElement | null {
  return root.querySelector('.dice-btn-primary');
}

function confirmBtn(root: HTMLElement): HTMLButtonElement | null {
  return root.querySelector('.dice-btn-success');
}

afterEach(() => {
  document.body.innerHTML = '';
  document
    .querySelectorAll('#dice-selector-styles')
    .forEach((el) => el.remove());
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('q-mp-300 dice-selector — confirm enable/disable', () => {
  it('keeps Confirm disabled until at least one die is selected', async () => {
    vi.useFakeTimers();
    mockSteppedRandom();
    const { root, selector } = mount();
    selector.roll();
    await vi.advanceTimersByTimeAsync(900);

    const before = confirmBtn(root);
    expect(before).toBeTruthy();
    expect(before!.disabled).toBe(true);

    const die = selector.getResult()!.rolls[0]!;
    (root.querySelector(`[data-die-id="${die.id}"]`) as HTMLElement).click();

    const after = confirmBtn(root);
    expect(after!.disabled).toBe(false);
    expect(selector.getSelectedDice()).toHaveLength(1);
    selector.destroy();
  });

  it('re-disables Confirm when multiSelect deselects the last die', async () => {
    vi.useFakeTimers();
    mockSteppedRandom();
    const { root, selector } = mount({ multiSelect: true });
    selector.roll();
    await vi.advanceTimersByTimeAsync(900);

    const die = selector.getResult()!.rolls[0]!;
    const wrapper = () =>
      root.querySelector(`[data-die-id="${die.id}"]`) as HTMLElement;
    wrapper().click();
    expect(confirmBtn(root)!.disabled).toBe(false);
    wrapper().click();
    expect(selector.getSelectedDice()).toHaveLength(0);
    expect(confirmBtn(root)!.disabled).toBe(true);
    selector.destroy();
  });
});

describe('q-mp-300 dice-selector — mid-roll enable/disable soft paths', () => {
  it('mid-roll confirm re-render disables Roll Again and Confirm while isRolling', async () => {
    vi.useFakeTimers();
    mockSteppedRandom();
    const onConfirm = vi.fn();
    const { root, selector } = mount({ onConfirm });
    selector.roll();
    await vi.advanceTimersByTimeAsync(900);

    const id = selector.getResult()!.rolls[0]!.id;
    (root.querySelector(`[data-die-id="${id}"]`) as HTMLElement).click();
    expect(confirmBtn(root)!.disabled).toBe(false);
    expect(rollBtn(root)!.disabled).toBe(false);

    // Start Roll Again — isRolling flips true without an immediate re-render.
    selector.roll();
    expect(rollBtn(root)!.disabled).toBe(false);

    // Programmatic confirm re-renders while isRolling is still true.
    selector.confirm();
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(rollBtn(root)!.disabled).toBe(true);
    expect(confirmBtn(root)!.disabled).toBe(true);

    await vi.advanceTimersByTimeAsync(900);
    // Settle replaces result; controls re-enable for the fresh roll.
    expect(rollBtn(root)!.disabled).toBe(false);
    expect(confirmBtn(root)!.disabled).toBe(true);
    selector.destroy();
  });

  it('die click soft-returns while isRolling after mid-roll confirm re-render', async () => {
    vi.useFakeTimers();
    mockSteppedRandom();
    const onSelectionChange = vi.fn();
    const { root, selector } = mount({
      multiSelect: true,
      onSelectionChange,
    });
    selector.roll();
    await vi.advanceTimersByTimeAsync(900);

    const rolls = selector.getResult()!.rolls;
    expect(rolls.length).toBeGreaterThanOrEqual(2);
    const first = rolls[0]!;
    const second = rolls[1]!;
    (root.querySelector(`[data-die-id="${first.id}"]`) as HTMLElement).click();
    onSelectionChange.mockClear();

    selector.roll();
    selector.confirm(); // re-renders locked selection while isRolling
    expect(confirmBtn(root)!.disabled).toBe(true);

    const unlocked = root.querySelector(
      `[data-die-id="${second.id}"]`
    ) as HTMLElement | null;
    // Locked first die (and any sibling still in the DOM) must soft-return.
    const locked = root.querySelector(
      `[data-die-id="${first.id}"]`
    ) as HTMLElement;
    locked.click();
    unlocked?.click();
    expect(onSelectionChange).not.toHaveBeenCalled();
    expect(selector.getSelectedDice().map((d) => d.id)).toEqual([first.id]);

    await vi.advanceTimersByTimeAsync(900);
    selector.destroy();
  });
});

describe('q-mp-300 dice-selector — cancel / reset / destroy soft paths', () => {
  it('reset mid-roll cancels animation and restores idle enabled Roll', async () => {
    vi.useFakeTimers();
    mockSteppedRandom();
    const onRoll = vi.fn();
    const { root, selector } = mount({ onRollComplete: onRoll });
    selector.roll();
    expect(selector.getResult()).toBeNull();
    selector.reset();
    await vi.advanceTimersByTimeAsync(900);
    expect(onRoll).not.toHaveBeenCalled();
    expect(selector.getResult()).toBeNull();
    expect(root.querySelector('.dice-placeholder')).toBeTruthy();
    expect(confirmBtn(root)).toBeNull();
    const roll = rollBtn(root);
    expect(roll).toBeTruthy();
    expect(roll!.disabled).toBe(false);
    selector.destroy();
  });

  it('destroy mid-roll cancels completion callback (soft teardown)', async () => {
    vi.useFakeTimers();
    mockSteppedRandom();
    const onRoll = vi.fn();
    const { root, selector } = mount({ onRollComplete: onRoll });
    selector.roll();
    selector.destroy();
    await vi.advanceTimersByTimeAsync(900);
    expect(onRoll).not.toHaveBeenCalled();
    expect(root.innerHTML).toBe('');
  });

  it('missing result-area soft path leaves Roll control absent after stuck roll', async () => {
    vi.useFakeTimers();
    mockSteppedRandom();
    const onRoll = vi.fn();
    const { root, selector } = mount({
      showRollButton: true,
      onRollComplete: onRoll,
    });
    root.querySelector('#dice-result-area')?.remove();
    selector.roll();
    await vi.advanceTimersByTimeAsync(900);
    expect(onRoll).not.toHaveBeenCalled();
    // Stuck isRolling: further rolls soft-return; prior Roll button still in DOM
    // from the pre-roll render (never re-rendered).
    expect(rollBtn(root)?.disabled).toBe(false);
    selector.roll();
    await vi.advanceTimersByTimeAsync(900);
    expect(onRoll).not.toHaveBeenCalled();
    selector.destroy();
  });
});

describe('q-mp-300 dice-selector — default options + createRollButton soft paths', () => {
  it('empty options soft-default to standard set with enabled Roll', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const selector = new DiceSelector(root);
    expect(root.classList.contains('dice-selector')).toBe(true);
    expect(root.querySelector('.dice-selector-header')).toBeTruthy();
    expect(confirmBtn(root)).toBeNull();
    const roll = rollBtn(root);
    expect(roll).toBeTruthy();
    expect(roll!.disabled).toBe(false);
    expect(selector.getSelectedDice()).toEqual([]);
    expect(selector.getSelectedSum()).toBe(0);
    selector.destroy();
  });

  it('createRollButton stays enabled and invokes onRoll synchronously', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const onRoll = vi.fn();
    mockSteppedRandom();
    const btn = createRollButton(host, COMMON_DICE_SETS.triple, onRoll);
    expect(btn.disabled).toBe(false);
    btn.click();
    expect(onRoll).toHaveBeenCalledTimes(1);
    expect(onRoll.mock.calls[0]![0].rolls).toHaveLength(3);
    expect(btn.disabled).toBe(false);
  });

  it('showRollButton false soft-omits primary control; Confirm still enable-gated', async () => {
    vi.useFakeTimers();
    mockSteppedRandom();
    const { root, selector } = mount({ showRollButton: false });
    expect(rollBtn(root)).toBeNull();
    selector.roll();
    await vi.advanceTimersByTimeAsync(900);
    expect(confirmBtn(root)!.disabled).toBe(true);
    const id = selector.getResult()!.rolls[0]!.id;
    (root.querySelector(`[data-die-id="${id}"]`) as HTMLElement).click();
    expect(confirmBtn(root)!.disabled).toBe(false);
    selector.destroy();
  });
});
