/**
 * Wave 42 — Fraction Pinball balls-exhausted settle leftover.
 * Beyond wave41 tie settle. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import {
  startGame,
  nextChallenge,
} from '../../src/games/fraction-pinball/rules';

describe('Wave 42 pinball — balls exhaust settle', () => {
  it('both balls 0 ends with higher score winner mid-rounds', () => {
    let state = startGame(createInitialState());
    state = {
      ...state,
      phase: 'showResult',
      roundNumber: 3,
      player1Stats: {
        ...state.player1Stats,
        ballsRemaining: 0,
        score: 80,
      },
      player2Stats: {
        ...state.player2Stats,
        ballsRemaining: 0,
        score: 20,
      },
    };
    const next = nextChallenge(state);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player1');
  });

  it('both balls 0 with p2 ahead → player2 winner', () => {
    let state = startGame(createInitialState());
    state = {
      ...state,
      phase: 'showResult',
      roundNumber: 4,
      player1Stats: {
        ...state.player1Stats,
        ballsRemaining: 0,
        score: 15,
      },
      player2Stats: {
        ...state.player2Stats,
        ballsRemaining: 0,
        score: 45,
      },
    };
    const next = nextChallenge(state);
    expect(next.winner).toBe('player2');
    expect(next.selectedAnswer).toBeNull();
    expect(next.isCorrect).toBeNull();
  });
});
