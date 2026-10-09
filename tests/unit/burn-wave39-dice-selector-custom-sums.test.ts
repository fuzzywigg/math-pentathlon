/**
 * Wave 39 — customDice override + showPossibleSums achievable mark.
 * Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { DiceSelector } from '../../src/core/dice/dice-selector';
import { getAllPossibleSums } from '../../src/core/dice/roller';
import { DICE_CONFIGS, COMMON_DICE_SETS } from '../../src/core/dice/types';

beforeEach(() => {
  document.body.innerHTML = '';
  vi.useFakeTimers();
  let n = 0;
  vi.spyOn(Math, 'random').mockImplementation(() => {
    n += 1;
    return (n % 11) / 11;
  });
});
afterEach(() => {
  document.body.innerHTML = '';
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('Wave 39 dice-selector — custom sums', () => {
  it('customDice overrides set length and marks selected sum', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const sel = new DiceSelector(root, {
      diceSet: COMMON_DICE_SETS.standard,
      customDice: [DICE_CONFIGS.d4, DICE_CONFIGS.d4],
      showPossibleSums: true,
      autoRoll: true,
      multiSelect: true,
    });
    vi.advanceTimersByTime(1000);
    const result = sel.getResult()!;
    expect(result.rolls).toHaveLength(2);
    expect(result.rolls.every((d) => d.diceType === 'd4')).toBe(true);

    const wrappers = root.querySelectorAll('.die-wrapper');
    (wrappers[0] as HTMLElement).click();
    (wrappers[1] as HTMLElement).click();
    const sum = sel.getSelectedSum();
    const possible = getAllPossibleSums(result.rolls.map((d) => d.value));
    expect(possible).toContain(sum);
    const marked = root.querySelector('.possible-sum.achievable');
    expect(marked?.textContent).toBe(String(sum));
  });
});
