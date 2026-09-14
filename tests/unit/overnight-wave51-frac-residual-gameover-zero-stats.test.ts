/**
 * Overnight TOKENMAXX HEAVY leftovers after #234 — Frac Fact game-over zero stats.
 * Distinct from wave50 non-zero 4/5 banners. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { renderGameOver } from '../../src/games/frac-fact/board-ui';

describe('Wave 51 frac residual — gameover zero stats', () => {
  it('Draw banner still renders 0/0 correct and Best streak: 0', () => {
    const state = {
      ...createInitialState('easy'),
      phase: 'gameOver' as const,
      winner: null,
      player1Stats: {
        score: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        currentStreak: 0,
        bestStreak: 0,
      },
      player2Stats: {
        score: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        currentStreak: 0,
        bestStreak: 0,
      },
    };
    const el = renderGameOver(state);
    expect(el.querySelector('.frac-winner-banner')?.textContent).toMatch(
      /It's a Draw!/
    );
    expect(el.querySelector('.frac-final-score.player1')?.textContent ?? '').toMatch(
      /0\/0 correct/
    );
    expect(el.querySelector('.frac-final-score.player1')?.textContent ?? '').toMatch(
      /Best streak: 0/
    );
    expect(el.querySelector('.frac-final-score.player2')?.textContent ?? '').toMatch(
      /0\/0 correct/
    );
  });
});
