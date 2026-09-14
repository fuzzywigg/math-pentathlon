/**
 * Wave 42 — Remainder calculateDivision dense remainder matrix. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { calculateDivision, countOwnedIslands } from '../../src/games/remainder-islands/rules';
import { createInitialState, ISLAND_VALUES, getPlayerChips, getPlayerScore, getOpponent } from '../../src/games/remainder-islands/types';

describe('Wave 42 remainder — division dense matrix', () => {
  it('dice totals 2..12 × island values remainders', () => {
    for (let total = 2; total <= 12; total++) {
      for (const v of ISLAND_VALUES) {
        const d = calculateDivision(total, v);
        expect(d.quotient).toBe(Math.floor(total / v));
        expect(d.remainder).toBe(total % v);
        expect(d.quotient * v + d.remainder).toBe(total);
      }
    }
  });

  it('countOwned empty; helpers flip', () => {
    const s = createInitialState();
    expect(countOwnedIslands(s)).toEqual({ player1: 0, player2: 0 });
    expect(getPlayerChips(s, 'player1')).toBe(12);
    expect(getPlayerScore(s, 'player2')).toBe(0);
    expect(getOpponent('player1')).toBe('player2');
  });
});
