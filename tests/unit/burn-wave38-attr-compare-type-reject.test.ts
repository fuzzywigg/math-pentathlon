/**
 * Wave 38 — compare() type-rejection and boundary lattice denser than wave 29.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { compare, evaluateCondition } from '../../src/core/attributes/logic';
import {
  createPiece,
  type ComparisonOperator,
} from '../../src/core/attributes/types';

const numericOps: ComparisonOperator[] = [
  'greater_than',
  'less_than',
  'greater_equal',
  'less_equal',
];

describe('Wave 38 attr-compare — cross-type rejection grid', () => {
  const lefts = [0, 1, -1, true, false, '0', '1', 'a', ''];
  const rights = [0, 1, -1, true, false, '0', '1', 'a', ''];

  it('numeric ops only true when both sides are numbers', () => {
    for (const op of numericOps) {
      for (const L of lefts) {
        for (const R of rights) {
          const result = compare(L, op, R);
          const bothNum = typeof L === 'number' && typeof R === 'number';
          if (!bothNum) expect(result).toBe(false);
          else {
            if (op === 'greater_than') expect(result).toBe(L > R);
            if (op === 'less_than') expect(result).toBe(L < R);
            if (op === 'greater_equal') expect(result).toBe(L >= R);
            if (op === 'less_equal') expect(result).toBe(L <= R);
          }
        }
      }
    }
  });

  it('equals uses strict === across the grid', () => {
    for (const L of lefts) {
      for (const R of rights) {
        expect(compare(L, 'equals', R)).toBe(L === R);
        expect(compare(L, 'not_equals', R)).toBe(L !== R);
      }
    }
  });
});

describe('Wave 38 attr-compare — missing attribute short-circuit', () => {
  const p = createPiece('z', { n: 10 });
  it('undefined attribute always fails evaluateCondition', () => {
    for (const op of [
      'equals',
      'not_equals',
      ...numericOps,
    ] as ComparisonOperator[]) {
      expect(
        evaluateCondition(p, { attribute: 'ghost', operator: op, value: 10 })
      ).toBe(false);
    }
  });
});
