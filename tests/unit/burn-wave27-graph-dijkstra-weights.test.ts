/**
 * Wave 27 — Dijkstra weighted shortest paths / default weights / ties.
 * Distinct from unweighted BFS coverage and #141 contiguous path APIs.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  dijkstra,
  bfs,
  createGridGraph,
  type Graph,
  type GraphNode,
  type NodeId,
} from '../../src/core/graph';

function node(id: NodeId): GraphNode {
  return { id, position: { x: 0, y: 0 } };
}

function undirected(
  nodes: NodeId[],
  edges: Array<[NodeId, NodeId, number?]>
): Graph {
  return {
    nodes: new Map(nodes.map((id) => [id, node(id)])),
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

describe('Wave 27 graph-dijkstra — identity and misses', () => {
  it('start === end yields distance 0', () => {
    const g = undirected(['a', 'b'], [['a', 'b', 5]]);
    expect(dijkstra(g, 'a', 'a')).toEqual({
      found: true,
      path: ['a'],
      distance: 0,
    });
  });

  it('unreachable nodes return not found', () => {
    const g = undirected(['a', 'b', 'c'], [['a', 'b', 1]]);
    expect(dijkstra(g, 'a', 'c')).toEqual({
      found: false,
      path: [],
      distance: -1,
    });
  });

  it('isolated start cannot reach a sibling', () => {
    const g = undirected(['a', 'b'], []);
    expect(dijkstra(g, 'a', 'b').found).toBe(false);
  });
});

describe('Wave 27 graph-dijkstra — weight preferences', () => {
  it('prefers lower total weight over fewer hops', () => {
    const g = undirected(
      ['a', 'b', 'c'],
      [
        ['a', 'b', 1],
        ['b', 'c', 1],
        ['a', 'c', 10],
      ]
    );
    const result = dijkstra(g, 'a', 'c');
    expect(result.found).toBe(true);
    expect(result.path).toEqual(['a', 'b', 'c']);
    expect(result.distance).toBe(2);
  });

  it('takes expensive direct edge when it is still cheaper', () => {
    const g = undirected(
      ['a', 'b', 'c'],
      [
        ['a', 'b', 5],
        ['b', 'c', 5],
        ['a', 'c', 9],
      ]
    );
    const result = dijkstra(g, 'a', 'c');
    expect(result.path).toEqual(['a', 'c']);
    expect(result.distance).toBe(9);
  });

  it('defaults missing weights to 1', () => {
    const g = undirected(
      ['a', 'b', 'c'],
      [
        ['a', 'b'],
        ['b', 'c'],
      ]
    );
    const result = dijkstra(g, 'a', 'c');
    expect(result).toEqual({
      found: true,
      path: ['a', 'b', 'c'],
      distance: 2,
    });
  });

  it('mixes explicit and default weights correctly', () => {
    const g = undirected(
      ['a', 'b', 'c', 'd'],
      [
        ['a', 'b', 2],
        ['b', 'd'], // weight 1
        ['a', 'c', 10],
        ['c', 'd', 1],
      ]
    );
    // a-b-d = 3, a-c-d = 11
    expect(dijkstra(g, 'a', 'd')).toEqual({
      found: true,
      path: ['a', 'b', 'd'],
      distance: 3,
    });
  });

  it('zero-weight edges are allowed and preferred', () => {
    const g = undirected(
      ['a', 'b', 'c'],
      [
        ['a', 'b', 0],
        ['b', 'c', 0],
        ['a', 'c', 1],
      ]
    );
    const result = dijkstra(g, 'a', 'c');
    expect(result.distance).toBe(0);
    expect(result.path).toEqual(['a', 'b', 'c']);
  });
});

describe('Wave 27 graph-dijkstra — directed weights', () => {
  it('respects arrow direction with asymmetric costs', () => {
    const g = directed(
      ['a', 'b', 'c'],
      [
        ['a', 'b', 1],
        ['b', 'c', 1],
        ['c', 'a', 100],
      ]
    );
    expect(dijkstra(g, 'a', 'c').distance).toBe(2);
    expect(dijkstra(g, 'c', 'b').path).toEqual(['c', 'a', 'b']);
    expect(dijkstra(g, 'c', 'b').distance).toBe(101);
  });

  it('one-way expensive path is the only option', () => {
    const g = directed(['a', 'b'], [['a', 'b', 42]]);
    expect(dijkstra(g, 'a', 'b')).toEqual({
      found: true,
      path: ['a', 'b'],
      distance: 42,
    });
    expect(dijkstra(g, 'b', 'a').found).toBe(false);
  });
});

describe('Wave 27 graph-dijkstra — vs BFS agreement', () => {
  it('matches BFS hop distance when all weights are 1', () => {
    const g = undirected(
      ['a', 'b', 'c', 'd', 'e'],
      [
        ['a', 'b', 1],
        ['b', 'c', 1],
        ['a', 'd', 1],
        ['d', 'c', 1],
        ['c', 'e', 1],
      ]
    );
    const d = dijkstra(g, 'a', 'e');
    const b = bfs(g, 'a', 'e');
    expect(d.found).toBe(true);
    expect(b.found).toBe(true);
    expect(d.distance).toBe(b.distance);
  });

  it('matches BFS on unweighted grid graphs', () => {
    const grid = createGridGraph(5, 5);
    const pairs: Array<[NodeId, NodeId]> = [
      ['0-0', '4-4'],
      ['1-2', '3-4'],
      ['2-2', '2-2'],
      ['0-4', '4-0'],
    ];
    for (const [from, to] of pairs) {
      expect(dijkstra(grid, from, to).distance).toBe(
        bfs(grid, from, to).distance
      );
    }
  });

  it('diverges from BFS when a long cheap path exists', () => {
    const g = undirected(
      ['a', 'b', 'c', 'd'],
      [
        ['a', 'b', 1],
        ['b', 'c', 1],
        ['c', 'd', 1],
        ['a', 'd', 100],
      ]
    );
    expect(bfs(g, 'a', 'd').distance).toBe(1); // hop count
    expect(dijkstra(g, 'a', 'd').distance).toBe(3); // weight
    expect(dijkstra(g, 'a', 'd').path).toEqual(['a', 'b', 'c', 'd']);
  });
});

describe('Wave 27 graph-dijkstra — path reconstruction invariants', () => {
  it('path endpoints and uniqueness', () => {
    const g = undirected(
      ['s', 'a', 'b', 't'],
      [
        ['s', 'a', 2],
        ['a', 't', 2],
        ['s', 'b', 3],
        ['b', 't', 3],
      ]
    );
    const result = dijkstra(g, 's', 't');
    expect(result.path[0]).toBe('s');
    expect(result.path.at(-1)).toBe('t');
    expect(new Set(result.path).size).toBe(result.path.length);
    expect(result.distance).toBe(4);
  });

  it('multi-hop weighted corridor accumulates correctly', () => {
    const g = undirected(
      ['0', '1', '2', '3'],
      [
        ['0', '1', 2],
        ['1', '2', 3],
        ['2', '3', 5],
      ]
    );
    expect(dijkstra(g, '0', '3')).toEqual({
      found: true,
      path: ['0', '1', '2', '3'],
      distance: 10,
    });
  });

  it('chooses among equal-weight alternatives with finite distance', () => {
    const g = undirected(
      ['a', 'b', 'c', 'd'],
      [
        ['a', 'b', 2],
        ['b', 'd', 2],
        ['a', 'c', 2],
        ['c', 'd', 2],
      ]
    );
    const result = dijkstra(g, 'a', 'd');
    expect(result.found).toBe(true);
    expect(result.distance).toBe(4);
    expect(result.path).toHaveLength(3);
  });
});
