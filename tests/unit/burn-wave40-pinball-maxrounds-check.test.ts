/**
 * Wave 40 — Fraction Pinball maxRounds gameOver / checkAnswer / phase / type parity.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { createInitialState } from '../../src/games/fraction-pinball/types';
import {
  nextChallenge,
  checkAnswer,
  submitAnswer,
  generateChallenge,
} from '../../src/games/fraction-pinball/rules';

describe('Wave 40 fraction-pinball — maxRounds / check / phase / type', () => {
  it('nextChallenge when roundNumber >= maxRounds → gameOver', () => {
    const base = createInitialState();
    const state = {
      ...base,
      phase: 'showResult' as const,
      currentChallenge: generateChallenge(base.maxRounds),
      selectedAnswer: 'x',
      isCorrect: false,
      roundNumber: base.maxRounds,
    };
    const over = nextChallenge(state);
    expect(over.phase).toBe('gameOver');
    expect(over.currentChallenge).toBeNull();
  });

  it('checkAnswer mismatch → false; exact correct → true', () => {
    const challenge = generateChallenge(1);
    expect(checkAnswer(challenge, 'totally-wrong')).toBe(false);
    expect(checkAnswer(challenge, challenge.correctAnswer)).toBe(true);
  });

  it('submitAnswer wrong phase → identity', () => {
    const challenge = generateChallenge(2);
    const showResult = {
      ...createInitialState(),
      phase: 'showResult' as const,
      currentChallenge: challenge,
    };
    expect(submitAnswer(showResult, challenge.correctAnswer)).toBe(
      showResult
    );

    const gameOver = {
      ...createInitialState(),
      phase: 'gameOver' as const,
      currentChallenge: challenge,
    };
    expect(submitAnswer(gameOver, challenge.correctAnswer)).toBe(gameOver);
  });

  it('generateChallenge type parity from round number', () => {
    // Odd → decimalToFraction; even → fractionToDecimal
    expect(generateChallenge(1).type).toBe('decimalToFraction');
    expect(generateChallenge(2).type).toBe('fractionToDecimal');
    expect(generateChallenge(3).type).toBe('decimalToFraction');
    expect(generateChallenge(4).type).toBe('fractionToDecimal');
  });
});
