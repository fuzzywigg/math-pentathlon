/**
 * Overnight TOKENMAXX — omitted edge.weight defaults to 1 in paths + dijkstra.
 * Tests-only. After #214/#215.
 */
import { describe, it, expect } from 'vitest';
import { dijkstra, findAllPaths, bfs } from '../../src/core/graph/algorithms';
import type { Graph } from '../../src/core/graph/types';

describe('Overnight core graph — missing weight defaults', () => {
  it('omitted weights: dijkstra distance matches bfs hops', () => {
    const g: Graph = {
      nodes: new Map([
        ['a', { id: 'a', position: { x: 0, y: 0 } }],
        ['b', { id: 'b', position: { x: 1, y: 0 } }],
        ['c', { id: 'c', position: { x: 2, y: 0 } }],
      ]),
      directed: false,
      edges: [
        { from: 'a', to: 'b' },
        { from: 'b', to: 'c' },
      ],
    };
    expect(dijkstra(g, 'a', 'c').distance).toBe(2);
    expect(bfs(g, 'a', 'c').distance).toBe(2);
    expect(findAllPaths(g, 'a', 'c')[0].totalWeight).toBe(2);
  });

  it('mixed omitted + explicit: findAllPaths sums defaults as 1', () => {
    const g: Graph = {
      nodes: new Map([
        ['a', { id: 'a', position: { x: 0, y: 0 } }],
        ['b', { id: 'b', position: { x: 1, y: 0 } }],
        ['c', { id: 'c', position: { x: 2, y: 0 } }],
      ]),
      directed: false,
      edges: [
        { from: 'a', to: 'b' }, // default 1
        { from: 'b', to: 'c', weight: 4 },
        { from: 'a', to: 'c', weight: 9 },
      ],
    };
    const via = findAllPaths(g, 'a', 'c').find((p) => p.nodes.length === 3);
    expect(via?.totalWeight).toBe(5);
    expect(dijkstra(g, 'a', 'c').distance).toBe(5);
  });
});
