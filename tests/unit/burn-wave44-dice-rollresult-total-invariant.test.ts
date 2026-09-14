/**
 * Wave 44 — RollResult total equals sum of values leftover. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { rollDice, roll, rollMultiple } from '../../src/core/dice';

afterEach(() => vi.restoreAllMocks());

describe('Wave 44 dice — total invariant', () => {
  it('total always equals sum of roll values across helpers', () => {
    let n = 0;
    vi.spyOn(Math, 'random').mockImplementation(() => {
      n += 1;
      return (n % 11) / 11;
    });
    for (const r of [
      rollDice({ dice: ['d4', 'd20', 'd10'] }),
      roll('d6', 'd8'),
      rollMultiple('d12', 4),
    ]) {
      expect(r.total).toBe(r.rolls.reduce((s, d) => s + d.value, 0));
      for (const d of r.rolls) {
        expect(d.isSelected).toBe(false);
        expect(d.isLocked).toBe(false);
        expect(d.value).toBeGreaterThanOrEqual(1);
      }
    }
  });
});
