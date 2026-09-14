/**
 * Overnight TOKENMAXX HEAVY leftovers after #250 — Frac Fact scores p2 active + streak fire.
 * Wave52 empty streak only. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { renderScores } from '../../src/games/frac-fact/board-ui';

describe('Wave 55 frac board — p2 active streak', () => {
  it('marks player2 active and shows fire streak leftover', () => {
    const el = renderScores({
      ...createInitialState('medium'),
      currentPlayer: 'player2',
      problemsCompleted: 3,
      player2Stats: {
        score: 25,
        correctAnswers: 2,
        wrongAnswers: 0,
        currentStreak: 2,
        bestStreak: 2,
      },
    });
    const scores = el.querySelectorAll('.frac-player-score');
    expect(scores[0].classList.contains('active')).toBe(false);
    expect(scores[1].classList.contains('active')).toBe(true);
    expect(scores[1].querySelector('.frac-streak')?.textContent).toMatch(/🔥 2/);
    expect(el.querySelector('.frac-progress-text')?.textContent).toBe(
      'Problem 4 of 10'
    );
  });
});
