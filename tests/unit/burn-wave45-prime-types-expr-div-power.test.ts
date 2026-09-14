/**
 * Wave 45 — Prime Gold generateExpressions ÷ and ^ leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { generateExpressions } from '../../src/games/prime-gold/types';

describe('Wave 45 prime — expr div/power', () => {
  it('includes exact division and gated power', () => {
    const exprs = generateExpressions(2, 3, 1);
    const values = exprs.map((e) => e.value);
    expect(values).toContain(6); // 2×3
    expect(values.some((v) => Number.isInteger(v) && v > 0 && v <= 49)).toBe(true);
    expect(new Set(values).size).toBe(values.length);
  });

  it('power path for small bases appears when gated', () => {
    const exprs = generateExpressions(2, 3, 4);
    expect(exprs.some((e) => e.expr.includes('^'))).toBe(true);
  });
});
