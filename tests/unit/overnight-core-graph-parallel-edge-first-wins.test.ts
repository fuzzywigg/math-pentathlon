/**
 * Overnight TOKENMAXX — parallel edges: Set-dedupe neighbors; getEdge/dijkstra first-wins.
 * Tests-only. After #214/#215.
 */
import { describe, it, expect } from 'vitest';
import {
  getNeighbors,
  getNodeDegree,
  getEdge,
  dijkstra,
  areAdjacent,
} from '../../src/core/graph/algorithms';
import type { Graph } from '../../src/core/graph/types';

function parallel(): Graph {
  return {
    nodes: new Map([
      ['a', { id: 'a', position: { x: 0, y: 0 } }],
      ['b', { id: 'b', position: { x: 1, y: 0 } }],
    ]),
    directed: false,
    edges: [
      { from: 'a', to: 'b', weight: 5 },
      { from: 'a', to: 'b', weight: 1 },
      { from: 'b', to: 'a', weight: 9 },
    ],
  };
}

describe('Overnight core graph — parallel edges first-wins', () => {
  it('neighbors dedupe to one; degree is 1', () => {
    const g = parallel();
    expect(getNeighbors(g, 'a')).toEqual(['b']);
    expect(getNodeDegree(g, 'a')).toBe(1);
    expect(areAdjacent(g, 'a', 'b')).toBe(true);
  });

  it('getEdge returns the first matching record (weight 5)', () => {
    const g = parallel();
    expect(getEdge(g, 'a', 'b')?.weight).toBe(5);
    expect(getEdge(g, 'b', 'a')?.weight).toBe(5);
  });

  it('dijkstra uses first-edge weight, not the cheaper later parallel', () => {
    const g = parallel();
    const r = dijkstra(g, 'a', 'b');
    expect(r.found).toBe(true);
    expect(r.distance).toBe(5);
    expect(r.path).toEqual(['a', 'b']);
  });

  it('reordering so cheap edge is first changes dijkstra distance', () => {
    const g = parallel();
    g.edges = [
      { from: 'a', to: 'b', weight: 1 },
      { from: 'a', to: 'b', weight: 5 },
    ];
    expect(dijkstra(g, 'a', 'b').distance).toBe(1);
  });
});
