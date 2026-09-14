/**
 * Overnight TOKENMAXX — BFS visited-skip on diamond DAG (multi parents).
 * Tests-only. After #214/#215.
 */
import { describe, it, expect } from 'vitest';
import { bfs, findAllPaths, dijkstra } from '../../src/core/graph/algorithms';
import type { Graph } from '../../src/core/graph/types';

describe('Overnight core graph — bfs diamond', () => {
  it('diamond: bfs finds one shortest; findAllPaths finds two length-3 routes', () => {
    const g: Graph = {
      nodes: new Map(
        ['a', 'b', 'c', 'd'].map((id) => [id, { id, position: { x: 0, y: 0 } }])
      ),
      directed: false,
      edges: [
        { from: 'a', to: 'b', weight: 1 },
        { from: 'a', to: 'c', weight: 1 },
        { from: 'b', to: 'd', weight: 1 },
        { from: 'c', to: 'd', weight: 1 },
      ],
    };
    const b = bfs(g, 'a', 'd');
    expect(b.found).toBe(true);
    expect(b.distance).toBe(2);
    expect(b.path).toHaveLength(3);
    const paths = findAllPaths(g, 'a', 'd');
    expect(paths).toHaveLength(2);
    expect(dijkstra(g, 'a', 'd').distance).toBe(2);
  });
});
