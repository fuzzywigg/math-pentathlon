/**
 * Graph Algorithms Unit Tests
 * Covers src/core/graph/algorithms.ts (#9)
 */

import { describe, it, expect } from 'vitest';
import {
  getNeighbors,
  getEdge,
  areAdjacent,
  bfs,
  dijkstra,
  isConnected,
  findComponents,
  findReachable,
  findAllPaths,
  findNodesAtDistance,
  findNodesWithinDistance,
  getNodeDegree,
  findPlayerRegion,
  findAllPlayerRegions,
  playerConnectsSets,
  findLongestPlayerPath,
  createGridGraph,
  type Graph,
  type GraphBoard,
  type GraphNode,
  type NodeId,
} from '../../src/core/graph';

function node(id: NodeId, x = 0, y = 0): GraphNode {
  return { id, position: { x, y } };
}

function undirected(nodes: NodeId[], edges: Array<[NodeId, NodeId, number?]>): Graph {
  const map = new Map(nodes.map((id) => [id, node(id)]));
  return {
    nodes: map,
    directed: false,
    edges: edges.map(([from, to, weight]) => ({ from, to, weight })),
  };
}

function directed(nodes: NodeId[], edges: Array<[NodeId, NodeId, number?]>): Graph {
  return { ...undirected(nodes, edges), directed: true };
}

describe('neighbors and adjacency', () => {
  const graph = undirected(['a', 'b', 'c'], [
    ['a', 'b'],
    ['b', 'c'],
  ]);

  it('lists neighbors for undirected graphs', () => {
    expect(getNeighbors(graph, 'b').sort()).toEqual(['a', 'c']);
    expect(getNeighbors(graph, 'a')).toEqual(['b']);
  });

  it('respects directed edges', () => {
    const digraph = directed(['a', 'b'], [['a', 'b']]);
    expect(getNeighbors(digraph, 'a')).toEqual(['b']);
    expect(getNeighbors(digraph, 'b')).toEqual([]);
  });

  it('finds edges and adjacency', () => {
    expect(getEdge(graph, 'a', 'b')?.from).toBe('a');
    expect(getEdge(graph, 'b', 'a')?.from).toBe('a');
    expect(areAdjacent(graph, 'a', 'c')).toBe(false);
    expect(areAdjacent(graph, 'a', 'b')).toBe(true);
  });
});

describe('bfs', () => {
  const graph = undirected(['a', 'b', 'c', 'd'], [
    ['a', 'b'],
    ['b', 'c'],
    ['a', 'd'],
  ]);

  it('finds the shortest unweighted path', () => {
    const result = bfs(graph, 'a', 'c');
    expect(result.found).toBe(true);
    expect(result.path).toEqual(['a', 'b', 'c']);
    expect(result.distance).toBe(2);
  });

  it('handles start === end and disconnected nodes', () => {
    expect(bfs(graph, 'a', 'a')).toEqual({ found: true, path: ['a'], distance: 0 });

    const disconnected = undirected(['a', 'z'], []);
    expect(bfs(disconnected, 'a', 'z')).toEqual({ found: false, path: [], distance: -1 });
  });
});

describe('dijkstra', () => {
  it('prefers lower-weight paths over fewer hops', () => {
    const graph = undirected(['a', 'b', 'c'], [
      ['a', 'b', 1],
      ['b', 'c', 1],
      ['a', 'c', 10],
    ]);
    const result = dijkstra(graph, 'a', 'c');
    expect(result.found).toBe(true);
    expect(result.path).toEqual(['a', 'b', 'c']);
    expect(result.distance).toBe(2);
  });

  it('returns not found for unreachable nodes', () => {
    const graph = undirected(['a', 'b'], []);
    expect(dijkstra(graph, 'a', 'b')).toEqual({ found: false, path: [], distance: -1 });
  });
});

describe('connectivity', () => {
  it('reports connected and empty graphs as connected', () => {
    const connected = createGridGraph(2, 2);
    expect(isConnected(connected)).toBe(true);
    expect(isConnected({ nodes: new Map(), edges: [], directed: false })).toBe(true);
  });

  it('detects disconnected components', () => {
    const graph = undirected(['a', 'b', 'c', 'd'], [
      ['a', 'b'],
      ['c', 'd'],
    ]);
    expect(isConnected(graph)).toBe(false);
    const components = findComponents(graph);
    expect(components).toHaveLength(2);
    expect(components.flat().sort()).toEqual(['a', 'b', 'c', 'd']);
  });

  it('finds reachable nodes from a start', () => {
    const graph = undirected(['a', 'b', 'c', 'z'], [
      ['a', 'b'],
      ['b', 'c'],
    ]);
    expect([...findReachable(graph, 'a')].sort()).toEqual(['a', 'b', 'c']);
  });
});

describe('paths and distance queries', () => {
  const graph = undirected(['a', 'b', 'c', 'd'], [
    ['a', 'b'],
    ['b', 'c'],
    ['a', 'd'],
    ['d', 'c'],
  ]);

  it('finds multiple paths between nodes', () => {
    const paths = findAllPaths(graph, 'a', 'c');
    expect(paths.length).toBeGreaterThanOrEqual(2);
    expect(paths.every((p) => p.nodes[0] === 'a' && p.nodes.at(-1) === 'c')).toBe(true);
  });

  it('finds nodes at and within a distance', () => {
    expect(findNodesAtDistance(graph, 'a', 1).sort()).toEqual(['b', 'd']);
    expect(findNodesWithinDistance(graph, 'a', 1).sort()).toEqual(['a', 'b', 'd']);
  });

  it('reports node degree', () => {
    expect(getNodeDegree(graph, 'a')).toBe(2);
    expect(getNodeDegree(graph, 'c')).toBe(2);
  });
});

describe('player regions and connections', () => {
  function boardWithOwners(owners: Record<string, number>): GraphBoard {
    const ids = Object.keys(owners);
    const graph = undirected(ids, [
      ['a', 'b'],
      ['b', 'c'],
      ['c', 'd'],
    ]);
    const nodeStates = new Map(
      ids.map((id) => [id, { owner: owners[id] }])
    );
    return { graph, nodeStates };
  }

  it('finds a contiguous player region', () => {
    const board = boardWithOwners({ a: 1, b: 1, c: 2, d: 1 });
    expect(findPlayerRegion(board, 'a', 1).sort()).toEqual(['a', 'b']);
    expect(findAllPlayerRegions(board, 1)).toHaveLength(2);
  });

  it('detects whether a player connects two sets', () => {
    const connected = boardWithOwners({ a: 1, b: 1, c: 1, d: 2 });
    expect(playerConnectsSets(connected, 1, ['a'], ['c'])).toBe(true);

    const blocked = boardWithOwners({ a: 1, b: 2, c: 1, d: 2 });
    expect(playerConnectsSets(blocked, 1, ['a'], ['c'])).toBe(false);
  });

  it('finds the longest path owned by a player', () => {
    const board = boardWithOwners({ a: 1, b: 1, c: 1, d: 2 });
    const path = findLongestPlayerPath(board, 1);
    expect(path).toHaveLength(3);
    expect(path[0]).toBeDefined();
  });
});

describe('single-node graph edge cases', () => {
  const solo: Graph = {
    nodes: new Map([['only', node('only')]]),
    edges: [],
    directed: false,
  };

  it('treats a single node as connected with degree 0', () => {
    expect(isConnected(solo)).toBe(true);
    expect(getNodeDegree(solo, 'only')).toBe(0);
    expect(bfs(solo, 'only', 'only').found).toBe(true);
    expect(findComponents(solo)).toEqual([['only']]);
  });
});
