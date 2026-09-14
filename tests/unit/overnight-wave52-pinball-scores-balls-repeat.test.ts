/**
 * Overnight HEAVY leftover after #234 — Pinball scores ballsRemaining icons.
 * Wave48 scores only asserted round + active seat. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { renderScores } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 52 pinball — scores balls', () => {
  it('repeats seat icons for ballsRemaining; zero yields empty', () => {
    const state = {
      ...createInitialState(),
      player1Stats: {
        score: 10,
        correctAnswers: 1,
        wrongAnswers: 0,
        ballsRemaining: 3,
      },
      player2Stats: {
        score: 0,
        correctAnswers: 0,
        wrongAnswers: 2,
        ballsRemaining: 0,
      },
    };
    const el = renderScores(state);
    const balls = el.querySelectorAll('.pinball-balls');
    expect(balls[0].textContent).toBe('🔵🔵🔵');
    expect(balls[1].textContent).toBe('');
  });
});
