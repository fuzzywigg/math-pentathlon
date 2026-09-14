/**
 * Wave 41 — Fraction Pinball generateChallenge + checkAnswer.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  generateChallenge,
  checkAnswer,
} from '../../src/games/fraction-pinball/rules';
import type { ConversionChallenge } from '../../src/games/fraction-pinball/types';

afterEach(() => vi.restoreAllMocks());

function seedVaryingRandom() {
  let i = 0;
  const seq = [0.12, 0.34, 0.56, 0.78, 0.09, 0.91, 0.23, 0.45, 0.67, 0.89];
  vi.spyOn(Math, 'random').mockImplementation(() => {
    const v = seq[i % seq.length];
    i++;
    return v;
  });
}

describe('Wave 41 Pinball — generateChallenge / checkAnswer', () => {
  it('even challengeNumber → fractionToDecimal; odd → decimalToFraction', () => {
    seedVaryingRandom();
    const even = generateChallenge(2);
    expect(even.type).toBe('fractionToDecimal');
    expect(even.id).toBe('challenge-2');
    expect(even.answerChoices).toHaveLength(4);
    expect(even.answerChoices).toContain(even.correctAnswer);
    expect(even.fraction.denominator).toBeGreaterThan(0);

    const odd = generateChallenge(3);
    expect(odd.type).toBe('decimalToFraction');
    expect(odd.id).toBe('challenge-3');
    expect(odd.answerChoices).toHaveLength(4);
    expect(odd.answerChoices).toContain(odd.correctAnswer);
  });

  it('checkAnswer exact string match only', () => {
    const challenge: ConversionChallenge = {
      id: 'c-x',
      type: 'fractionToDecimal',
      fraction: { numerator: 1, denominator: 4 },
      decimal: 0.25,
      answerChoices: ['0.25', '0.5', '0.75', '1'],
      correctAnswer: '0.25',
    };
    expect(checkAnswer(challenge, '0.25')).toBe(true);
    expect(checkAnswer(challenge, '0.250')).toBe(false);
    expect(checkAnswer(challenge, '1/4')).toBe(false);
    expect(checkAnswer(challenge, '')).toBe(false);
  });
});
