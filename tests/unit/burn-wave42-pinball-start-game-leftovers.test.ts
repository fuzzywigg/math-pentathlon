/**
 * Wave 42 — Fraction Pinball startGame leftovers.
 * Tests-only. Mock Math.random only after generateChallenge/startGame.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  INITIAL_BALLS,
  MAX_ROUNDS,
} from '../../src/games/fraction-pinball/types';
import { startGame, checkAnswer } from '../../src/games/fraction-pinball/rules';

describe('Wave 42 pinball — startGame leftovers', () => {
  it('sets answering with challenge-1 type decimalToFraction', () => {
    const next = startGame(createInitialState());
    expect(next.phase).toBe('answering');
    expect(next.currentChallenge!.id).toBe('challenge-1');
    expect(next.currentChallenge!.type).toBe('decimalToFraction');
    expect(
      checkAnswer(next.currentChallenge!, next.currentChallenge!.correctAnswer)
    ).toBe(true);
  });

  it('preserves balls / rounds / seats from initial state', () => {
    const base = createInitialState();
    const next = startGame(base);
    expect(next.currentPlayer).toBe('player1');
    expect(next.roundNumber).toBe(1);
    expect(next.maxRounds).toBe(MAX_ROUNDS);
    expect(next.player1Stats.ballsRemaining).toBe(INITIAL_BALLS);
    expect(next.player2Stats.ballsRemaining).toBe(INITIAL_BALLS);
    expect(next.winner).toBeNull();
  });
});
