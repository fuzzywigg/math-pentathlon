/**
 * Wave 39 — empty graph connected / degree ghost leftovers after #172/#173.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  isConnected,
  findComponents,
  getNodeDegree,
  createGridGraph,
  type Graph,
} from '../../src/core/graph';

describe('Wave 39 graph — empty connected', () => {
  it('empty graph is connected; single node is connected', () => {
    const empty: Graph = {
      nodes: new Map(),
      edges: [],
      directed: false,
    };
    expect(isConnected(empty)).toBe(true);
    expect(findComponents(empty)).toEqual([]);

    const single = createGridGraph(1, 1);
    expect(isConnected(single)).toBe(true);
    expect(findComponents(single)).toHaveLength(1);
  });

  it('ghost node degree is 0', () => {
    const g = createGridGraph(2, 2);
    expect(getNodeDegree(g, 'ghost-node')).toBe(0);
  });

  it('2x2 grid is one connected component', () => {
    const g = createGridGraph(2, 2);
    expect(isConnected(g)).toBe(true);
    expect(findComponents(g)).toHaveLength(1);
  });
});
