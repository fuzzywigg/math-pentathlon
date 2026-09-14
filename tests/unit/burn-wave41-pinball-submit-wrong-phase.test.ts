/**
 * Wave 41 — Fraction Pinball submit wrong phase identity + startGame.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import {
  submitAnswer,
  startGame,
  formatDecimal,
  formatFraction,
  checkAnswer,
} from '../../src/games/fraction-pinball/rules';

describe('Wave 41 pinball — submit phase / format', () => {
  it('submitAnswer identity on gameOver', () => {
    const state = {
      ...createInitialState(),
      phase: 'gameOver' as const,
      winner: 'player1' as const,
      currentChallenge: startGame(createInitialState()).currentChallenge,
    };
    expect(submitAnswer(state, '0.5')).toBe(state);
  });

  it('startGame sets answering with challenge; formats stable', () => {
    const next = startGame(createInitialState());
    expect(next.phase).toBe('answering');
    expect(next.currentChallenge).not.toBeNull();
    expect(formatDecimal(0.5)).toMatch(/0\.5/);
    expect(formatFraction({ numerator: 1, denominator: 4 })).toMatch(/1/);
    expect(checkAnswer(next.currentChallenge!, next.currentChallenge!.correctAnswer)).toBe(
      true
    );
  });
});
