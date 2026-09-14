/**
 * Wave 58 Contig/SD residual — Contig first-expression-wins stability. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getAllPossibleResults } from '../../src/games/contig-60/types';

describe('Wave 58 contig — first expression wins', () => {
  it('same dice yield identical expression per result across calls', () => {
    const a = getAllPossibleResults([2, 3, 4]);
    const b = getAllPossibleResults([2, 3, 4]);
    expect(a).toEqual(b);
    expect(a.length).toBeGreaterThan(5);
    const byResult = new Map(a.map((r) => [r.result, r.expression]));
    expect(byResult.size).toBe(a.length);
  });
});
