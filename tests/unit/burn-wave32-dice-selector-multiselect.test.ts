/**
 * Wave 32 — DiceSelector multiSelect vs single-select click edges.
 * Deepens wave 22 selector UI selection semantics. Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import { DiceSelector, COMMON_DICE_SETS } from '../../src/core/dice';

function mockSteppedRandom() {
  let n = 0;
  vi.spyOn(Math, 'random').mockImplementation(() => {
    n += 1;
    return (n % 997) / 997;
  });
}

afterEach(() => {
  document.body.innerHTML = '';
  document
    .querySelectorAll('#dice-selector-styles')
    .forEach((el) => el.remove());
  vi.useRealTimers();
  vi.restoreAllMocks();
});

async function rolledSelector(
  opts: ConstructorParameters<typeof DiceSelector>[1]
) {
  vi.useFakeTimers();
  mockSteppedRandom();
  const el = document.createElement('div');
  document.body.appendChild(el);
  const onSelectionChange = vi.fn();
  const selector = new DiceSelector(el, {
    diceSet: COMMON_DICE_SETS.triple,
    autoRoll: false,
    onSelectionChange,
    ...opts,
  });
  selector.roll();
  await vi.advanceTimersByTimeAsync(900);
  return { el, selector, onSelectionChange };
}

describe('Wave 32 dice-selector-multi — multiSelect true', () => {
  it('clicking two dice accumulates selection', async () => {
    const { el, selector, onSelectionChange } = await rolledSelector({
      multiSelect: true,
    });
    const wrappers = el.querySelectorAll('.die-wrapper');
    expect(wrappers.length).toBe(3);
    (wrappers[0] as HTMLElement).click();
    (wrappers[1] as HTMLElement).click();
    expect(selector.getSelectedDice()).toHaveLength(2);
    expect(onSelectionChange).toHaveBeenCalledTimes(2);
    expect(selector.getSelectedSum()).toBe(
      selector.getSelectedDice().reduce((s, d) => s + d.value, 0)
    );
    selector.destroy();
  });

  it('second click on same die toggles off', async () => {
    const { el, selector } = await rolledSelector({ multiSelect: true });
    const first = el.querySelector('.die-wrapper') as HTMLElement;
    first.click();
    expect(selector.getSelectedDice()).toHaveLength(1);
    first.click();
    expect(selector.getSelectedDice()).toHaveLength(0);
    selector.destroy();
  });
});

describe('Wave 32 dice-selector-multi — multiSelect false', () => {
  it('selecting another die clears the previous selection', async () => {
    const { el, selector } = await rolledSelector({ multiSelect: false });
    const wrappers = [...el.querySelectorAll('.die-wrapper')] as HTMLElement[];
    wrappers[0].click();
    expect(selector.getSelectedDice()).toHaveLength(1);
    const firstId = selector.getSelectedDice()[0].id;
    wrappers[1].click();
    expect(selector.getSelectedDice()).toHaveLength(1);
    expect(selector.getSelectedDice()[0].id).not.toBe(firstId);
    selector.destroy();
  });

  it('locked dice ignore clicks after confirm', async () => {
    const { el, selector } = await rolledSelector({ multiSelect: true });
    const wrappers = [...el.querySelectorAll('.die-wrapper')] as HTMLElement[];
    wrappers[0].click();
    selector.confirm();
    const lockedId = selector.getResult()!.rolls.find((d) => d.isLocked)!.id;
    const before = selector.getSelectedDice().map((d) => d.id);
    const lockedWrapper = el.querySelector(
      `[data-die-id="${lockedId}"]`
    ) as HTMLElement;
    lockedWrapper.click();
    expect(selector.getSelectedDice().map((d) => d.id)).toEqual(before);
    selector.destroy();
  });
});

describe('Wave 32 dice-selector-multi — roll while rolling guard', () => {
  it('second roll during animation is ignored', async () => {
    vi.useFakeTimers();
    mockSteppedRandom();
    const el = document.createElement('div');
    document.body.appendChild(el);
    const onRoll = vi.fn();
    const selector = new DiceSelector(el, {
      diceSet: COMMON_DICE_SETS.standard,
      onRollComplete: onRoll,
    });
    selector.roll();
    selector.roll(); // should no-op while isRolling
    await vi.advanceTimersByTimeAsync(900);
    expect(onRoll).toHaveBeenCalledTimes(1);
    selector.destroy();
  });
});
