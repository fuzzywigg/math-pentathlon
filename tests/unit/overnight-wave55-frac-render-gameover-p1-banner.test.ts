/**
 * Overnight TOKENMAXX HEAVY leftovers after #250 — Frac Fact gameOver Blue Wins banner exact.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { renderGameOver } from '../../src/games/frac-fact/board-ui';

describe('Wave 55 frac board — p1 banner', () => {
  it('uses Blue Wins leftover with points suffix', () => {
    const el = renderGameOver({
      ...createInitialState('easy'),
      phase: 'gameOver',
      winner: 'player1',
      player1Stats: {
        score: 55,
        correctAnswers: 4,
        wrongAnswers: 1,
        currentStreak: 0,
        bestStreak: 3,
      },
    });
    expect(el.querySelector('.frac-winner-banner')?.textContent).toBe(
      'Blue Wins! 🎉'
    );
    expect(el.querySelector('.frac-final-score.player1 .frac-final-value')?.textContent).toBe(
      '55 points'
    );
    expect(
      el.querySelector('.frac-final-score.player1 .frac-final-stats')?.textContent
    ).toMatch(/4\/5 correct/);
  });
});
