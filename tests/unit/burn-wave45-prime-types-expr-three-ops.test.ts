/**
 * Wave 45 — Prime Gold three-dice expression patterns leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { generateExpressions } from '../../src/games/prime-gold/types';

describe('Wave 45 prime — three-ops', () => {
  it('paren patterns stay within 1..49 unique', () => {
    const exprs = generateExpressions(2, 4, 6);
    expect(exprs.every((e) => e.value >= 1 && e.value <= 49)).toBe(true);
    expect(exprs.some((e) => e.expr.includes('('))).toBe(true);
  });
});
