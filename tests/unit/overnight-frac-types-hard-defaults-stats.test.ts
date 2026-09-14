/**
 * Overnight TOKENMAXX — Frac-Fact types defaults leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  getPlayerStats,
  DEFAULT_MAX_PROBLEMS,
  POINTS_PER_CORRECT,
  STREAK_BONUS,
} from '../../src/games/frac-fact/types';

describe('Overnight frac-fact — types defaults', () => {
  it('hard difficulty and constant catalog', () => {
    const s = createInitialState('hard');
    expect(s.difficulty).toBe('hard');
    expect(DEFAULT_MAX_PROBLEMS).toBe(10);
    expect(POINTS_PER_CORRECT).toBe(10);
    expect(STREAK_BONUS).toBe(5);
    expect(getPlayerStats(s, 'player2').score).toBe(0);
    expect(getPlayerStats(s, 'player1').correctAnswers).toBe(0);
  });
});
