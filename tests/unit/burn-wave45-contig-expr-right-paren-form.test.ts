/**
 * Wave 45 — Contig expression catalog includes right-paren form
 * Distinct leftover vs #204 rules / #207 fab-sum-core / #208 overnight core.
 * Tests-only.
 */

import { describe, it, expect } from 'vitest';
import { getAllPossibleResults } from '../../src/games/contig-60/types';

describe('Wave 45 Contig — right paren form', () => {
  it('includes x op (y op z) style expressions', () => {
    const results = getAllPossibleResults([2, 3, 4]);
    expect(results.some((r) => /^\d+ .+ \(/.test(r.expression))).toBe(true);
    expect(results.some((r) => /^\(/.test(r.expression))).toBe(true);
  });
});
