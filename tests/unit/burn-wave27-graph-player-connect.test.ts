/**
 * Wave 27 — playerConnectsSets / findLongestPlayerPath on GraphBoard.
 * Distinct from contiguous edge-connect (#141) and region floods.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  playerConnectsSets,
  findLongestPlayerPath,
  createGridGraph,
  createTrackGraph,
  createStarGraph,
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
  return { graph, nodeStates };
}

describe('Wave 27 graph-player-connect — playerConnectsSets', () => {
  it('true when a owned path links setA to setB', () => {
    const graph = undirected(
      ['a', 'b', 'c', 'd'],
      [
        ['a', 'b'],
        ['b', 'c'],
        ['c', 'd'],
      ]
    );
    const board = boardFrom(graph, { a: 1, b: 1, c: 1, d: 2 });
    expect(playerConnectsSets(board, 1, ['a'], ['c'])).toBe(true);
  });

  it('false when opponent blocks the corridor', () => {
    const graph = undirected(
      ['a', 'b', 'c'],
      [
        ['a', 'b'],
        ['b', 'c'],
      ]
    );
    const board = boardFrom(graph, { a: 1, b: 2, c: 1 });
    expect(playerConnectsSets(board, 1, ['a'], ['c'])).toBe(false);
  });

  it('false when setA start is not owned by the player', () => {
    const graph = undirected(
      ['a', 'b', 'c'],
      [
        ['a', 'b'],
        ['b', 'c'],
      ]
    );
    const board = boardFrom(graph, { a: 2, b: 1, c: 1 });
    expect(playerConnectsSets(board, 1, ['a'], ['c'])).toBe(false);
  });

  it('true when setA and setB share the same owned node', () => {
    const graph = undirected(['a', 'b'], [['a', 'b']]);
    const board = boardFrom(graph, { a: 1, b: 1 });
    expect(playerConnectsSets(board, 1, ['a'], ['a'])).toBe(true);
  });

  it('requires setB node to be player-owned to be visited', () => {
    const graph = undirected(
      ['a', 'b', 'c'],
      [
        ['a', 'b'],
        ['b', 'c'],
      ]
    );
    // c unowned — cannot be reached through playerNodes filter
    const board = boardFrom(graph, { a: 1, b: 1 });
    expect(playerConnectsSets(board, 1, ['a'], ['c'])).toBe(false);
  });

  it('grid: left edge connects to right edge via a solid row', () => {
    const grid = createGridGraph(3, 3);
    const board = boardFrom(grid, {
      '1-0': 1,
      '1-1': 1,
      '1-2': 1,
      '0-1': 2,
      '2-1': 2,
    });
    expect(playerConnectsSets(board, 1, ['1-0'], ['1-2'])).toBe(true);
    expect(playerConnectsSets(board, 2, ['0-1'], ['2-1'])).toBe(false);
  });

  it('star: leaves connect only through owned center', () => {
    const star = createStarGraph(4);
    const ownedCenter = boardFrom(star, {
      center: 1,
      n0: 1,
      n2: 1,
    });
    expect(playerConnectsSets(ownedCenter, 1, ['n0'], ['n2'])).toBe(true);

    const emptyCenter = boardFrom(star, {
      n0: 1,
      n2: 1,
    });
    expect(playerConnectsSets(emptyCenter, 1, ['n0'], ['n2'])).toBe(false);
  });

  it('tries multiple setA seeds until one works', () => {
    const graph = undirected(
      ['a', 'b', 'c', 'd'],
      [
        ['a', 'b'],
        ['c', 'd'],
      ]
    );
    const board = boardFrom(graph, { a: 2, b: 2, c: 1, d: 1 });
    expect(playerConnectsSets(board, 1, ['a', 'c'], ['d'])).toBe(true);
  });
});

describe('Wave 27 graph-player-connect — findLongestPlayerPath', () => {
  it('empty ownership yields empty path', () => {
    const graph = undirected(['a', 'b'], [['a', 'b']]);
    const board = boardFrom(graph, {});
    expect(findLongestPlayerPath(board, 1)).toEqual([]);
  });

  it('single node path length 1', () => {
    const graph = undirected(['a', 'b'], [['a', 'b']]);
    const board = boardFrom(graph, { a: 1 });
    expect(findLongestPlayerPath(board, 1)).toEqual(['a']);
  });

  it('finds the full owned chain', () => {
    const graph = undirected(
      ['a', 'b', 'c', 'd'],
      [
        ['a', 'b'],
        ['b', 'c'],
        ['c', 'd'],
      ]
    );
    const board = boardFrom(graph, { a: 1, b: 1, c: 1, d: 2 });
    const path = findLongestPlayerPath(board, 1);
    expect(path).toHaveLength(3);
    expect(path.every((id) => ['a', 'b', 'c'].includes(id))).toBe(true);
  });

  it('track fully owned → longest equals track length', () => {
    const track = createTrackGraph(6);
    const owners: Record<string, number> = {};
    for (const id of track.nodes.keys()) owners[id] = 1;
    const board = boardFrom(track, owners);
    expect(findLongestPlayerPath(board, 1)).toHaveLength(6);
  });

  it('prefers longer branch over a short stub', () => {
    //    a-b-c-d
    //        |
    //        e
    const graph = undirected(
      ['a', 'b', 'c', 'd', 'e'],
      [
        ['a', 'b'],
        ['b', 'c'],
        ['c', 'd'],
        ['c', 'e'],
      ]
    );
    const board = boardFrom(graph, {
      a: 1,
      b: 1,
      c: 1,
      d: 1,
      e: 1,
    });
    const path = findLongestPlayerPath(board, 1);
    expect(path.length).toBe(4); // a-b-c-d or e-c-b-a etc.
  });

  it('ignores opponent nodes in the longest path', () => {
    const graph = undirected(
      ['a', 'b', 'c', 'd'],
      [
        ['a', 'b'],
        ['b', 'c'],
        ['c', 'd'],
      ]
    );
    const board = boardFrom(graph, { a: 1, b: 1, c: 2, d: 1 });
    const path = findLongestPlayerPath(board, 1);
    expect(path.length).toBeLessThanOrEqual(2);
    expect(path.every((id) => id !== 'c')).toBe(true);
  });

  it('grid row ownership yields length equal to cols', () => {
    const grid = createGridGraph(3, 4);
    const board = boardFrom(grid, {
      '1-0': 1,
      '1-1': 1,
      '1-2': 1,
      '1-3': 1,
      '0-0': 2,
      '2-3': 2,
    });
    expect(findLongestPlayerPath(board, 1)).toHaveLength(4);
  });

  it('two players independently report their own longest', () => {
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
      e: 2,
    });
    expect(findLongestPlayerPath(board, 1)).toHaveLength(2);
    expect(findLongestPlayerPath(board, 2)).toHaveLength(3);
  });
});
