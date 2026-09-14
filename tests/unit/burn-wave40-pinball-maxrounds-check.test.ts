/**
 * Wave 40 — Fraction Pinball maxRounds settle + check mismatch.
 * Tests-only leftover after #178.
 */
import { describe, it, expect } from 'vitest';

import {
  generateChallenge,
  checkAnswer,
  submitAnswer,
  nextChallenge,
} from '../../src/games/fraction-pinball/rules';
import { createInitialState } from '../../src/games/fraction-pinball/types';

describe('Wave 40 pinball — maxRounds / check', () => {
  it('generateChallenge type parity by round number', () => {
    const even = generateChallenge(2);
    const odd = generateChallenge(3);
    expect(even.type).toBe('fractionToDecimal');
    expect(odd.type).toBe('decimalToFraction');
  });

  it('checkAnswer exact match / mismatch', () => {
    const c = generateChallenge(1);
    expect(checkAnswer(c, c.correctAnswer)).toBe(true);
    expect(checkAnswer(c, 'not-the-answer')).toBe(false);
  });

  it('submitAnswer wrong phase → identity', () => {
    const state = createInitialState();
    expect(submitAnswer(state, 'x')).toBe(state);
    const over = { ...state, phase: 'gameOver' as const };
    expect(submitAnswer(over, 'x')).toBe(over);
  });

  it('nextChallenge past maxRounds → gameOver', () => {
    const state = createInitialState();
    const atMax = {
      ...state,
      phase: 'showingResult' as const,
      roundNumber: state.maxRounds,
      player1Stats: { ...state.player1Stats, score: 10 },
      player2Stats: { ...state.player2Stats, score: 3 },
    };
    const next = nextChallenge(atMax);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player1');
    expect(next.currentChallenge).toBeNull();
  });
});
