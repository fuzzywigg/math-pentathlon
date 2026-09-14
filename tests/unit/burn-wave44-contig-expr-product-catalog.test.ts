/**
 * Wave 44 — Contig expression product leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getAllPossibleResults } from '../../src/games/contig-60/types';

describe('Wave 44 Contig — expr product catalog', () => {
  it('2,3,4 yields product 24 and sum paths', () => {
    const results = getAllPossibleResults([2, 3, 4]);
    const values = results.map((r) => r.result);
    expect(values).toContain(24);
    expect(values).toContain(9);
    expect(results.every((r) => r.result > 0 && Number.isInteger(r.result))).toBe(true);
  });

  it('expressions are non-empty strings', () => {
    const results = getAllPossibleResults([2, 3, 4]);
    expect(results.every((r) => r.expression.length > 0)).toBe(true);
  });
});
