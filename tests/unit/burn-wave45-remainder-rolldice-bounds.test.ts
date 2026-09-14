/**
 * Wave 45 TOKENMAXX — Remainder rollDice bounds leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { rollDice } from '../../src/games/remainder-islands/rules';

describe('Wave 45 remainder — rollDice bounds', () => {
  it('die faces 1–6 and total 2–12 across samples', () => {
    for (let i = 0; i < 40; i++) {
      const r = rollDice();
      expect(r.die1).toBeGreaterThanOrEqual(1);
      expect(r.die1).toBeLessThanOrEqual(6);
      expect(r.die2).toBeGreaterThanOrEqual(1);
      expect(r.die2).toBeLessThanOrEqual(6);
      expect(r.total).toBe(r.die1 + r.die2);
      expect(r.total).toBeGreaterThanOrEqual(2);
      expect(r.total).toBeLessThanOrEqual(12);
    }
  });
});
