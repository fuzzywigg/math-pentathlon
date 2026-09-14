/**
 * Overnight HEAVY leftover after #256 — directed getNeighbors skips reverse hop.
 * Distinct from wave55 undirected getEdge reverse. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getNeighbors, type Graph } from '../../src/core/graph';

describe('Wave 56 core graph — directed neighbors', () => {
  it('directed edge exposes only forward neighbor', () => {
    const g: Graph = {
      nodes: new Map([
        ['a', { id: 'a', position: { x: 0, y: 0 } }],
        ['b', { id: 'b', position: { x: 1, y: 0 } }],
      ]),
      edges: [{ from: 'a', to: 'b' }],
      directed: true,
    };
    expect(getNeighbors(g, 'a')).toEqual(['b']);
    expect(getNeighbors(g, 'b')).toEqual([]);
  });
});
