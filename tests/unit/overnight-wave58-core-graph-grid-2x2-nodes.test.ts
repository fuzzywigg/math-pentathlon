/**
 * Overnight HEAVY leftover after #274 — createGridGraph(2,2) node/edge counts.
 * Distinct from wave55 grid 1x1. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createGridGraph, isConnected } from '../../src/core/graph';

describe('Wave 58 core graph — grid 2x2', () => {
  it('2x2 grid has 4 nodes, 4 edges, Connected', () => {
    const g = createGridGraph(2, 2);
    expect(g.nodes.size).toBe(4);
    expect(g.edges).toHaveLength(4);
    expect(isConnected(g)).toBe(true);
  });
});
