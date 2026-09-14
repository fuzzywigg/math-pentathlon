/**
 * Wave 45 — Contig getAllPossibleResults sorted ascending for [4,5,6]
 * Distinct leftover vs #204 rules / #207 fab-sum-core / #208 overnight core.
 * Tests-only.
 */

import { describe, it, expect } from 'vitest';
import { getAllPossibleResults } from '../../src/games/contig-60/types';

describe('Wave 45 Contig — expr sort 4,5,6', () => {
  it('returns ascending unique results', () => {
    const results = getAllPossibleResults([4, 5, 6]);
    const values = results.map((r) => r.result);
    expect(values).toEqual([...values].sort((a, b) => a - b));
    expect(new Set(values).size).toBe(values.length);
    expect(values.length).toBeGreaterThan(5);
  });
});
