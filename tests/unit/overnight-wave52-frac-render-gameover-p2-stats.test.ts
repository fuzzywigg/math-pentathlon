/**
 * Overnight HEAVY leftover after #234 — Frac Fact game-over p2 final stats.
 * Wave50 only asserted player1 points/ratio/streak. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { renderGameOver } from '../../src/games/frac-fact/board-ui';

describe('Wave 52 frac — gameover p2 stats', () => {
  it('renders Red points, correct ratio, and best streak', () => {
    const state = {
      ...createInitialState('easy'),
      phase: 'gameOver' as const,
      winner: 'player2' as const,
      player1Stats: {
        score: 20,
        correctAnswers: 2,
        wrongAnswers: 1,
        currentStreak: 0,
        bestStreak: 1,
      },
      player2Stats: {
        score: 55,
        correctAnswers: 4,
        wrongAnswers: 2,
        currentStreak: 0,
        bestStreak: 4,
      },
    };
    const p2 = renderGameOver(state).querySelector('.frac-final-score.player2');
    expect(p2?.textContent).toMatch(/55 points/);
    expect(p2?.textContent).toMatch(/4\/6 correct/);
    expect(p2?.textContent).toMatch(/Best streak: 4/);
  });
});
