/**
 * Overnight TOKENMAXX HEAVY leftovers after #250 — Frac Fact scoring constants.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  DEFAULT_MAX_PROBLEMS,
  POINTS_PER_CORRECT,
  STREAK_BONUS,
} from '../../src/games/frac-fact/types';

describe('Wave 55 frac types — scoring constants', () => {
  it('keeps 10 problems / 10 points / +5 streak leftover', () => {
    expect(DEFAULT_MAX_PROBLEMS).toBe(10);
    expect(POINTS_PER_CORRECT).toBe(10);
    expect(STREAK_BONUS).toBe(5);
  });
});
