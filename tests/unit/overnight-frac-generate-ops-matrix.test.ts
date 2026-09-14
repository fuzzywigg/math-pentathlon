/**
 * Overnight TOKENMAXX HEAVY — frac-fact generate ops matrix leftovers after #202.
 * Tests-only. Distinct from demos (#202) and wave43/44 Contig/SD/Star/Fab drafts.
 * No product inventing.
 */

import { describe, it, expect } from 'vitest';
import { generateProblem } from '../../src/games/frac-fact/rules';

describe('Overnight frac-fact — generate ops matrix', () => {
  it('hard problems have valid denominators and non-negative answers', () => {
    for (let i = 0; i < 12; i++) {
      const p = generateProblem('hard', i + 1);
      expect(p.operand1.denominator).toBeGreaterThan(0);
      expect(p.operand2.denominator).toBeGreaterThan(0);
      expect(p.correctAnswer.numerator).toBeGreaterThanOrEqual(0);
      expect(p.answerChoices.length).toBe(4);
      if (p.operation === 'divide') {
        expect(p.operand2.numerator).not.toBe(0);
      }
      if (p.operation === 'subtract') {
        const v1 = p.operand1.numerator / p.operand1.denominator;
        const v2 = p.operand2.numerator / p.operand2.denominator;
        expect(v1).toBeGreaterThanOrEqual(v2 - 1e-9);
      }
    }
  });
});
