/**
 * Wave 25 — graph algorithms path/component/region edges.
 * Deepens beyond graph.test.ts smoke. Distinct from wave 22 graph-ui templates
 * and wave 24 grid-alignment. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  bfs,
  dijkstra,
  findAllPaths,
  findComponents,
  findReachable,
  findNodesAtDistance,
  findNodesWithinDistance,
  findAllPlayerRegions,
  findPlayerRegion,
  playerConnectsSets,
  findLongestPlayerPath,
  isConnected,
  type Graph,
  type GraphBoard,
  type GraphNode,
  type NodeId,
} from '../../src/core/graph';

function node(id: NodeId, x = 0, y = 0): GraphNode {
  return { id, position: { x, y } };
}

function undirected(
  nodes: NodeId[],
  edges: Array<[NodeId, NodeId, number?]>
): Graph {
  const map = new Map(nodes.map((id) => [id, node(id)]));
  return {
    nodes: map,
    directed: false,
    edges: edges.map(([from, to, weight]) => ({ from, to, weight })),
  };
}

function directed(
  nodes: NodeId[],
  edges: Array<[NodeId, NodeId, number?]>
): Graph {
  return { ...undirected(nodes, edges), directed: true };
}

function board(graph: Graph, ownership: Array<[NodeId, number]>): GraphBoard {
  return {
    graph,
    nodeStates: new Map(
      ownership.map(([id, owner]) => [id, { owner, highlighted: false }])
    ),
  };
}

describe('Wave 25 graph — paths + distance deepen', () => {
  it('findAllPaths respects maxDepth and enumerates alternates', () => {
    const g = undirected(
      ['a', 'b', 'c', 'd'],
      [
        ['a', 'b'],
        ['a', 'c'],
        ['b', 'd'],
        ['c', 'd'],
      ]
    );
    const paths = findAllPaths(g, 'a', 'd', 3);
    expect(paths.length).toBeGreaterThanOrEqual(2);
    expect(
      paths.every(
        (p) => p.nodes[0] === 'a' && p.nodes[p.nodes.length - 1] === 'd'
      )
    ).toBe(true);

    const shallow = findAllPaths(g, 'a', 'd', 1);
    expect(shallow.length).toBe(0);

    expect(findAllPaths(g, 'a', 'a', 2)).toEqual([
      { nodes: ['a'], totalWeight: 0 },
    ]);
  });

  it('bfs vs dijkstra diverge when weights matter', () => {
    const g = undirected(
      ['s', 'a', 'b', 't'],
      [
        ['s', 'a', 1],
        ['a', 't', 100],
        ['s', 'b', 50],
        ['b', 't', 1],
      ]
    );
    const unweighted = bfs(g, 's', 't');
    expect(unweighted.found).toBe(true);
    expect(unweighted.path).toEqual(['s', 'a', 't']);

    const weighted = dijkstra(g, 's', 't');
    expect(weighted.found).toBe(true);
    expect(weighted.path).toEqual(['s', 'b', 't']);
    expect(weighted.distance).toBe(51);
  });

  it('distance queries handle missing nodes and rings', () => {
    const ring = undirected(
      ['a', 'b', 'c', 'd'],
      [
        ['a', 'b'],
        ['b', 'c'],
        ['c', 'd'],
        ['d', 'a'],
      ]
    );
    expect(findNodesAtDistance(ring, 'a', 2).sort()).toEqual(['c']);
    expect(findNodesWithinDistance(ring, 'a', 1).sort()).toEqual([
      'a',
      'b',
      'd',
    ]);
    expect(findNodesAtDistance(ring, 'missing', 1)).toEqual([]);
  });
});

describe('Wave 25 graph — components + directed reachability', () => {
  it('findComponents splits islands; directed isConnected is stricter', () => {
    const g = undirected(
      ['a', 'b', 'c', 'd'],
      [
        ['a', 'b'],
        ['c', 'd'],
      ]
    );
    const components = findComponents(g);
    expect(components).toHaveLength(2);
    expect(isConnected(g)).toBe(false);

    const dig = directed(
      ['a', 'b', 'c'],
      [
        ['a', 'b'],
        ['b', 'c'],
      ]
    );
    expect(findReachable(dig, 'a').has('c')).toBe(true);
    expect(findReachable(dig, 'c').has('a')).toBe(false);
    // directed connectivity uses undirected neighbor walk in isConnected —
    // still true if underlying undirected would connect
    expect(isConnected(dig)).toBe(true);
  });
});

describe('Wave 25 graph — player regions', () => {
  it('findAllPlayerRegions splits disconnected ownership', () => {
    const g = undirected(
      ['a', 'b', 'c', 'd', 'e'],
      [
        ['a', 'b'],
        ['b', 'c'],
        ['d', 'e'],
      ]
    );
    const b = board(g, [
      ['a', 1],
      ['b', 1],
      ['c', 2],
      ['d', 1],
      ['e', 1],
    ]);
    const regions = findAllPlayerRegions(b, 1);
    expect(regions).toHaveLength(2);
    expect(regions.map((r) => r.length).sort()).toEqual([2, 2]);

    expect(findPlayerRegion(b, 'c', 1)).toEqual([]);
    expect(findPlayerRegion(b, 'a', 1).sort()).toEqual(['a', 'b']);
  });

  it('playerConnectsSets and longest path across owned corridor', () => {
    const g = undirected(
      ['n1', 'n2', 'n3', 'n4'],
      [
        ['n1', 'n2'],
        ['n2', 'n3'],
        ['n3', 'n4'],
      ]
    );
    const owned = board(g, [
      ['n1', 1],
      ['n2', 1],
      ['n3', 1],
      ['n4', 1],
    ]);
    expect(playerConnectsSets(owned, 1, ['n1'], ['n4'])).toBe(true);
    expect(playerConnectsSets(owned, 2, ['n1'], ['n4'])).toBe(false);

    const longest = findLongestPlayerPath(owned, 1);
    expect(longest.length).toBe(4);
    expect(longest[0]).toBe('n1');
    expect(longest[3]).toBe('n4');
  });
});
