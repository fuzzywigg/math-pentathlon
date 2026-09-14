/**
 * Overnight HEAVY leftover after #274 — star(1) has center + one spoke.
 * Distinct from wave57 star(0) outer-empty. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createStarGraph, getNeighbors } from '../../src/core/graph';

describe('Wave 58 core graph — star one outer', () => {
  it('star(1) center neighbors exactly one outer', () => {
    const g = createStarGraph(1);
    expect(g.nodes.size).toBe(2);
    expect(g.edges).toHaveLength(1);
    expect(getNeighbors(g, 'center')).toEqual(['n0']);
  });
});
