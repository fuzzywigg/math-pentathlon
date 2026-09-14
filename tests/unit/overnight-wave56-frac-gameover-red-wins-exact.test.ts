/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Frac Fact Red Wins exact banner.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { renderGameOver } from '../../src/games/frac-fact/board-ui';

describe('Wave 56 frac board — Red Wins exact', () => {
  it('banner text is Red Wins! 🎉 leftover', () => {
    const el = renderGameOver({
      ...createInitialState('easy'),
      phase: 'gameOver',
      winner: 'player2',
      player2Stats: {
        score: 40,
        correctAnswers: 4,
        wrongAnswers: 1,
        currentStreak: 0,
        bestStreak: 2,
      },
    });
    expect(el.querySelector('.frac-winner-banner')?.textContent).toBe(
      'Red Wins! 🎉'
    );
  });
});
