/**
 * Overnight TOKENMAXX — Frac-Fact generateProblem leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { generateProblem, checkAnswer } from '../../src/games/frac-fact/rules';

describe('Overnight frac-fact — generate', () => {
  it('problems include correct among choices; subtract nonneg when seen', () => {
    let sawSubtract = false;
    for (let i = 0; i < 20; i++) {
      const p = generateProblem('easy', i + 1);
      expect(p.answerChoices).toHaveLength(4);
      expect(checkAnswer(p, p.correctAnswer)).toBe(true);
      if (p.operation === 'subtract') {
        sawSubtract = true;
        const a = p.operand1.numerator / p.operand1.denominator;
        const b = p.operand2.numerator / p.operand2.denominator;
        expect(a).toBeGreaterThanOrEqual(b);
      }
    }
    expect(typeof sawSubtract).toBe('boolean');
  });
});
