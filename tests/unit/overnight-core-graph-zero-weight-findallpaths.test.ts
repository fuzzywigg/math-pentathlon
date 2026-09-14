/**
 * Overnight TOKENMAXX — zero-weight edges in findAllPaths totalWeight.
 * Distinct from wave34 dijkstra zero-weight. Tests-only. After #214/#215.
 */
import { describe, it, expect } from 'vitest';
import { findAllPaths, dijkstra, bfs } from '../../src/core/graph/algorithms';
import type { Graph } from '../../src/core/graph/types';

describe('Overnight core graph — zero-weight findAllPaths', () => {
  it('single zero-weight edge → totalWeight 0', () => {
    const g: Graph = {
      nodes: new Map([
        ['a', { id: 'a', position: { x: 0, y: 0 } }],
        ['b', { id: 'b', position: { x: 1, y: 0 } }],
      ]),
      directed: false,
      edges: [{ from: 'a', to: 'b', weight: 0 }],
    };
    expect(findAllPaths(g, 'a', 'b')).toEqual([
      { nodes: ['a', 'b'], totalWeight: 0 },
    ]);
    expect(dijkstra(g, 'a', 'b').distance).toBe(0);
    // bfs is hop-count, not weight
    expect(bfs(g, 'a', 'b').distance).toBe(1);
  });

  it('zero corridor preferred by dijkstra; findAllPaths lists both routes', () => {
    const g: Graph = {
      nodes: new Map([
        ['a', { id: 'a', position: { x: 0, y: 0 } }],
        ['b', { id: 'b', position: { x: 1, y: 0 } }],
        ['c', { id: 'c', position: { x: 2, y: 0 } }],
      ]),
      directed: false,
      edges: [
        { from: 'a', to: 'b', weight: 0 },
        { from: 'b', to: 'c', weight: 0 },
        { from: 'a', to: 'c', weight: 7 },
      ],
    };
    const paths = findAllPaths(g, 'a', 'c');
    expect(paths).toHaveLength(2);
    expect(paths.find((p) => p.nodes.length === 2)?.totalWeight).toBe(7);
    expect(paths.find((p) => p.nodes.length === 3)?.totalWeight).toBe(0);
    expect(dijkstra(g, 'a', 'c')).toEqual({
      found: true,
      path: ['a', 'b', 'c'],
      distance: 0,
    });
  });
});
