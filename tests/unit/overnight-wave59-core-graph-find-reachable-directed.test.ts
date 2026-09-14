/**
 * Overnight HEAVY leftover after #280 — findReachable on directed chain.
 * Distinct from wave58 undirected find-reachable-leaf. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { findReachable, type Graph } from '../../src/core/graph';

describe('Wave 59 core graph — find reachable directed', () => {
  it('directed chain reaches forward-only from start', () => {
    const graph: Graph = {
      nodes: new Map([
        ['a', { id: 'a', position: { x: 0, y: 0 } }],
        ['b', { id: 'b', position: { x: 1, y: 0 } }],
        ['c', { id: 'c', position: { x: 2, y: 0 } }],
      ]),
      edges: [
        { from: 'a', to: 'b' },
        { from: 'b', to: 'c' },
      ],
      directed: true,
    };
    expect([...findReachable(graph, 'a')].sort()).toEqual(['a', 'b', 'c']);
    expect([...findReachable(graph, 'c')].sort()).toEqual(['c']);
  });
});
