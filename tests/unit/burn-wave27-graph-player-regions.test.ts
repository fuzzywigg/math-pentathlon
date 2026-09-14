/**
 * Wave 27 — player region flood / multi-region partition on GraphBoard.
 * Distinct from contiguous findRegion (#141) — network ownership floods.
 * Tests-only. No product inventing.
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

function undirected(nodes: NodeId[], edges: Array<[NodeId, NodeId]>): Graph {
  return {
    nodes: new Map(nodes.map((id) => [id, node(id)])),
    directed: false,
    edges: edges.map(([from, to]) => ({ from, to })),
  };
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
  // also allow owner keys not already implied
  for (const [id, owner] of Object.entries(owners)) {
    if (!nodeStates.has(id)) {
      nodeStates.set(id, owner === undefined ? {} : { owner });
    }
  }
  return { graph, nodeStates };
}

describe('Wave 27 graph-player-regions — findPlayerRegion', () => {
  it('returns empty when start is unowned or wrong owner', () => {
    const graph = undirected(['a', 'b'], [['a', 'b']]);
    const board = boardFrom(graph, { a: 1, b: 1 });
    expect(findPlayerRegion(board, 'a', 2)).toEqual([]);
    const bare = boardFrom(graph, {});
    expect(findPlayerRegion(bare, 'a', 1)).toEqual([]);
  });

  it('single owned node is a size-1 region', () => {
    const graph = undirected(['a', 'b'], [['a', 'b']]);
    const board = boardFrom(graph, { a: 1 });
    expect(findPlayerRegion(board, 'a', 1)).toEqual(['a']);
  });

  it('floods through contiguous same-owner nodes only', () => {
    const graph = undirected(
      ['a', 'b', 'c', 'd'],
      [
        ['a', 'b'],
        ['b', 'c'],
        ['c', 'd'],
      ]
    );
    const board = boardFrom(graph, { a: 1, b: 1, c: 2, d: 1 });
    expect(findPlayerRegion(board, 'a', 1).sort()).toEqual(['a', 'b']);
    expect(findPlayerRegion(board, 'd', 1)).toEqual(['d']);
    expect(findPlayerRegion(board, 'c', 2)).toEqual(['c']);
  });

  it('does not leap across opponent nodes', () => {
    const graph = undirected(
      ['a', 'b', 'c'],
      [
        ['a', 'b'],
        ['b', 'c'],
      ]
    );
    const board = boardFrom(graph, { a: 1, b: 2, c: 1 });
    expect(findPlayerRegion(board, 'a', 1)).toEqual(['a']);
    expect(findPlayerRegion(board, 'c', 1)).toEqual(['c']);
  });

  it('fills a full player-owned track', () => {
    const track = createTrackGraph(5);
    const owners: Record<string, number> = {};
    for (const id of track.nodes.keys()) owners[id] = 1;
    const board = boardFrom(track, owners);
    expect(findPlayerRegion(board, 't0', 1).sort()).toEqual([
      't0',
      't1',
      't2',
      't3',
      't4',
    ]);
  });

  it('grid blob: 2x2 block owned by player 1', () => {
    const grid = createGridGraph(3, 3);
    const board = boardFrom(grid, {
      '0-0': 1,
      '0-1': 1,
      '1-0': 1,
      '1-1': 1,
      '2-2': 2,
    });
    expect(findPlayerRegion(board, '0-0', 1).sort()).toEqual([
      '0-0',
      '0-1',
      '1-0',
      '1-1',
    ]);
    expect(findPlayerRegion(board, '2-2', 2)).toEqual(['2-2']);
  });
});

describe('Wave 27 graph-player-regions — findAllPlayerRegions', () => {
  it('returns empty when player owns nothing', () => {
    const graph = undirected(['a', 'b'], [['a', 'b']]);
    const board = boardFrom(graph, { a: 1, b: 1 });
    expect(findAllPlayerRegions(board, 2)).toEqual([]);
  });

  it('one contiguous ownership → one region', () => {
    const graph = undirected(
      ['a', 'b', 'c'],
      [
        ['a', 'b'],
        ['b', 'c'],
      ]
    );
    const board = boardFrom(graph, { a: 1, b: 1, c: 1 });
    const regions = findAllPlayerRegions(board, 1);
    expect(regions).toHaveLength(1);
    expect(regions[0].sort()).toEqual(['a', 'b', 'c']);
  });

  it('splits disconnected same-owner islands', () => {
    const graph = undirected(
      ['a', 'b', 'c', 'd'],
      [
        ['a', 'b'],
        ['b', 'c'],
        ['c', 'd'],
      ]
    );
    const board = boardFrom(graph, { a: 1, b: 2, c: 2, d: 1 });
    const regions = findAllPlayerRegions(board, 1);
    expect(regions).toHaveLength(2);
    const keyed = regions.map((r) => r.sort().join('|')).sort();
    expect(keyed).toEqual(['a', 'd']);
  });

  it('both players get independent partitions', () => {
    const graph = undirected(
      ['a', 'b', 'c', 'd', 'e'],
      [
        ['a', 'b'],
        ['b', 'c'],
        ['c', 'd'],
        ['d', 'e'],
      ]
    );
    const board = boardFrom(graph, {
      a: 1,
      b: 1,
      c: 2,
      d: 2,
      e: 1,
    });
    expect(
      findAllPlayerRegions(board, 1)
        .map((r) => r.sort().join('|'))
        .sort()
    ).toEqual(['a|b', 'e']);
    expect(
      findAllPlayerRegions(board, 2)
        .map((r) => r.sort().join('|'))
        .sort()
    ).toEqual(['c|d']);
  });

  it('grid checkerboard yields many size-1 regions', () => {
    const grid = createGridGraph(2, 2);
    const board = boardFrom(grid, {
      '0-0': 1,
      '0-1': 2,
      '1-0': 2,
      '1-1': 1,
    });
    const p1 = findAllPlayerRegions(board, 1);
    const p2 = findAllPlayerRegions(board, 2);
    expect(p1).toHaveLength(2);
    expect(p2).toHaveLength(2);
    expect(p1.every((r) => r.length === 1)).toBe(true);
    expect(p2.every((r) => r.length === 1)).toBe(true);
  });

  it("union of all player regions covers exactly that player's nodes", () => {
    const grid = createGridGraph(3, 3);
    const owners: Record<string, number> = {
      '0-0': 1,
      '0-1': 1,
      '0-2': 2,
      '1-0': 2,
      '1-1': 1,
      '1-2': 2,
      '2-0': 1,
      '2-1': 2,
      '2-2': 1,
    };
    const board = boardFrom(grid, owners);
    for (const player of [1, 2]) {
      const owned = Object.entries(owners)
        .filter(([, o]) => o === player)
        .map(([id]) => id)
        .sort();
      const covered = findAllPlayerRegions(board, player).flat().sort();
      expect(covered).toEqual(owned);
    }
  });
});
