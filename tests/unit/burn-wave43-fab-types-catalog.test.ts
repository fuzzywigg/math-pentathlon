/**
 * Wave 43 TOKENMAXX — Fab-a-Diffy types/catalog leftovers. Tests-only.
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

describe('Wave 43 fab — types catalog', () => {
  it('CONFIG.TOTAL_ROUNDS positive', () => {
    expect(CONFIG.TOTAL_ROUNDS).toBeGreaterThan(0);
  });

  it('fraction bar dens cover 2–12 family and stay positive', () => {
    const dens = new Set(FRACTION_BAR_VALUES.map((f) => f.denominator));
    for (const d of [2, 3, 4, 5, 6, 8, 10, 12]) expect(dens.has(d)).toBe(true);
    expect(FRACTION_BAR_VALUES.length).toBeGreaterThan(30);
    for (const f of FRACTION_BAR_VALUES) {
      expect(f.numerator).toBeGreaterThan(0);
      expect(f.denominator).toBeGreaterThan(0);
      expect(f.numerator).toBeLessThan(f.denominator);
    }
  });

  it('answer bars include 0/1 and 1/1 plus unclaimed-style positives', () => {
    expect(ANSWER_BAR_VALUES.some((f) => f.numerator === 0 && f.denominator === 1)).toBe(true);
    expect(ANSWER_BAR_VALUES.some((f) => f.numerator === 1 && f.denominator === 1)).toBe(true);
    expect(ANSWER_BAR_VALUES.length).toBeGreaterThan(10);
  });

  it('id helpers and opponent flip', () => {
    expect(createBarId(3)).toBe('bar-3');
    expect(createAnswerId(7)).toBe('answer-7');
    expect(getOpponent('player1')).toBe('player2');
    expect(getOpponent('player2')).toBe('player1');
  });

  it('shuffleArray permutes without mutating source', () => {
    const src = [1, 2, 3, 4, 5, 6, 7, 8];
    const copy = [...src];
    const out = shuffleArray(src);
    expect(src).toEqual(copy);
    expect(out).toHaveLength(src.length);
    expect([...out].sort((a, b) => a - b)).toEqual(src);
  });
});
