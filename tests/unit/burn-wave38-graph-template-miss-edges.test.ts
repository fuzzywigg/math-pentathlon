/**
 * Wave 38 — graph template miss / cut leftovers after #171 geometry burn.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createTrackGraph,
  createStarGraph,
  createGridGraph,
  createCircularGraph,
  getNeighbors,
  getEdge,
  areAdjacent,
  bfs,
  findReachable,
  findComponents,
  isConnected,
} from '../../src/core/graph';

describe('Wave 38 graph-miss — ghost ids on leftover templates', () => {
  it('neighbors/edge/adjacent miss for unknown nodes across templates', () => {
    for (const g of [
      createTrackGraph(5),
      createStarGraph(4),
      createGridGraph(2, 3),
      createCircularGraph(6),
    ]) {
      const first = [...g.nodes.keys()][0];
      expect(getNeighbors(g, 'ghost')).toEqual([]);
      expect(getEdge(g, 'ghost', first)).toBeUndefined();
      expect(areAdjacent(g, 'ghost', first)).toBe(false);
      expect(bfs(g, 'ghost', first).found).toBe(false);
      expect(findReachable(g, 'ghost').size).toBe(1);
    }
  });
});

describe('Wave 38 graph-cut — single edge removal leftovers', () => {
  it('removing one track edge splits into two components', () => {
    const base = createTrackGraph(6);
    const g = {
      ...base,
      edges: base.edges.filter(
        (e) => !(e.from === 't2' && e.to === 't3') && !(e.from === 't3' && e.to === 't2')
      ),
    };
    expect(isConnected(g)).toBe(false);
    expect(findComponents(g)).toHaveLength(2);
    expect(bfs(g, 't0', 't5').found).toBe(false);
  });

  it('removing one circular edge leaves a connected path', () => {
    const base = createCircularGraph(5);
    const edge = base.edges[0];
    const g = {
      ...base,
      edges: base.edges.filter(
        (e) =>
          !(e.from === edge.from && e.to === edge.to) &&
          !(e.from === edge.to && e.to === edge.from)
      ),
    };
    expect(isConnected(g)).toBe(true);
    expect(findComponents(g)).toHaveLength(1);
  });
});
