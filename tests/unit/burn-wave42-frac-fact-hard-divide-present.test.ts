/** Wave 42 — Frac Fact hard difficulty eventually includes divide. Tests-only. */
import { describe, it, expect } from 'vitest';
import { generateProblem, getOperationSymbol } from '../../src/games/frac-fact/rules';

describe('Wave 42 Frac Fact — hard divide present', () => {
  it('hard operations include divide across a large sample', () => {
    const ops = new Set(
      Array.from({ length: 120 }, (_, i) => generateProblem('hard', i + 1).operation)
    );
    expect(ops.has('divide')).toBe(true);
  });

  it('hard also still includes non-divide ops', () => {
    const ops = new Set(
      Array.from({ length: 80 }, (_, i) => generateProblem('hard', i + 1).operation)
    );
    expect(ops.has('add') || ops.has('subtract') || ops.has('multiply')).toBe(
      true
    );
  });

  it('medium sample never produces divide', () => {
    for (let i = 0; i < 40; i++) {
      expect(generateProblem('medium', i + 1).operation).not.toBe('divide');
    }
  });

  it('divide symbol helper returns ÷', () => {
    expect(getOperationSymbol('divide')).toBe('÷');
  });

  it('a hard divide problem still has four choices including correct', () => {
    let found = false;
    for (let i = 0; i < 120; i++) {
      const p = generateProblem('hard', i + 1);
      if (p.operation === 'divide') {
        expect(p.answerChoices).toHaveLength(4);
        expect(
          p.answerChoices.some(
            (c) =>
              c.numerator === p.correctAnswer.numerator &&
              c.denominator === p.correctAnswer.denominator
          )
        ).toBe(true);
        found = true;
        break;
      }
    }
    expect(found).toBe(true);
  });
});
