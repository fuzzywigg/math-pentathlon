/**
 * Wave 44 — Contig subtract positive leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getAllPossibleResults } from '../../src/games/contig-60/types';

describe('Wave 44 Contig — expr subtract positive', () => {
  it('rejects non-positive results implicitly', () => {
    const results = getAllPossibleResults([1, 1, 1]);
    expect(results.every((r) => r.result > 0)).toBe(true);
    expect(results.some((r) => r.result === 1 || r.result === 2 || r.result === 3)).toBe(true);
  });
});
