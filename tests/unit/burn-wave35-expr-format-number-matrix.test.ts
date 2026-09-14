/**
 * Wave 35 — formatNumber edge matrix leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { formatNumber, simplifyExpression } from '../../src/core/expressions';

describe('Wave 35 expr-format — integers and decimals', () => {
  it.each([
    [0, '0'],
    [1, '1'],
    [-7, '-7'],
    [1000, '1000'],
    [0.5, '0.5'],
    [0.25, '0.25'],
    [1.5, '1.5'],
    [2.75, '2.75'],
  ] as const)('formatNumber(%s) → %s', (n, expected) => {
    expect(formatNumber(n)).toBe(expected);
  });
});

describe('Wave 35 expr-format — simplify decimals', () => {
  it('simplifyExpression uses formatNumber for fractions', () => {
    expect(simplifyExpression('1/4')).toBe(formatNumber(0.25));
    expect(simplifyExpression('3/2')).toBe(formatNumber(1.5));
  });
});
