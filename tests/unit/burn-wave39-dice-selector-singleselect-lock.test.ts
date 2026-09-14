/**
 * Wave 39 — DiceSelector multiSelect:false exclusivity + confirm lock.
 * Beyond wave38 empty-confirm. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { DiceSelector, COMMON_DICE_SETS } from '../../src/core/dice';

beforeEach(() => {
  document.body.innerHTML = '';
  vi.useFakeTimers();
  let n = 0;
  vi.spyOn(Math, 'random').mockImplementation(() => {
    n += 1;
    return (n % 13) / 13;
  });
});
afterEach(() => {
  document.body.innerHTML = '';
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('Wave 39 dice-selector — single-select lock', () => {
  it('multiSelect false keeps ≤1 selected; confirm locks it', () => {
    const onConfirm = vi.fn();
    const root = document.createElement('div');
    document.body.appendChild(root);
    const sel = new DiceSelector(root, {
      diceSet: COMMON_DICE_SETS.standard,
      multiSelect: false,
      autoRoll: true,
      onConfirm,
    });
    vi.advanceTimersByTime(1000);
    const result = sel.getResult()!;
    expect(result.rolls.length).toBeGreaterThanOrEqual(2);

    const wrappers = root.querySelectorAll('.die-wrapper');
    (wrappers[0] as HTMLElement).click();
    expect(sel.getSelectedDice()).toHaveLength(1);
    (wrappers[1] as HTMLElement).click();
    expect(sel.getSelectedDice()).toHaveLength(1);
    expect(sel.getSelectedDice()[0].id).toBe(result.rolls[1].id);

    (wrappers[1] as HTMLElement).click();
    expect(sel.getSelectedDice()).toHaveLength(0);

    (wrappers[0] as HTMLElement).click();
    sel.confirm();
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(
      sel.getResult()!.rolls.find((d) => d.id === result.rolls[0].id)?.isLocked
    ).toBe(true);
  });
});
