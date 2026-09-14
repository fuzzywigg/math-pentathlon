/**
 * Overnight HEAVY leftover after #234 — Frac Fact empty streak node for zero seat.
 * Wave50 showed 🔥 2 somewhere but never asserted empty seat streak. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { renderScores } from '../../src/games/frac-fact/board-ui';

describe('Wave 52 frac — empty streak', () => {
  it('zero-streak seat renders empty .frac-streak', () => {
    const state = {
      ...createInitialState('medium'),
      currentPlayer: 'player1' as const,
      player1Stats: {
        score: 20,
        correctAnswers: 2,
        wrongAnswers: 0,
        currentStreak: 2,
        bestStreak: 2,
      },
      player2Stats: {
        score: 0,
        correctAnswers: 0,
        wrongAnswers: 1,
        currentStreak: 0,
        bestStreak: 0,
      },
    };
    const el = renderScores(state);
    const streaks = el.querySelectorAll('.frac-streak');
    expect(streaks[0].textContent).toMatch(/🔥 2/);
    expect(streaks[1].textContent).toBe('');
  });
});
