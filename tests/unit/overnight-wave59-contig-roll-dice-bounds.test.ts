/**
 * Wave 59 Contig/SD residual — Contig rollDice face bounds. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { rollDice } from '../../src/games/contig-60/types';

describe('Wave 59 contig — rollDice bounds', () => {
  it('three faces each in 1..6', () => {
    for (let i = 0; i < 40; i++) {
      const dice = rollDice();
      expect(dice).toHaveLength(3);
      for (const f of dice) {
        expect(f).toBeGreaterThanOrEqual(1);
        expect(f).toBeLessThanOrEqual(6);
      }
    }
  });
});
