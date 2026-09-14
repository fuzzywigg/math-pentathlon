/**
 * Wave 59 Contig/SD residual — Sum rollDice face bounds. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { rollDice, getDiceSum } from '../../src/games/sum-dominoes/types';

describe('Wave 59 sum — rollDice bounds', () => {
  it('two faces in 1..6 and sum in 2..12', () => {
    for (let i = 0; i < 40; i++) {
      const dice = rollDice();
      expect(dice).toHaveLength(2);
      expect(dice[0]).toBeGreaterThanOrEqual(1);
      expect(dice[0]).toBeLessThanOrEqual(6);
      expect(dice[1]).toBeGreaterThanOrEqual(1);
      expect(dice[1]).toBeLessThanOrEqual(6);
      const sum = getDiceSum(dice);
      expect(sum).toBeGreaterThanOrEqual(2);
      expect(sum).toBeLessThanOrEqual(12);
    }
  });
});
