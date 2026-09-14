/**
 * Overnight HEAVY leftover after #256 — createStarGraph(1) single leaf.
 * Distinct from wave27 n=0 center-only and n>=2 burns. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createStarGraph } from '../../src/core/graph/types';
import { getNodeDegree, bfs, getNeighbors } from '../../src/core/graph/algorithms';

describe('Wave 56 core graph — star n=1', () => {
  it('center + n0; one edge; bfs hop distance 1', () => {
    const g = createStarGraph(1, 50);
    expect([...g.nodes.keys()].sort()).toEqual(['center', 'n0']);
    expect(g.edges).toEqual([{ from: 'center', to: 'n0' }]);
    expect(getNodeDegree(g, 'center')).toBe(1);
    expect(getNeighbors(g, 'n0')).toEqual(['center']);
    expect(bfs(g, 'center', 'n0')).toEqual({
      found: true,
      path: ['center', 'n0'],
      distance: 1,
    });
    expect(g.nodes.get('n0')?.label).toBe('1');
  });
});
