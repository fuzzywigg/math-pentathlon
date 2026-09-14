/**
 * Wave 44 — Contig result map uniqueness leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getAllPossibleResults } from '../../src/games/contig-60/types';

describe('Wave 44 Contig — expr ordering unique', () => {
  it('dedupes identical results across orderings', () => {
    const results = getAllPossibleResults([2, 2, 2]);
    const values = results.map((r) => r.result);
    expect(new Set(values).size).toBe(values.length);
    expect(values.every((v) => Number.isInteger(v) && v > 0)).toBe(true);
  });
});
