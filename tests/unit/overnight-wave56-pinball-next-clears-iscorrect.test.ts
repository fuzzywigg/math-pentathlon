/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Pinball nextChallenge clears isCorrect.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import {
  startGame,
  submitAnswer,
  nextChallenge,
} from '../../src/games/fraction-pinball/rules';

describe('Wave 56 pinball rules — next clears isCorrect', () => {
  it('mid-round nextChallenge sets isCorrect null leftover', () => {
    let state = startGame(createInitialState());
    const challenge = state.currentChallenge!;
    state = submitAnswer(state, challenge.correctAnswer);
    expect(state.isCorrect).toBe(true);
    state = nextChallenge(state);
    expect(state.phase).toBe('answering');
    expect(state.isCorrect).toBeNull();
    expect(state.selectedAnswer).toBeNull();
  });
});
