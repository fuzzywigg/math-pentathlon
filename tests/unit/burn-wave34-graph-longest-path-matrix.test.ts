/**
 * Wave 34 — findLongestPlayerPath exhaustive small graphs.
 * Deepens wave 27 player-connect longest-path. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  findLongestPlayerPath,
  createTrackGraph,
  createStarGraph,
  createGridGraph,
  type Graph,
  type GraphBoard,
  type NodeId,
  type NodeState,
} from '../../src/core/graph';

function boardFrom(
  graph: Graph,
  owners: Record<string, number | undefined>
): GraphBoard {
  const nodeStates = new Map<NodeId, NodeState>();
  for (const id of graph.nodes.keys()) {
    const owner = owners[id];
    nodeStates.set(id, owner === undefined ? {} : { owner });
  }
  return { graph, nodeStates };
}

describe('Wave 34 graph-longest-path — small exhaustives', () => {
  it('full track ownership length equals node count', () => {
    for (const n of [1, 2, 5, 8]) {
      const g = createTrackGraph(n);
      const owners: Record<string, number> = {};
      for (const id of g.nodes.keys()) owners[id] = 1;
      const path = findLongestPlayerPath(boardFrom(g, owners), 1);
      expect(path).toHaveLength(n);
      expect(path[0]).toMatch(/^t/);
      expect(path.at(-1)).toMatch(/^t/);
    }
  });

  it('star with owned center+leaves → path length 3 (leaf-center-leaf)', () => {
    const g = createStarGraph(4);
    const owners: Record<string, number> = { center: 1 };
    for (let i = 0; i < 4; i++) owners[`n${i}`] = 1;
    const path = findLongestPlayerPath(boardFrom(g, owners), 1);
    expect(path).toHaveLength(3);
    expect(path[1]).toBe('center');
  });

  it('star without center → longest is singleton leaves', () => {
    const g = createStarGraph(3);
    const board = boardFrom(g, { n0: 1, n1: 1, n2: 1 });
    expect(findLongestPlayerPath(board, 1)).toHaveLength(1);
  });

  it('broken track yields max contiguous segment', () => {
    const g = createTrackGraph(7);
    const board = boardFrom(g, {
      t0: 1,
      t1: 1,
      t2: 1,
      t3: 2,
      t4: 1,
      t5: 1,
      t6: 1,
    });
    expect(findLongestPlayerPath(board, 1)).toHaveLength(3);
  });

  it('empty ownership → empty path', () => {
    const g = createGridGraph(2, 2);
    expect(findLongestPlayerPath(boardFrom(g, {}), 1)).toEqual([]);
  });

  it('single owned node → path of that node', () => {
    const g = createTrackGraph(4);
    expect(findLongestPlayerPath(boardFrom(g, { t2: 1 }), 1)).toEqual(['t2']);
  });
});
