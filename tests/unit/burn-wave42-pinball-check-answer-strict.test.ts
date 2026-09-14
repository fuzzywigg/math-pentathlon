/**
 * Wave 42 — Fraction Pinball checkAnswer strict leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { checkAnswer } from '../../src/games/fraction-pinball/rules';
import type { ConversionChallenge } from '../../src/games/fraction-pinball/types';

const base: ConversionChallenge = {
  id: 'c1',
  type: 'decimalToFraction',
  fraction: { numerator: 1, denominator: 2 },
  decimal: 0.5,
  answerChoices: ['1/2', '1/3', '2/3', '1/4'],
  correctAnswer: '1/2',
};

describe('Wave 42 pinball — checkAnswer strict', () => {
  it('accepts only exact correctAnswer', () => {
    expect(checkAnswer(base, '1/2')).toBe(true);
    expect(checkAnswer(base, '0.5')).toBe(false);
    expect(checkAnswer(base, '2/4')).toBe(false);
    expect(checkAnswer(base, '1 / 2')).toBe(false);
  });

  it('fractionToDecimal rejects fraction form of same value', () => {
    const c: ConversionChallenge = {
      ...base,
      type: 'fractionToDecimal',
      correctAnswer: '0.25',
      answerChoices: ['0.25', '0.5', '0.75', '1'],
      fraction: { numerator: 1, denominator: 4 },
      decimal: 0.25,
    };
    expect(checkAnswer(c, '0.25')).toBe(true);
    expect(checkAnswer(c, '1/4')).toBe(false);
  });

  it('wrong choice among listed still false', () => {
    expect(checkAnswer(base, '1/3')).toBe(false);
    expect(checkAnswer(base, base.answerChoices[2])).toBe(false);
  });
});
