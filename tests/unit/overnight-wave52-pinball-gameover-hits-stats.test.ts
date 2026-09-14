/**
 * Overnight HEAVY leftover after #234 — Pinball game-over "N hits" stats.
 * Wave48 gameover only checked Blue/Red/Draw banners. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { renderGameOver } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 52 pinball — gameover hits', () => {
  it('shows per-seat hit counts from correctAnswers', () => {
    const state = {
      ...createInitialState(),
      phase: 'gameOver' as const,
      winner: 'player1' as const,
      player1Stats: {
        score: 120,
        correctAnswers: 2,
        wrongAnswers: 1,
        ballsRemaining: 3,
      },
      player2Stats: {
        score: 40,
        correctAnswers: 5,
        wrongAnswers: 0,
        ballsRemaining: 5,
      },
    };
    const el = renderGameOver(state);
    expect(
      el.querySelector('.pinball-final-score.player1 .pinball-final-stats')?.textContent
    ).toMatch(/2 hits/);
    expect(
      el.querySelector('.pinball-final-score.player2 .pinball-final-stats')?.textContent
    ).toMatch(/5 hits/);
  });
});
