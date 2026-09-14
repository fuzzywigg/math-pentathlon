/**
 * Wave 35 — createRollButton leftovers.
 * Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  createRollButton,
  COMMON_DICE_SETS,
  DICE_FACES,
} from '../../src/core/dice';

beforeEach(() => {
  let n = 0;
  vi.spyOn(Math, 'random').mockImplementation(() => {
    n += 1;
    return (n % 31) / 31;
  });
});

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('Wave 35 dice-roll-btn — callback payload', () => {
  it('appends button and fires onRoll with matching dice count', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const rolls: number[] = [];
    const btn = createRollButton(el, COMMON_DICE_SETS.primeGold, (result) => {
      rolls.push(result.rolls.length);
      expect(result.rolls.map((d) => d.diceType)).toEqual(['d6', 'd8', 'd10']);
      for (const die of result.rolls) {
        expect(die.value).toBeGreaterThanOrEqual(1);
        expect(die.value).toBeLessThanOrEqual(DICE_FACES[die.diceType]);
      }
    });
    expect(btn.textContent).toMatch(/Prime Gold/);
    expect(el.contains(btn)).toBe(true);
    btn.click();
    btn.click();
    expect(rolls).toEqual([3, 3]);
  });
});
