/**
 * Overnight TOKENMAXX HEAVY leftovers after #250 — Pinball gameOver Blue Wins trophy leftover.
 * Wave54 trophy exact on generic winner; pin p1 + pts leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { renderGameOver } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 55 pinball board — p1 trophy', () => {
  it('Blue Wins trophy leftover', () => {
    const el = renderGameOver({
      ...createInitialState(),
      phase: 'gameOver',
      winner: 'player1',
      player1Stats: {
        score: 120,
        correctAnswers: 5,
        wrongAnswers: 0,
        ballsRemaining: 2,
      },
    });
    expect(el.querySelector('.pinball-winner-banner')?.textContent).toBe(
      'Blue Wins! 🏆'
    );
    expect(
      el.querySelector('.pinball-final-score.player1 .pinball-final-value')?.textContent
    ).toBe('120 pts');
  });
});
