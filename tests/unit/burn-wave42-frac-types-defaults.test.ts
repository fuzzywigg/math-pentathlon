/**
 * Wave 42 — Frac-Fact type defaults + opponent/stats. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  getOpponent,
  getPlayerStats,
  DEFAULT_MAX_PROBLEMS,
  POINTS_PER_CORRECT,
  STREAK_BONUS,
} from '../../src/games/frac-fact/types';

describe('Wave 42 frac-fact — types defaults', () => {
  it('defaults and helpers', () => {
    const s = createInitialState('medium');
    expect(s.maxProblems).toBe(DEFAULT_MAX_PROBLEMS);
    expect(s.difficulty).toBe('medium');
    expect(POINTS_PER_CORRECT).toBe(10);
    expect(STREAK_BONUS).toBe(5);
    expect(getOpponent('player2')).toBe('player1');
    expect(getPlayerStats(s, 'player1').score).toBe(0);
  });
});
