/**
 * Wave 39 — roll()/reroll empty leftovers after #172/#173.
 * Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { roll, rollMultiple, rerollDice } from '../../src/core/dice';

beforeEach(() => {
  let n = 0;
  vi.spyOn(Math, 'random').mockImplementation(() => {
    n = (n + 1) % 97;
    return n / 97;
  });
});
afterEach(() => {
  vi.restoreAllMocks();
});

describe('Wave 39 dice — empty roll / reroll noop', () => {
  it('roll() with no types yields empty rolls and total 0', () => {
    const r = roll();
    expect(r.rolls).toEqual([]);
    expect(r.total).toBe(0);
  });

  it('rollMultiple count 0 is empty', () => {
    const r = rollMultiple('d6', 0);
    expect(r.rolls).toHaveLength(0);
    expect(r.total).toBe(0);
  });

  it('rerollDice with empty ids is identity on values', () => {
    const r = roll('d6', 'd8');
    const again = rerollDice(r, []);
    expect(again.rolls.map((d) => d.value)).toEqual(
      r.rolls.map((d) => d.value)
    );
    expect(again.total).toBe(r.total);
    expect(again.id).not.toBe(r.id);
  });
});
