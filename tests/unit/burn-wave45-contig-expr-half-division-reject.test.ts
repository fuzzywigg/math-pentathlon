/**
 * Wave 45 — Contig getAllPossibleResults excludes non-integer halves
 * Distinct leftover vs #204 rules / #207 fab-sum-core / #208 overnight core.
 * Tests-only.
 */

import { describe, it, expect } from 'vitest';
import { getAllPossibleResults } from '../../src/games/contig-60/types';

describe('Wave 45 Contig — half division reject', () => {
  it('all results integer; no fractional half-products for [5,2,3]', () => {
    const results = getAllPossibleResults([5, 2, 3]);
    expect(results.every((r) => Number.isInteger(r.result) && r.result > 0)).toBe(true);
    // 5/2 is not even — paths using that intermediate must be absent
    expect(results.every((r) => !r.expression.includes('5 / 2'))).toBe(true);
  });
});
