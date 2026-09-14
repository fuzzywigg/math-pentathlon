/**
 * Overnight TOKENMAXX HEAVY leftovers after #250 — Pinball checkAnswer strict string leftover.
 * Distinct from 0.50 lookalike. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { checkAnswer } from '../../src/games/fraction-pinball/rules';
import type { ConversionChallenge } from '../../src/games/fraction-pinball/types';

const challenge: ConversionChallenge = {
  id: 's',
  type: 'fractionToDecimal',
  fraction: { numerator: 1, denominator: 4 },
  decimal: 0.25,
  answerChoices: ['0.25', '0.5', '0.2'],
  correctAnswer: '0.25',
};

describe('Wave 55 pinball rules — checkAnswer strict', () => {
  it('rejects 1/4 when correct is 0.25 leftover', () => {
    expect(checkAnswer(challenge, '0.25')).toBe(true);
    expect(checkAnswer(challenge, '1/4')).toBe(false);
    expect(checkAnswer(challenge, '0.250')).toBe(false);
  });
});
