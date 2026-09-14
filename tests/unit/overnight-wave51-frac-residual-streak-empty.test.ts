/**
 * Overnight TOKENMAXX HEAVY leftovers after #234 — Frac Fact empty streak chrome.
 * Distinct from wave50 🔥 2 active progress. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { renderScores } from '../../src/games/frac-fact/board-ui';

describe('Wave 51 frac residual — empty streak', () => {
  it('zero currentStreak leaves .frac-streak empty; positive still shows 🔥', () => {
    const state = {
      ...createInitialState('easy'),
      player1Stats: {
        score: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        currentStreak: 0,
        bestStreak: 0,
      },
      player2Stats: {
        score: 5,
        correctAnswers: 1,
        wrongAnswers: 0,
        currentStreak: 3,
        bestStreak: 3,
      },
    };
    const el = renderScores(state);
    const streaks = [...el.querySelectorAll('.frac-streak')];
    expect(streaks.length).toBe(2);
    expect(streaks[0].textContent).toBe('');
    expect(streaks[1].textContent).toMatch(/🔥\s*3/);
  });
});
