/**
 * Wave 37 — graph miss/empty × template factories matrix.
 * Beyond wave 34 miss-empty on hand-built graphs. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createTrackGraph,
  createStarGraph,
  createGridGraph,
  createCompleteGraph,
  createHexLatticeGraph,
  getNeighbors,
  getEdge,
  areAdjacent,
  bfs,
  dijkstra,
  findAllPaths,
  findReachable,
  getNodeDegree,
  findPlayerRegion,
  findLongestPlayerPath,
  type GraphBoard,
} from '../../src/core/graph';

describe('Wave 37 graph-miss — ghost ids on templates', () => {
  it('neighbors/edge/adjacent miss for unknown nodes', () => {
    for (const g of [
      createTrackGraph(4),
      createStarGraph(3),
      createGridGraph(2, 2),
      createCompleteGraph(4),
      createHexLatticeGraph(1),
    ]) {
      expect(getNeighbors(g, 'ghost')).toEqual([]);
      expect(getEdge(g, 'ghost', [...g.nodes.keys()][0])).toBeUndefined();
      expect(areAdjacent(g, 'ghost', [...g.nodes.keys()][0])).toBe(false);
      expect(getNodeDegree(g, 'ghost')).toBe(0);
      expect(bfs(g, 'ghost', [...g.nodes.keys()][0]).found).toBe(false);
      // dijkstra only indexes existing nodes; missing end yields undefined distance
      expect(dijkstra(g, [...g.nodes.keys()][0], 'ghost').distance).toBeUndefined();
      expect(findAllPaths(g, 'ghost', [...g.nodes.keys()][0])).toEqual([]);
      expect(findReachable(g, 'ghost').size).toBe(1); // start alone
    }
  });

  it('player helpers return empty for unknown start / empty ownership', () => {
    const g = createGridGraph(2, 2);
    const board: GraphBoard = {
      graph: g,
      nodeStates: new Map([
        ['0-0', {}],
        ['0-1', {}],
        ['1-0', {}],
        ['1-1', {}],
      ]),
    };
    expect(findPlayerRegion(board, 'ghost', 1)).toEqual([]);
    expect(findLongestPlayerPath(board, 1)).toEqual([]);
    expect(findPlayerRegion(board, '0-0', 1)).toEqual([]);
  });

  it('self bfs on every template node is distance 0', () => {
    const g = createHexLatticeGraph(1);
    for (const id of g.nodes.keys()) {
      const r = bfs(g, id, id);
      expect(r.found).toBe(true);
      expect(r.distance).toBe(0);
      expect(r.path).toEqual([id]);
    }
  });
});
