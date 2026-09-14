/**
 * Wave 38 — simplifyExpression failure passthrough leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  simplifyExpression,
  evaluate,
} from '../../src/core/expressions';

describe('Wave 38 expr-simplify — fail passthrough', () => {
  it('invalid expression returns original string', () => {
    expect(simplifyExpression('2 +')).toBe('2 +');
    expect(simplifyExpression('((')).toBe('((');
  });

  it('empty expression returns empty (evaluate fails)', () => {
    expect(evaluate('').success).toBe(false);
    expect(simplifyExpression('')).toBe('');
  });

  it('division by zero passes original through', () => {
    expect(simplifyExpression('1/0')).toBe('1/0');
    expect(evaluate('1/0').success).toBe(false);
  });

  it('valid expression collapses to formatted number', () => {
    expect(simplifyExpression('2+2')).toBe('4');
    expect(simplifyExpression('10/4')).toBe('2.5');
  });
});
