/**
 * Overnight HEAVY leftover after #274 — createCompleteGraph(4) has C(4,2) edges.
 * Distinct from wave57 demo complete(5) chrome. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createCompleteGraph, areAdjacent } from '../../src/core/graph';

describe('Wave 58 core graph — complete k4 edges', () => {
  it('K4 has 6 undirected edges and every pair adjacent', () => {
    const g = createCompleteGraph(4);
    expect(g.nodes.size).toBe(4);
    expect(g.edges).toHaveLength(6);
    const ids = [...g.nodes.keys()];
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        expect(areAdjacent(g, ids[i], ids[j])).toBe(true);
      }
    }
  });
});
