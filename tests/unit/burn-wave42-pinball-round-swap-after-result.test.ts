/** Wave 42 — Pinball round swap after showResult via nextChallenge. Tests-only. */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import {
  startGame,
  submitAnswer,
  nextChallenge,
} from '../../src/games/fraction-pinball/rules';

describe('Wave 42 Pinball — round swap after result', () => {
  it('after correct result, nextChallenge flips to player2 and bumps round', () => {
    let state = startGame(createInitialState());
    expect(state.roundNumber).toBe(1);
    state = submitAnswer(state, state.currentChallenge!.correctAnswer);
    expect(state.phase).toBe('showResult');
    const prevId = state.currentChallenge!.id;
    state = nextChallenge(state);
    expect(state.phase).toBe('answering');
    expect(state.currentPlayer).toBe('player2');
    expect(state.roundNumber).toBe(2);
    expect(state.currentChallenge!.id).not.toBe(prevId);
  });

  it('after wrong result, nextChallenge still swaps seats', () => {
    let state = startGame(createInitialState());
    state = submitAnswer(state, '__wrong__');
    expect(state.isCorrect).toBe(false);
    state = nextChallenge(state);
    expect(state.currentPlayer).toBe('player2');
    expect(state.roundNumber).toBe(2);
    expect(state.selectedAnswer).toBeNull();
    expect(state.isCorrect).toBeNull();
  });

  it('second nextChallenge returns seat to player1', () => {
    let state = startGame(createInitialState());
    state = submitAnswer(state, state.currentChallenge!.correctAnswer);
    state = nextChallenge(state);
    state = submitAnswer(state, state.currentChallenge!.correctAnswer);
    state = nextChallenge(state);
    expect(state.currentPlayer).toBe('player1');
    expect(state.roundNumber).toBe(3);
  });

  it('challenge type alternates with round parity', () => {
    let state = startGame(createInitialState());
    // round 1 odd → decimalToFraction
    expect(state.currentChallenge!.type).toBe('decimalToFraction');
    state = submitAnswer(state, state.currentChallenge!.correctAnswer);
    state = nextChallenge(state);
    // round 2 even → fractionToDecimal
    expect(state.roundNumber).toBe(2);
    expect(state.currentChallenge!.type).toBe('fractionToDecimal');
  });
});
