/**
 * Wave 34 — findPlayerRegion / findAllPlayerRegions flood matrices.
 * Deepens wave 27 player-regions. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  findPlayerRegion,
  findAllPlayerRegions,
  createGridGraph,
  createTrackGraph,
  type Graph,
  type GraphBoard,
  type GraphNode,
  type NodeId,
  type NodeState,
} from '../../src/core/graph';

function node(id: NodeId): GraphNode {
  return { id, position: { x: 0, y: 0 } };
}

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

describe('Wave 34 graph-player-regions — flood matrices', () => {
  it('checkerboard 3×3 yields nine singleton regions for player 1', () => {
    const g = createGridGraph(3, 3);
    const owners: Record<string, number> = {};
    for (const id of g.nodes.keys()) {
      const [r, c] = id.split('-').map(Number);
      owners[id] = (r + c) % 2 === 0 ? 1 : 2;
    }
    const board = boardFrom(g, owners);
    const regions = findAllPlayerRegions(board, 1);
    expect(regions.every((r) => r.length === 1)).toBe(true);
    expect(regions).toHaveLength(5); // (0,0)(0,2)(1,1)(2,0)(2,2)
  });

  it('full row ownership is one region of width cols', () => {
    const g = createGridGraph(3, 4);
    const owners: Record<string, number> = {};
    for (const id of g.nodes.keys()) {
      owners[id] = id.startsWith('1-') ? 1 : 2;
    }
    const board = boardFrom(g, owners);
    const regions = findAllPlayerRegions(board, 1);
    expect(regions).toHaveLength(1);
    expect(regions[0].sort()).toEqual(['1-0', '1-1', '1-2', '1-3']);
    expect(findPlayerRegion(board, '1-2', 1).sort()).toEqual(regions[0].sort());
  });

  it('starting on opponent node yields empty region', () => {
    const g = createTrackGraph(4);
    const board = boardFrom(g, { t0: 1, t1: 2, t2: 1, t3: 1 });
    expect(findPlayerRegion(board, 't1', 1)).toEqual([]);
  });

  it('two islands → two regions for same player', () => {
    const g = createTrackGraph(6);
    const board = boardFrom(g, {
      t0: 1,
      t1: 1,
      t2: 2,
      t3: 1,
      t4: 1,
      t5: 1,
    });
    const regions = findAllPlayerRegions(board, 1)
      .map((r) => r.sort().join(','))
      .sort();
    expect(regions).toEqual(['t0,t1', 't3,t4,t5']);
  });

  it('empty ownership → zero regions', () => {
    const g = createGridGraph(2, 2);
    const board = boardFrom(g, {});
    expect(findAllPlayerRegions(board, 1)).toEqual([]);
  });
});
