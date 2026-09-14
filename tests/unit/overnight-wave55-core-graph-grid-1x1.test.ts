/**
 * Overnight HEAVY leftover after #250 — 1×1 grid has no edges; bfs self is 0.
 * Distinct from wave53 isolated showValidMoves. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createGridGraph } from '../../src/core/graph/types';
import { bfs, getNodeDegree, isConnected } from '../../src/core/graph/algorithms';

describe('Wave 55 core graph — grid 1x1', () => {
  it('single cell is connected, degree 0, self path distance 0', () => {
    const g = createGridGraph(1, 1);
    expect(g.nodes.size).toBe(1);
    expect(g.edges).toHaveLength(0);
    expect(getNodeDegree(g, '0-0')).toBe(0);
    expect(isConnected(g)).toBe(true);
    expect(bfs(g, '0-0', '0-0')).toEqual({
      found: true,
      path: ['0-0'],
      distance: 0,
    });
  });
});
