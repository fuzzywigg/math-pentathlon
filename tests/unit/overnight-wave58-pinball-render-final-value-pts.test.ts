/**
 * Overnight TOKENMAXX HEAVY leftovers after #272 — Pinball final-value pts suffix.
 * Deepen "pts" label leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { renderGameOver } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 58 pinball board — final value pts', () => {
  it('renders score with pts suffix leftover', () => {
    const el = renderGameOver({
      ...createInitialState(),
      phase: 'gameOver',
      winner: 'player2',
      player2Stats: {
        score: 40,
        correctAnswers: 2,
        wrongAnswers: 1,
        ballsRemaining: 3,
      },
    });
    expect(
      el.querySelector('.pinball-final-score.player2 .pinball-final-value')
        ?.textContent
    ).toBe('40 pts');
  });
});
