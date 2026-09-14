/**
 * Overnight TOKENMAXX HEAVY leftovers after #250 — Pinball nextChallenge p2 win on dual drain.
 * Wave42 asserted gameOver without winner. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { nextChallenge } from '../../src/games/fraction-pinball/rules';

describe('Wave 55 pinball rules — p2 win dual drain', () => {
  it('sets winner player2 when p2 score is higher leftover', () => {
    const next = nextChallenge({
      ...createInitialState(),
      phase: 'showResult',
      roundNumber: 3,
      player1Stats: {
        score: 10,
        correctAnswers: 1,
        wrongAnswers: 5,
        ballsRemaining: 0,
      },
      player2Stats: {
        score: 80,
        correctAnswers: 4,
        wrongAnswers: 5,
        ballsRemaining: 0,
      },
    });
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player2');
    expect(next.currentChallenge).toBeNull();
  });
});
