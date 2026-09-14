/**
 * Overnight TOKENMAXX HEAVY leftover — Frac Fact subtract swaps so operand1 >= operand2.
 * Distinct from wave41 non-negative answer only. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { generateProblem } from '../../src/games/frac-fact/rules';

describe('Wave 54 frac rules — subtract operand order', () => {
  it('subtract problems keep operand1 value >= operand2 value', () => {
    const diffs = ['easy', 'medium', 'hard'] as const;
    let seen = 0;
    for (const d of diffs) {
      for (let n = 1; n <= 40; n++) {
        const p = generateProblem(d, n);
        if (p.operation !== 'subtract') continue;
        seen++;
        const v1 = p.operand1.numerator / p.operand1.denominator;
        const v2 = p.operand2.numerator / p.operand2.denominator;
        expect(v1).toBeGreaterThanOrEqual(v2);
        expect(p.correctAnswer.numerator).toBeGreaterThanOrEqual(0);
      }
    }
    expect(seen).toBeGreaterThan(0);
  });
});
