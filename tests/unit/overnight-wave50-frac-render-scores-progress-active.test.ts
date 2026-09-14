/**
 * Overnight HEAVY leftover after #229 — Frac Fact scores progress + active seat. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { renderScores } from '../../src/games/frac-fact/board-ui';

describe('Wave 50 frac — scores progress', () => {
  it('marks current seat active and shows Problem N of M + fill width', () => {
    const state = {
      ...createInitialState('medium'),
      currentPlayer: 'player2' as const,
      problemsCompleted: 3,
      maxProblems: 10,
      player1Stats: {
        score: 20,
        correctAnswers: 2,
        wrongAnswers: 0,
        currentStreak: 2,
        bestStreak: 2,
      },
      player2Stats: {
        score: 10,
        correctAnswers: 1,
        wrongAnswers: 1,
        currentStreak: 0,
        bestStreak: 1,
      },
    };
    const el = renderScores(state);
    expect(el.querySelectorAll('.frac-player-score')[0].classList.contains('active')).toBe(false);
    expect(el.querySelectorAll('.frac-player-score')[1].classList.contains('active')).toBe(true);
    expect(el.querySelector('.frac-progress-text')?.textContent).toBe('Problem 4 of 10');
    expect(el.querySelector('.frac-progress-fill')?.getAttribute('style')).toMatch(/width: 30%/);
    expect(el.querySelector('.frac-player-name.player1')?.textContent).toMatch(/Blue/);
    expect(el.querySelector('.frac-player-name.player2')?.textContent).toMatch(/Red/);
    expect(el.querySelectorAll('.frac-score-value')[0].textContent).toBe('20');
    expect(el.textContent).toMatch(/🔥 2/);
  });
});
