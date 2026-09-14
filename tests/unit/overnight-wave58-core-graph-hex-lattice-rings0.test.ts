/**
 * Overnight HEAVY leftover after #274 — hex lattice rings=0 is center only.
 * Distinct from wave57 rings=1 (7 nodes). Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createHexLatticeGraph, getNeighbors } from '../../src/core/graph';

describe('Wave 58 core graph — hex lattice rings0', () => {
  it('rings=0 yields single center with no neighbors', () => {
    const g = createHexLatticeGraph(0);
    expect(g.nodes.size).toBe(1);
    expect(g.edges).toHaveLength(0);
    expect(getNeighbors(g, '0,0')).toEqual([]);
  });
});
