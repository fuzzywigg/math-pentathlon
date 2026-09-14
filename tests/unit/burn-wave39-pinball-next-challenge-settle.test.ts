/**
 * Wave 39 — Fraction Pinball nextChallenge settle / continue leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import {
  startGame,
  nextChallenge,
  submitAnswer,
} from '../../src/games/fraction-pinball/rules';

describe('Wave 39 Pinball — next challenge settle', () => {
  it('nextChallenge mid-game swaps player and advances round', () => {
    let state = startGame(createInitialState());
    state = submitAnswer(state, state.currentChallenge!.correctAnswer);
    const prevRound = state.roundNumber;
    state = nextChallenge(state);
    expect(state.phase).toBe('answering');
    expect(state.currentPlayer).toBe('player2');
    expect(state.roundNumber).toBe(prevRound + 1);
    expect(state.currentChallenge).not.toBeNull();
    expect(state.selectedAnswer).toBeNull();
  });

  it('nextChallenge past maxRounds settles by score', () => {
    let state = startGame(createInitialState());
    state = {
      ...state,
      phase: 'showResult',
      roundNumber: state.maxRounds,
      player1Stats: { ...state.player1Stats, score: 40 },
      player2Stats: { ...state.player2Stats, score: 10 },
    };
    const next = nextChallenge(state);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player1');
  });

  it('tie scores yield null winner when balls exhausted', () => {
    let state = startGame(createInitialState());
    state = {
      ...state,
      phase: 'showResult',
      player1Stats: { ...state.player1Stats, ballsRemaining: 0, score: 20 },
      player2Stats: { ...state.player2Stats, ballsRemaining: 0, score: 20 },
    };
    const next = nextChallenge(state);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBeNull();
  });
});
