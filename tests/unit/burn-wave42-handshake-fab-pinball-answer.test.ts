/**
 * Wave 42 — handshake: fab calculateResult × pinball checkAnswer.
 * Value agreement vs strict string answer. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { calculateResult } from '../../src/games/fab-a-diffy/rules';
import {
  checkAnswer,
  formatFraction,
  formatDecimal,
} from '../../src/games/fraction-pinball/rules';
import { areEquivalent, toDecimal } from '../../src/core/fractions/arithmetic';
import type { ConversionChallenge } from '../../src/games/fraction-pinball/types';

describe('Wave 42 handshake — fab result × pinball answer', () => {
  it('fab add 1/4+1/4 ≡ 1/2; pinball accepts formatted 1/2', () => {
    const result = calculateResult(
      { numerator: 1, denominator: 4 },
      { numerator: 1, denominator: 4 },
      'add'
    );
    expect(result).not.toBeNull();
    expect(areEquivalent(result!, { numerator: 1, denominator: 2 })).toBe(true);

    const challenge: ConversionChallenge = {
      id: 'c',
      type: 'decimalToFraction',
      fraction: { numerator: 1, denominator: 2 },
      decimal: 0.5,
      answerChoices: ['1/2', '1/3', '1/4', '2/3'],
      correctAnswer: formatFraction({ numerator: 1, denominator: 2 }),
    };
    expect(checkAnswer(challenge, '1/2')).toBe(true);
    expect(checkAnswer(challenge, formatDecimal(toDecimal(result!)))).toBe(
      false
    );
  });

  it('fab multiply and pinball decimal format of product', () => {
    const result = calculateResult(
      { numerator: 1, denominator: 2 },
      { numerator: 1, denominator: 2 },
      'multiply'
    );
    expect(formatDecimal(toDecimal(result!))).toBe('0.25');
    const challenge: ConversionChallenge = {
      id: 'c2',
      type: 'fractionToDecimal',
      fraction: { numerator: 1, denominator: 4 },
      decimal: 0.25,
      answerChoices: ['0.25', '0.5', '0.75', '1'],
      correctAnswer: '0.25',
    };
    expect(checkAnswer(challenge, formatDecimal(toDecimal(result!)))).toBe(
      true
    );
  });
});
