/**
 * Wave 39 — findAllPaths weights + start===end singleton after #172/#173.
 * Distinct from wave38 maxDepth reject. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  findAllPaths,
  createTrackGraph,
  type Graph,
} from '../../src/core/graph';

describe('Wave 39 graph — findAllPaths weights', () => {
  it('start===end with maxDepth≥1 yields weight-0 singleton', () => {
    const g = createTrackGraph(3);
    const paths = findAllPaths(g, 't0', 't0', 1);
    expect(paths).toHaveLength(1);
    expect(paths[0].nodes).toEqual(['t0']);
    expect(paths[0].totalWeight).toBe(0);
  });

  it('path totalWeight sums edge weights', () => {
    const g: Graph = {
      nodes: new Map([
        ['a', { id: 'a', position: { x: 0, y: 0 } }],
        ['b', { id: 'b', position: { x: 1, y: 0 } }],
        ['c', { id: 'c', position: { x: 2, y: 0 } }],
      ]),
      edges: [
        { from: 'a', to: 'b', weight: 2 },
        { from: 'b', to: 'c', weight: 5 },
      ],
      directed: false,
    };
    const paths = findAllPaths(g, 'a', 'c', 10);
    expect(paths.length).toBeGreaterThanOrEqual(1);
    expect(paths[0].totalWeight).toBe(7);
    expect(paths[0].nodes).toEqual(['a', 'b', 'c']);
  });
});
