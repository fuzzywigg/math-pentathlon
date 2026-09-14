/**
 * Overnight TOKENMAXX — dijkstra start===end on present nodes (no BFS short-circuit).
 * Distinct from wave34 ghost-self quirk. Tests-only. After #214/#215.
 */
import { describe, it, expect } from 'vitest';
import { bfs, dijkstra } from '../../src/core/graph/algorithms';
import { createTrackGraph, createGridGraph, createStarGraph } from '../../src/core/graph/types';

describe('Overnight core graph — dijkstra self present', () => {
  it('track mid-node: dijkstra agrees with bfs (path=[id], distance=0)', () => {
    const g = createTrackGraph(5);
    const d = dijkstra(g, 't2', 't2');
    const b = bfs(g, 't2', 't2');
    expect(b).toEqual({ found: true, path: ['t2'], distance: 0 });
    expect(d).toEqual({ found: true, path: ['t2'], distance: 0 });
  });

  it('grid corner and star center self-paths', () => {
    const grid = createGridGraph(3, 3);
    expect(dijkstra(grid, '0-0', '0-0')).toEqual({
      found: true,
      path: ['0-0'],
      distance: 0,
    });
    const star = createStarGraph(4);
    expect(dijkstra(star, 'center', 'center').distance).toBe(0);
    expect(dijkstra(star, 'n1', 'n1').path).toEqual(['n1']);
  });
});
