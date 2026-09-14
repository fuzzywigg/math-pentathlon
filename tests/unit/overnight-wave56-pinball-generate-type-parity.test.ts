/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Pinball generateChallenge type parity.
 * Burn waves covered; overnight leftover after #254. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { generateChallenge } from '../../src/games/fraction-pinball/rules';

describe('Wave 56 pinball rules — challenge type parity', () => {
  it('odd→decimalToFraction; even→fractionToDecimal leftover', () => {
    expect(generateChallenge(1).type).toBe('decimalToFraction');
    expect(generateChallenge(2).type).toBe('fractionToDecimal');
    expect(generateChallenge(3).type).toBe('decimalToFraction');
    expect(generateChallenge(4).type).toBe('fractionToDecimal');
    const odd = generateChallenge(1);
    expect(odd.answerChoices).toHaveLength(4);
    expect(odd.answerChoices).toContain(odd.correctAnswer);
  });
});
