/**
 * Wave 35 — DiceSelector showPossibleSums panel leftovers (not #161 controls).
 * Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { DiceSelector, COMMON_DICE_SETS, getAllPossibleSums } from '../../src/core/dice';

beforeEach(() => {
  let n = 0;
  vi.spyOn(Math, 'random').mockImplementation(() => {
    n += 1;
    return (n % 43) / 43;
  });
});

afterEach(() => {
  document.body.innerHTML = '';
  document
    .querySelectorAll('#dice-selector-styles')
    .forEach((el) => el.remove());
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('Wave 35 dice-selector-sums — possible sums UI', () => {
  it('renders possible-sums chips matching roller after roll', async () => {
    vi.useFakeTimers();
    const el = document.createElement('div');
    document.body.appendChild(el);
    const selector = new DiceSelector(el, {
      diceSet: COMMON_DICE_SETS.triple,
      showPossibleSums: true,
      multiSelect: true,
    });
    selector.roll();
    await vi.advanceTimersByTimeAsync(900);
    const result = selector.getResult()!;
    const expected = getAllPossibleSums(result.rolls.map((d) => d.value));
    const panel = el.querySelector('.possible-sums');
    expect(panel).toBeTruthy();
    const chips = [...el.querySelectorAll('.possible-sum')].map((c) =>
      Number(c.textContent)
    );
    expect(chips.sort((a, b) => a - b)).toEqual(expected);
    selector.destroy();
  });

  it('showPossibleSums false omits panel', async () => {
    vi.useFakeTimers();
    const el = document.createElement('div');
    document.body.appendChild(el);
    const selector = new DiceSelector(el, {
      diceSet: COMMON_DICE_SETS.standard,
      showPossibleSums: false,
    });
    selector.roll();
    await vi.advanceTimersByTimeAsync(900);
    expect(el.querySelector('.possible-sums')).toBeNull();
    selector.destroy();
  });
});
