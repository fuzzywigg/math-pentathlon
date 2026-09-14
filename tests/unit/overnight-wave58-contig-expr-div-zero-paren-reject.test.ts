/**
 * Wave 58 Contig/SD residual — Contig zero-divisor expressions rejected. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getAllPossibleResults } from '../../src/games/contig-60/types';

describe('Wave 58 contig — div-zero reject', () => {
  it('catalog never includes division by (y - y) zero', () => {
    const results = getAllPossibleResults([4, 3, 3]);
    for (const { expression } of results) {
      expect(expression).not.toMatch(/\/ \(3 - 3\)/);
      expect(expression).not.toMatch(/\/ 0\b/);
    }
  });
});
