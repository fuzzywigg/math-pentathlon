/** Wave 42 — Pinball checkAnswer strict string equality. Tests-only. */
import { describe, it, expect } from 'vitest';
import { checkAnswer } from '../../src/games/fraction-pinball/rules';
import type { ConversionChallenge } from '../../src/games/fraction-pinball/types';

const challenge: ConversionChallenge = {
  id: 'c-strict',
  type: 'fractionToDecimal',
  fraction: { numerator: 1, denominator: 2 },
  decimal: 0.5,
  answerChoices: ['0.5', '0.25', '0.75', '1'],
  correctAnswer: '0.5',
};

describe('Wave 42 Pinball — check string strict', () => {
  it('exact correct string passes', () => {
    expect(checkAnswer(challenge, '0.5')).toBe(true);
  });

  it('trailing zero / padded forms fail', () => {
    expect(checkAnswer(challenge, '0.50')).toBe(false);
    expect(checkAnswer(challenge, '0.500')).toBe(false);
    expect(checkAnswer(challenge, '00.5')).toBe(false);
  });

  it('whitespace and case variants fail', () => {
    expect(checkAnswer(challenge, ' 0.5')).toBe(false);
    expect(checkAnswer(challenge, '0.5 ')).toBe(false);
    expect(checkAnswer(challenge, '0.5\n')).toBe(false);
  });

  it('fraction form of same value fails on decimal challenge', () => {
    expect(checkAnswer(challenge, '1/2')).toBe(false);
    expect(checkAnswer(challenge, '½')).toBe(false);
  });

  it('decimalToFraction also requires exact correctAnswer string', () => {
    const fracChallenge: ConversionChallenge = {
      id: 'c-frac',
      type: 'decimalToFraction',
      fraction: { numerator: 3, denominator: 4 },
      decimal: 0.75,
      answerChoices: ['3/4', '1/2', '2/3', '1'],
      correctAnswer: '3/4',
    };
    expect(checkAnswer(fracChallenge, '3/4')).toBe(true);
    expect(checkAnswer(fracChallenge, '0.75')).toBe(false);
    expect(checkAnswer(fracChallenge, '6/8')).toBe(false);
  });
});
