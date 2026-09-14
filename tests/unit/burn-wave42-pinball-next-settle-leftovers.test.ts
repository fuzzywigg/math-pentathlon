/**
 * Wave 42 — Fraction Pinball nextChallenge settle leftovers.
 * Beyond wave41 maxRounds / tie. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import {
  startGame,
  nextChallenge,
  submitAnswer,
} from '../../src/games/fraction-pinball/rules';

describe('Wave 42 pinball — nextChallenge settle', () => {
  it('player2 higher score wins at maxRounds', () => {
    let state = startGame(createInitialState());
    state = {
      ...state,
      phase: 'showResult',
      roundNumber: state.maxRounds,
      player1Stats: { ...state.player1Stats, score: 10 },
      player2Stats: { ...state.player2Stats, score: 50 },
    };
    const next = nextChallenge(state);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player2');
    expect(next.currentChallenge).toBeNull();
  });

  it('single-side balls depleted continues while rounds remain', () => {
    let state = startGame(createInitialState());
    state = submitAnswer(state, state.currentChallenge!.correctAnswer);
    state = {
      ...state,
      player1Stats: { ...state.player1Stats, ballsRemaining: 0 },
      player2Stats: { ...state.player2Stats, ballsRemaining: 3 },
      roundNumber: 2,
    };
    const next = nextChallenge(state);
    expect(next.phase).toBe('answering');
    expect(next.winner).toBeNull();
    expect(next.currentPlayer).toBe('player2');
  });

  it('clears selectedAnswer / isCorrect on continue', () => {
    let state = startGame(createInitialState());
    state = submitAnswer(state, state.currentChallenge!.correctAnswer);
    expect(state.selectedAnswer).not.toBeNull();
    const next = nextChallenge(state);
    expect(next.selectedAnswer).toBeNull();
    expect(next.isCorrect).toBeNull();
    expect(next.roundNumber).toBe(2);
  });
});
