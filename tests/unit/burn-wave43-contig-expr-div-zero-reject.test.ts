/**
 * Wave 43 — Contig getAllPossibleResults division reject leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getAllPossibleResults } from '../../src/games/contig-60/types';

describe('Wave 43 contig — expr division rejects', () => {
  it('results are positive integers only; dice [1,1,1] includes 1..something', () => {
    const results = getAllPossibleResults([1, 1, 1]);
    expect(results.every((r) => r.result > 0 && Number.isInteger(r.result))).toBe(true);
    expect(results.some((r) => r.result === 1)).toBe(true);
  });

  it('duplicate results collapse to one expression map entry', () => {
    const results = getAllPossibleResults([2, 2, 2]);
    const values = results.map((r) => r.result);
    expect(new Set(values).size).toBe(values.length);
  });

  it('division by zero paths do not yield Infinity', () => {
    // include a zero die
    const results = getAllPossibleResults([2, 0, 3]);
    expect(results.every((r) => Number.isFinite(r.result))).toBe(true);
  });
});
