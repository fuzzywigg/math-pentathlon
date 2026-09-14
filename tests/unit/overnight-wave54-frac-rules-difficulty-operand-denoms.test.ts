/**
 * Overnight TOKENMAXX HEAVY leftover — Frac Fact generateProblem operand denoms by difficulty.
 * Distinct from op-catalog (ops only). Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { generateProblem } from '../../src/games/frac-fact/rules';

describe('Wave 54 frac rules — difficulty operand denoms', () => {
  it('easy operands stay denom <= 4; medium <= 8', () => {
    for (let n = 1; n <= 24; n++) {
      const easy = generateProblem('easy', n);
      expect(easy.operand1.denominator).toBeLessThanOrEqual(4);
      expect(easy.operand2.denominator).toBeLessThanOrEqual(4);
      expect(['add', 'subtract']).toContain(easy.operation);
    }
    for (let n = 1; n <= 24; n++) {
      const med = generateProblem('medium', n);
      expect(med.operand1.denominator).toBeLessThanOrEqual(8);
      expect(med.operand2.denominator).toBeLessThanOrEqual(8);
      expect(med.operation).not.toBe('divide');
    }
  });
});
