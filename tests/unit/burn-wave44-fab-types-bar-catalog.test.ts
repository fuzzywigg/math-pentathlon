/**
 * Wave 44 overnight HEAVY — Fab-a-Diffy fraction/answer catalogs.
 * Tests-only leftover after #196/#200. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import {
  FRACTION_BAR_VALUES,
  ANSWER_BAR_VALUES,
  CONFIG,
  createBarId,
  createAnswerId,
  getOpponent,
} from '../../src/games/fab-a-diffy/types';

describe('Wave 44 fab types — catalogs', () => {
  it('fraction bar catalog size and denom range', () => {
    expect(FRACTION_BAR_VALUES.length).toBe(42);
    for (const f of FRACTION_BAR_VALUES) {
      expect(f.numerator).toBeGreaterThan(0);
      expect(f.denominator).toBeGreaterThanOrEqual(2);
      expect(f.denominator).toBeLessThanOrEqual(12);
      expect(f.numerator).toBeLessThan(f.denominator);
    }
  });

  it('answer catalog includes wholes and zero', () => {
    expect(ANSWER_BAR_VALUES.length).toBe(21);
    expect(ANSWER_BAR_VALUES.some((a) => a.numerator === 1 && a.denominator === 1)).toBe(true);
    expect(ANSWER_BAR_VALUES.some((a) => a.numerator === 0 && a.denominator === 1)).toBe(true);
  });

  it('CONFIG / ids / opponent helpers', () => {
    expect(CONFIG.TOTAL_ROUNDS).toBe(10);
    expect(createBarId(0)).toBe('bar-0');
    expect(createAnswerId(3)).toBe('answer-3');
    expect(getOpponent('player1')).toBe('player2');
    expect(getOpponent('player2')).toBe('player1');
  });
});
