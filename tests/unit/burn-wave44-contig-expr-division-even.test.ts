/**
 * Wave 44 — Contig even-division leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getAllPossibleResults } from '../../src/games/contig-60/types';

describe('Wave 44 Contig — expr division even', () => {
  it('6,2,3 includes exact division paths', () => {
    const results = getAllPossibleResults([6, 2, 3]);
    expect(results.every((r) => Number.isInteger(r.result))).toBe(true);
    expect(results.some((r) => r.result === 9)).toBe(true); // 6+(2+1)? or (6/2)*3=9
    expect(results.map((r) => r.result)).toContain(9);
  });
});
