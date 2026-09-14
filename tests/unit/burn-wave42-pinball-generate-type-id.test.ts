/**
 * Wave 42 — Fraction Pinball generateChallenge type/id leftovers.
 * Beyond wave41 even/odd type. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { generateChallenge } from '../../src/games/fraction-pinball/rules';

afterEach(() => vi.restoreAllMocks());

describe('Wave 42 pinball — generateChallenge leftovers', () => {
  it('challenge id embeds the challengeNumber', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.3);
    for (const n of [1, 4, 10]) {
      const c = generateChallenge(n);
      expect(c.id).toBe(`challenge-${n}`);
      expect(c.answerChoices).toHaveLength(4);
      expect(new Set(c.answerChoices).size).toBe(4);
    }
  });

  it('fractionToDecimal correctAnswer is a decimal-looking string', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.15);
    const c = generateChallenge(4);
    expect(c.type).toBe('fractionToDecimal');
    expect(c.correctAnswer).not.toMatch(/\//);
    expect(c.answerChoices).toContain(c.correctAnswer);
  });

  it('decimalToFraction correctAnswer includes slash or integer', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.4);
    const c = generateChallenge(5);
    expect(c.type).toBe('decimalToFraction');
    expect(c.answerChoices).toContain(c.correctAnswer);
    expect(c.fraction.denominator).toBeGreaterThan(0);
  });
});
