/**
 * Wave 34 — directed bfs / dijkstra one-way path matrix.
 * Complements undirected wave 27 bfs matrix. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  bfs,
  dijkstra,
  findAllPaths,
  type Graph,
  type GraphNode,
  type NodeId,
} from '../../src/core/graph';

function node(id: NodeId): GraphNode {
  return { id, position: { x: 0, y: 0 } };
}

function directed(
  nodes: NodeId[],
  edges: Array<[NodeId, NodeId, number?]>
): Graph {
  return {
    nodes: new Map(nodes.map((id) => [id, node(id)])),
    directed: true,
    edges: edges.map(([from, to, weight]) =>
      weight === undefined ? { from, to } : { from, to, weight }
    ),
  };
}

describe('Wave 34 graph-directed-paths — one-way bfs/dijkstra', () => {
  it('forward path found; reverse not found', () => {
    const g = directed(
      ['a', 'b', 'c'],
      [
        ['a', 'b'],
        ['b', 'c'],
      ]
    );
    expect(bfs(g, 'a', 'c')).toEqual({
      found: true,
      path: ['a', 'b', 'c'],
      distance: 2,
    });
    expect(bfs(g, 'c', 'a').found).toBe(false);
    expect(dijkstra(g, 'a', 'c').distance).toBe(2);
    expect(dijkstra(g, 'c', 'a').found).toBe(false);
  });

  it('weighted directed prefers cheaper chain', () => {
    const g = directed(
      ['a', 'b', 'c'],
      [
        ['a', 'c', 50],
        ['a', 'b', 2],
        ['b', 'c', 2],
      ]
    );
    const r = dijkstra(g, 'a', 'c');
    expect(r.distance).toBe(4);
    expect(r.path).toEqual(['a', 'b', 'c']);
  });

  it('cycle allows return only following arrows', () => {
    const g = directed(
      ['a', 'b', 'c'],
      [
        ['a', 'b'],
        ['b', 'c'],
        ['c', 'a'],
      ]
    );
    expect(bfs(g, 'a', 'c').distance).toBe(2);
    expect(bfs(g, 'c', 'b').distance).toBe(2); // c→a→b
    expect(findAllPaths(g, 'a', 'a', 3)).toEqual([
      { nodes: ['a'], totalWeight: 0 },
    ]);
    // with depth allowing the cycle once: a→b→c→a
    const loop = findAllPaths(g, 'a', 'a', 3);
    // implementation returns immediately when current===end at start,
    // so only trivial path — document that contract
    expect(loop).toHaveLength(1);
  });

  it('branching DAG enumerates both directed routes', () => {
    const g = directed(
      ['s', 'a', 'b', 't'],
      [
        ['s', 'a'],
        ['s', 'b'],
        ['a', 't'],
        ['b', 't'],
      ]
    );
    const paths = findAllPaths(g, 's', 't');
    expect(paths).toHaveLength(2);
    expect(bfs(g, 's', 't').distance).toBe(2);
  });
});
