/**
 * Overnight TOKENMAXX — negative weights are accepted by dijkstra/findAllPaths.
 * Documents current contract (no Bellman-Ford guard). Tests-only. After #214/#215.
 */
import { describe, it, expect } from 'vitest';
import { dijkstra, findAllPaths } from '../../src/core/graph/algorithms';
import type { Graph } from '../../src/core/graph/types';

describe('Overnight core graph — negative weight document', () => {
  it('negative corridor yields negative dijkstra distance', () => {
    const g: Graph = {
      nodes: new Map([
        ['a', { id: 'a', position: { x: 0, y: 0 } }],
        ['b', { id: 'b', position: { x: 1, y: 0 } }],
        ['c', { id: 'c', position: { x: 2, y: 0 } }],
      ]),
      directed: false,
      edges: [
        { from: 'a', to: 'b', weight: -5 },
        { from: 'b', to: 'c', weight: 1 },
        { from: 'a', to: 'c', weight: 10 },
      ],
    };
    expect(dijkstra(g, 'a', 'c')).toEqual({
      found: true,
      path: ['a', 'b', 'c'],
      distance: -4,
    });
    const neg = findAllPaths(g, 'a', 'c').find((p) => p.nodes.length === 3);
    expect(neg?.totalWeight).toBe(-4);
  });
});
