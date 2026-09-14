/**
 * Overnight HEAVY leftover after #234 — bfs.distance is hop count (path.length-1).
 * Distinct from overnight-core-graph-bfs-queue-revisits. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { bfs } from '../../src/core/graph/algorithms';
import { createTrackGraph } from '../../src/core/graph/types';

describe('Wave 52 core graph — bfs distance hops', () => {
  it('track t0→t2 → distance 2 and path length 3', () => {
    const g = createTrackGraph(3);
    const result = bfs(g, 't0', 't2');
    expect(result.found).toBe(true);
    expect(result.distance).toBe(2);
    expect(result.path).toEqual(['t0', 't1', 't2']);
    expect(result.distance).toBe(result.path.length - 1);
  });
});
