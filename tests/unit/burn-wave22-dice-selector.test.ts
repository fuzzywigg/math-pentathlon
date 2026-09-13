/**
 * Wave 22 — DiceSelector lifecycle / confirm / createRollButton.
 * First dedicated burn coverage of src/core/dice/dice-selector.ts.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';

import {
  DiceSelector,
  createRollButton,
  COMMON_DICE_SETS,
  type DiceSet,
} from '../../src/core/dice';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('dice-selector-styles')?.remove();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

beforeEach(() => {
  // Keep rolls on face 1 (r < 1/faces) while giving generateId distinct strings.
  let call = 0;
  vi.spyOn(Math, 'random').mockImplementation(() => {
    call += 1;
    return (call % 40) / 10000; // 0.0001..0.0039
  });
});

function mountSelector(
  opts: ConstructorParameters<typeof DiceSelector>[1] = {}
): { host: HTMLElement; selector: DiceSelector } {
  const host = document.createElement('div');
  document.body.appendChild(host);
  const selector = new DiceSelector(host, opts);
  return { host, selector };
}

function finishRoll(): void {
  vi.advanceTimersByTime(900);
}

describe('Wave 22 dice-selector — mount chrome', () => {
  it('renders header, placeholder, roll button, and injects styles once', () => {
    const { host } = mountSelector({ diceSet: COMMON_DICE_SETS.triple });
    expect(host.classList.contains('dice-selector')).toBe(true);
    expect(host.querySelector('.dice-selector-header')?.textContent).toBe(
      COMMON_DICE_SETS.triple.name
    );
    expect(host.querySelector('.dice-placeholder')?.textContent).toMatch(/Roll/);
    expect(host.querySelector('.dice-btn-primary')?.textContent).toBe('Roll');
    expect(document.getElementById('dice-selector-styles')).toBeTruthy();

    // second selector must not duplicate style tag
    const host2 = document.createElement('div');
    document.body.appendChild(host2);
    new DiceSelector(host2, { diceSet: COMMON_DICE_SETS.standard });
    expect(document.querySelectorAll('#dice-selector-styles')).toHaveLength(1);
  });

  it('autoRoll settles result and fires onRollComplete', () => {
    vi.useFakeTimers();
    const rolls: number[] = [];
    const { selector } = mountSelector({
      autoRoll: true,
      showPossibleSums: true,
      onRollComplete: (r) => rolls.push(r.total),
    });
    finishRoll();
    expect(selector.getResult()?.rolls).toHaveLength(2);
    expect(selector.getResult()?.total).toBe(2);
    expect(rolls).toEqual([2]);
    expect(document.querySelector('.possible-sums')).toBeTruthy();
    expect(document.querySelector('.dice-btn-success')?.textContent).toBe(
      'Confirm'
    );
  });
});

describe('Wave 22 dice-selector — selection modes + confirm', () => {
  it('multiSelect toggles dice and confirm locks selection', () => {
    vi.useFakeTimers();
    const selections: Array<{ count: number; sum: number }> = [];
    const confirms: Array<{ count: number; sum: number }> = [];

    const { host, selector } = mountSelector({
      multiSelect: true,
      onSelectionChange: (dice, sum) =>
        selections.push({ count: dice.length, sum }),
      onConfirm: (dice, sum) => confirms.push({ count: dice.length, sum }),
    });

    (host.querySelector('.dice-btn-primary') as HTMLButtonElement).click();
    finishRoll();
    expect(selector.getResult()?.rolls).toHaveLength(2);

    // re-query after each click — render() replaces die-wrapper nodes
    const clickDie = (index: number) => {
      const wrappers = [
        ...host.querySelectorAll('#dice-result-area .die-wrapper'),
      ] as HTMLElement[];
      expect(wrappers.length).toBeGreaterThan(index);
      wrappers[index].click();
    };
    clickDie(0);
    clickDie(1);
    expect(selector.getSelectedDice()).toHaveLength(2);
    expect(selector.getSelectedSum()).toBe(2);
    expect(selections.at(-1)).toEqual({ count: 2, sum: 2 });

    (host.querySelector('.dice-btn-success') as HTMLButtonElement).click();
    expect(confirms).toEqual([{ count: 2, sum: 2 }]);
    expect(selector.getResult()?.rolls.every((d) => d.isLocked)).toBe(true);
    expect(host.querySelectorAll('.die-wrapper.used')).toHaveLength(2);
  });

  it('single-select mode keeps at most one die selected', () => {
    vi.useFakeTimers();
    const { host, selector } = mountSelector({
      multiSelect: false,
      diceSet: COMMON_DICE_SETS.triple,
    });
    selector.roll();
    finishRoll();
    expect(selector.getResult()?.rolls).toHaveLength(3);

    const clickDie = (index: number) => {
      (
        host.querySelectorAll(
          '#dice-result-area .die-wrapper'
        )[index] as HTMLElement
      ).click();
    };
    clickDie(0);
    clickDie(1);
    expect(selector.getSelectedDice()).toHaveLength(1);
    expect(selector.getSelectedDice()[0].id).toBe(
      selector.getResult()!.rolls[1].id
    );
  });

  it('confirm with nothing selected is a no-op; reset clears result', () => {
    vi.useFakeTimers();
    const confirms: number[] = [];
    const { host, selector } = mountSelector({
      onConfirm: () => confirms.push(1),
    });
    selector.roll();
    finishRoll();

    const confirmBtn = host.querySelector(
      '.dice-btn-success'
    ) as HTMLButtonElement;
    expect(confirmBtn.disabled).toBe(true);
    confirmBtn.click();
    expect(confirms).toEqual([]);

    selector.reset();
    expect(selector.getResult()).toBeNull();
    expect(selector.getSelectedDice()).toEqual([]);
    expect(selector.getSelectedSum()).toBe(0);
    expect(host.querySelector('.dice-placeholder')).toBeTruthy();
  });

  it('setDiceSet swaps catalog and destroy clears DOM', () => {
    vi.useFakeTimers();
    const custom: DiceSet = {
      id: 'custom',
      name: 'Custom Poly',
      dice: [{ type: 'd20', faces: 20, color: '#000' }],
    };
    const { host, selector } = mountSelector();
    selector.roll();
    finishRoll();
    expect(selector.getResult()?.rolls).toHaveLength(2);

    selector.setDiceSet(custom);
    expect(host.querySelector('.dice-selector-header')?.textContent).toBe(
      'Custom Poly'
    );
    expect(selector.getResult()).toBeNull();

    selector.roll();
    finishRoll();
    expect(selector.getResult()?.rolls).toHaveLength(1);
    expect(selector.getResult()?.rolls[0].diceType).toBe('d20');

    selector.destroy();
    expect(host.innerHTML).toBe('');
  });

  it('customDice override set types; roll while rolling is ignored', () => {
    vi.useFakeTimers();
    const completes: number[] = [];
    const { host, selector } = mountSelector({
      customDice: [
        { type: 'd4', faces: 4 },
        { type: 'd8', faces: 8 },
        { type: 'd10', faces: 10 },
      ],
      onRollComplete: () => completes.push(1),
    });

    selector.roll();
    // mid-animation second roll must no-op
    selector.roll();
    finishRoll();
    expect(completes).toEqual([1]);
    expect(selector.getResult()?.rolls.map((d) => d.diceType)).toEqual([
      'd4',
      'd8',
      'd10',
    ]);
    expect(host.querySelector('.dice-btn-primary')?.textContent).toBe(
      'Roll Again'
    );
  });
});

describe('Wave 22 dice-selector — createRollButton', () => {
  it('appends a primary button that rolls the named set', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const seen: number[] = [];
    const btn = createRollButton(host, COMMON_DICE_SETS.primeGold, (r) =>
      seen.push(r.rolls.length)
    );
    expect(btn.textContent).toBe(`Roll ${COMMON_DICE_SETS.primeGold.name}`);
    expect(btn.classList.contains('dice-btn-primary')).toBe(true);
    btn.click();
    expect(seen).toEqual([3]);
  });
});
