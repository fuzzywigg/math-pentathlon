/**
 * Wave 38 — handshake: two-dice zeros feed expression simplify.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { getTwoDiceResults } from '../../src/core/dice';
import { simplifyExpression, evaluate } from '../../src/core/expressions';

describe('Wave 38 handshake — dice zeros → expr', () => {
  it('multiply-by-zero results simplify to 0', () => {
    const map = getTwoDiceResults(0, 5);
    const prod = map.get('0 × 5');
    expect(prod).toBe(0);
    expect(simplifyExpression('0*5')).toBe('0');
  });

  it('division keys that exist evaluate successfully', () => {
    const map = getTwoDiceResults(0, 4);
    for (const [expr, value] of map) {
      if (!expr.includes('÷')) continue;
      const js = expr.replace('÷', '/').replace(/ /g, '');
      const result = evaluate(js);
      expect(result.success).toBe(true);
      expect(result.value).toBe(value);
    }
  });

  it('absent ÷0 keys are not evaluable as successful', () => {
    expect(evaluate('4/0').success).toBe(false);
    expect(simplifyExpression('4/0')).toBe('4/0');
  });
});
