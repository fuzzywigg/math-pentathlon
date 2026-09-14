/**
 * Overnight HEAVY leftover after #234 — Pinball checkAnswer rejects '0.50' for '0.5'.
 * Prior strict tests used '0.250' / trailing 'x', not this lookalike. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { checkAnswer } from '../../src/games/fraction-pinball/rules';
import type { ConversionChallenge } from '../../src/games/fraction-pinball/types';

describe('Wave 52 pinball — checkAnswer lookalike', () => {
  it('rejects padded decimal lookalike under strict string match', () => {
    const challenge: ConversionChallenge = {
      id: 'lookalike',
      type: 'fractionToDecimal',
      fraction: { numerator: 1, denominator: 2 },
      decimal: 0.5,
      answerChoices: ['0.5', '0.25', '0.50', '1'],
      correctAnswer: '0.5',
    };
    expect(checkAnswer(challenge, '0.5')).toBe(true);
    expect(checkAnswer(challenge, '0.50')).toBe(false);
  });
});
