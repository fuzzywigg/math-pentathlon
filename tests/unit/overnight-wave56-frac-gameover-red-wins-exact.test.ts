/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Frac Fact Red Wins! 🎉 exact.
 * Wave50/55 covered Blue Wins / regex Red. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { renderGameOver } from '../../src/games/frac-fact/board-ui';

describe('Wave 56 frac board — red banner', () => {
  it('uses Red Wins! 🎉 leftover with Best streak copy', () => {
    const el = renderGameOver({
      ...createInitialState('medium'),
      phase: 'gameOver',
      winner: 'player2',
      player2Stats: {
        score: 40,
        correctAnswers: 3,
        wrongAnswers: 2,
        currentStreak: 0,
        bestStreak: 2,
      },
    });
    expect(el.querySelector('.frac-winner-banner')?.textContent).toBe(
      'Red Wins! 🎉'
    );
    expect(
      el.querySelector('.frac-final-score.player2 .frac-final-value')?.textContent
    ).toBe('40 points');
    expect(
      el.querySelector('.frac-final-score.player2 .frac-final-stats')?.textContent
    ).toMatch(/Best streak: 2/);
  });
});
