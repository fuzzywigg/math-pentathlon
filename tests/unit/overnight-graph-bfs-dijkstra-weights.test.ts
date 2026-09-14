/**
 * Overnight TOKENMAXX — graph BFS/Dijkstra leftovers after #197. Tests-only. Not demos.
 */
import { describe, it, expect } from 'vitest';
import { bfs, dijkstra, getNeighbors, areAdjacent } from '../../src/core/graph/algorithms';
import type { Graph } from '../../src/core/graph/types';

function makeGraph(directed = false): Graph {
  const nodes = new Map([
    ['A', { id: 'A', position: { x: 0, y: 0 } }],
    ['B', { id: 'B', position: { x: 0, y: 0 } }],
    ['C', { id: 'C', position: { x: 0, y: 0 } }],
    ['D', { id: 'D', position: { x: 0, y: 0 } }],
  ]);
  return {
    nodes,
    edges: [
      { from: 'A', to: 'B', weight: 1 },
      { from: 'B', to: 'C', weight: 1 },
      { from: 'A', to: 'C', weight: 10 },
      { from: 'C', to: 'D', weight: 1 },
    ],
    directed,
  };
}

describe('Overnight graph — BFS/Dijkstra', () => {
  it('BFS prefers hop-count; Dijkstra prefers weight', () => {
    const g = makeGraph();
    const b = bfs(g, 'A', 'C');
    expect(b.found).toBe(true);
    expect(b.path).toEqual(['A', 'C']);
    expect(b.distance).toBe(1);
    const d = dijkstra(g, 'A', 'C');
    expect(d.found).toBe(true);
    expect(d.path).toEqual(['A', 'B', 'C']);
    expect(d.distance).toBe(2);
  });

  it('self path and disconnected', () => {
    const g = makeGraph();
    expect(bfs(g, 'A', 'A')).toEqual({ found: true, path: ['A'], distance: 0 });
    g.nodes.set('Z', { id: 'Z' });
    expect(bfs(g, 'A', 'Z').found).toBe(false);
    expect(dijkstra(g, 'A', 'Z').found).toBe(false);
  });

  it('directed neighbors respect direction', () => {
    const g = makeGraph(true);
    expect(getNeighbors(g, 'B')).toEqual(['C']);
    expect(areAdjacent(g, 'C', 'B')).toBe(false);
    expect(areAdjacent(g, 'B', 'C')).toBe(true);
  });
});
