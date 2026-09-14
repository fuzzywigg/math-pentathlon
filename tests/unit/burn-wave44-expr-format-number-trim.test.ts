/**
 * Wave 44 — formatNumber trailing-zero trim leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { formatNumber, simplifyExpression } from '../../src/core/expressions';

describe('Wave 44 expr — formatNumber trim', () => {
  it('integers stay bare; decimals trim zeros', () => {
    expect(formatNumber(12)).toBe('12');
    expect(formatNumber(1.5)).toBe('1.5');
    expect(formatNumber(1.2500)).toBe('1.25');
  });

  it('simplifyExpression uses formatNumber for successful eval', () => {
    expect(simplifyExpression('1/2')).toBe('0.5');
    expect(simplifyExpression('1+')).toBe('1+');
  });
});
