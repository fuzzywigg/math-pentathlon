/**
 * Overnight HEAVY leftover after #274 — circular(3) closes cycle (unlike n=2).
 * Distinct from wave57 circular n=2 no-close. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createCircularGraph, areAdjacent } from '../../src/core/graph';

describe('Wave 58 core graph — circular n3 close', () => {
  it('n=3 forms a triangle with closing edge', () => {
    const g = createCircularGraph(3);
    expect(g.edges).toHaveLength(3);
    expect(areAdjacent(g, 'n0', 'n2')).toBe(true);
  });
});
