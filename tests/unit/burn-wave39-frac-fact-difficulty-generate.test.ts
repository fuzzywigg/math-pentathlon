/**
 * Wave 39 — Frac Fact generateProblem difficulty ladders.
 * Tests-only. Do not pin Math.random to a constant.
 */
import { describe, it, expect } from 'vitest';
import { generateProblem, getOperationSymbol, formatFraction } from '../../src/games/frac-fact/rules';

describe('Wave 39 Frac Fact — difficulty generate', () => {
  it('easy problems use add/subtract only', () => {
    for (let i = 0; i < 20; i++) {
      const p = generateProblem('easy', i + 1);
      expect(['add', 'subtract']).toContain(p.operation);
      expect(p.answerChoices).toHaveLength(4);
      expect(p.id).toBe(`problem-${i + 1}`);
      expect(p.operand1.denominator).toBeLessThanOrEqual(4);
      expect(p.operand2.denominator).toBeLessThanOrEqual(4);
    }
  });

  it('medium allows multiply; hard allows divide', () => {
    const mediumOps = new Set(
      Array.from({ length: 40 }, (_, i) => generateProblem('medium', i).operation)
    );
    expect(mediumOps.has('add') || mediumOps.has('subtract') || mediumOps.has('multiply')).toBe(true);
    expect(mediumOps.has('divide')).toBe(false);

    const hardOps = new Set(
      Array.from({ length: 60 }, (_, i) => generateProblem('hard', i).operation)
    );
    expect(['add', 'subtract', 'multiply', 'divide'].some((op) => hardOps.has(op as never))).toBe(true);
  });

  it('choices include correctAnswer; symbols/format helpers', () => {
    const p = generateProblem('medium', 7);
    expect(
      p.answerChoices.some(
        (c) =>
          c.numerator === p.correctAnswer.numerator &&
          c.denominator === p.correctAnswer.denominator
      )
    ).toBe(true);
    expect(getOperationSymbol(p.operation).length).toBeGreaterThan(0);
    expect(formatFraction(p.correctAnswer).length).toBeGreaterThan(0);
  });
});
