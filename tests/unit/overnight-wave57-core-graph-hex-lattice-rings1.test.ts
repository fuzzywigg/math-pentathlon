/**
 * Overnight HEAVY leftover after #264 — createHexLatticeGraph(1) topology.
 * Distinct from wave55/56 hex demo chrome. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createHexLatticeGraph, getNeighbors } from '../../src/core/graph';

describe('Wave 57 core graph — hex lattice rings=1', () => {
  it('one ring yields 7 nodes with center degree 6', () => {
    const g = createHexLatticeGraph(1);
    expect(g.nodes.size).toBe(7);
    expect(g.nodes.has('0,0')).toBe(true);
    expect(getNeighbors(g, '0,0')).toHaveLength(6);
    expect(g.edges.length).toBeGreaterThan(0);
  });
});
