/**
 * Overnight TOKENMAXX — Fab-a-Diffy types/catalog leftovers after #197. Tests-only. Not demos.
 */
import { describe, it, expect } from 'vitest';
import {
  CONFIG,
  FRACTION_BAR_VALUES,
  ANSWER_BAR_VALUES,
  createBarId,
  createAnswerId,
  getOpponent,
  shuffleArray,
} from '../../src/games/fab-a-diffy/types';

describe('Overnight fab — catalog invariants', () => {
  it('CONFIG and id helpers', () => {
    expect(CONFIG.TOTAL_ROUNDS).toBe(10);
    expect(createBarId(0)).toMatch(/bar/);
    expect(createAnswerId(3)).toMatch(/answer/);
    expect(getOpponent('player1')).toBe('player2');
    expect(getOpponent('player2')).toBe('player1');
  });

  it('fraction/answer catalogs are non-empty positive dens', () => {
    expect(FRACTION_BAR_VALUES.length).toBeGreaterThan(10);
    expect(ANSWER_BAR_VALUES.length).toBeGreaterThan(5);
    for (const f of [...FRACTION_BAR_VALUES, ...ANSWER_BAR_VALUES]) {
      expect(f.denominator).toBeGreaterThan(0);
      expect(f.numerator).toBeGreaterThanOrEqual(0);
    }
  });

  it('shuffleArray permutes without dropping ids', () => {
    const arr = [1, 2, 3, 4, 5];
    const shuffled = shuffleArray(arr);
    expect(shuffled).toHaveLength(5);
    expect([...shuffled].sort()).toEqual([1, 2, 3, 4, 5]);
    expect(arr).toEqual([1, 2, 3, 4, 5]);
  });
});
