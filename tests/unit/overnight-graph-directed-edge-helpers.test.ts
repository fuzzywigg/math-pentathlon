/**
 * Overnight TOKENMAXX — graph getEdge / adjacency leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getEdge, areAdjacent, getNeighbors } from '../../src/core/graph/algorithms';
import type { Graph } from '../../src/core/graph/types';

describe('Overnight graph — edge helpers', () => {
  it('undirected getEdge matches either orientation', () => {
    const g: Graph = {
      nodes: new Map([
        ['a', { id: 'a', position: { x: 0, y: 0 } }],
        ['b', { id: 'b', position: { x: 0, y: 0 } }],
      ]),
      edges: [{ from: 'a', to: 'b', weight: 3 }],
      directed: false,
    };
    expect(getEdge(g, 'b', 'a')?.weight).toBe(3);
    expect(areAdjacent(g, 'b', 'a')).toBe(true);
    expect(getNeighbors(g, 'b')).toEqual(['a']);
  });

  it('missing edge is undefined', () => {
    const g: Graph = {
      nodes: new Map([['a', { id: 'a', position: { x: 0, y: 0 } }]]),
      edges: [],
      directed: true,
    };
    expect(getEdge(g, 'a', 'a')).toBeUndefined();
    expect(getNeighbors(g, 'a')).toEqual([]);
  });
});
