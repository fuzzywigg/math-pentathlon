/**
 * Wave 39 — Contig getAllPossibleResults division-even + paren leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getAllPossibleResults } from '../../src/games/contig-60/types';

describe('Wave 39 Contig — expr div even', () => {
  it('includes even division results for [6,3,2]', () => {
    const results = getAllPossibleResults([6, 3, 2]);
    expect(results.length).toBeGreaterThan(0);
    const exprs = results.map((r) => r.expression);
    expect(exprs.some((e) => e.includes('/'))).toBe(true);
    expect(results.every((r) => Number.isInteger(r.result) && r.result > 0)).toBe(
      true
    );
  });

  it('rejects non-even division paths for [5,3,2] still returns other ops', () => {
    const results = getAllPossibleResults([5, 3, 2]);
    expect(results.length).toBeGreaterThan(0);
    // 5/3 is not even — results should still be positive integers
    for (const r of results) {
      expect(r.result).toBeGreaterThan(0);
      expect(Number.isInteger(r.result)).toBe(true);
    }
  });

  it('paren forms appear for associative ops', () => {
    const results = getAllPossibleResults([2, 3, 4]);
    const exprs = results.map((r) => r.expression);
    expect(exprs.some((e) => e.startsWith('('))).toBe(true);
    expect(exprs.some((e) => e.includes('(') && !e.startsWith('('))).toBe(true);
  });

  it('results sorted ascending and unique', () => {
    const results = getAllPossibleResults([1, 2, 3]);
    const vals = results.map((r) => r.result);
    expect(vals).toEqual([...vals].sort((a, b) => a - b));
    expect(new Set(vals).size).toBe(vals.length);
  });
});
