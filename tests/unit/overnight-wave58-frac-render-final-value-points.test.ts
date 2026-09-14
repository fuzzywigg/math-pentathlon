/**
 * Overnight TOKENMAXX HEAVY leftovers after #272 — Frac Fact final-value "points" suffix.
 * Wave57 locked stats; deepen points label leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { renderGameOver } from '../../src/games/frac-fact/board-ui';

describe('Wave 58 frac board — final value points', () => {
  it('renders score with points suffix leftover', () => {
    const el = renderGameOver({
      ...createInitialState('easy'),
      phase: 'gameOver',
      winner: 'player1',
      player1Stats: {
        score: 25,
        correctAnswers: 2,
        wrongAnswers: 1,
        currentStreak: 0,
        bestStreak: 1,
      },
    });
    expect(
      el.querySelector('.frac-final-score.player1 .frac-final-value')
        ?.textContent
    ).toBe('25 points');
  });
});
