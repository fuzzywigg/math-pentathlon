/**
 * Overnight HEAVY leftover after #241 — bfs/dijkstra/findReachable on missing start.
 * Distinct from wave52 degree-missing-node and overnight orphan ghost reach. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { bfs, dijkstra, findReachable } from '../../src/core/graph/algorithms';
import { createTrackGraph } from '../../src/core/graph/types';

describe('Wave 53 core graph — missing start pathfinding', () => {
  it('bfs start!==end with unknown start is not found', () => {
    const g = createTrackGraph(3);
    expect(bfs(g, 'ghost', 't0')).toEqual({
      found: false,
      path: [],
      distance: -1,
    });
  });

  it('dijkstra unknown start is not found; missing end reconstructs a stub path', () => {
    const g = createTrackGraph(3);
    expect(dijkstra(g, 'ghost', 't0')).toEqual({
      found: false,
      path: [],
      distance: -1,
    });
    // end absent from distances → Infinity check misses; path is [end]
    const missingEnd = dijkstra(g, 't0', 'ghost');
    expect(missingEnd.found).toBe(true);
    expect(missingEnd.path).toEqual(['ghost']);
  });

  it('findReachable from a ghost id is the singleton {ghost}', () => {
    const g = createTrackGraph(2);
    expect([...findReachable(g, 'specter')]).toEqual(['specter']);
  });
});
