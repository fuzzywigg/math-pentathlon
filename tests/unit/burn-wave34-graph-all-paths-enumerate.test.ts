/**
 * Wave 34 — findAllPaths combinatorial counts + maxDepth clamps.
 * Deepens wave 27 path-edges. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  findAllPaths,
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
    edges: edges.map(([from, to, weight]) =>
      weight === undefined ? { from, to } : { from, to, weight }
    ),
  };
}

function directed(nodes: NodeId[], edges: Array<[NodeId, NodeId]>): Graph {
  return {
    nodes: new Map(nodes.map((id) => [id, node(id)])),
    directed: true,
    edges: edges.map(([from, to]) => ({ from, to })),
  };
}

describe('Wave 34 graph-all-paths — enumerate + depth clamp', () => {
  it('counts both routes on a diamond', () => {
    const g = undirected(
      ['a', 'b', 'c', 'd'],
      [
        ['a', 'b'],
        ['a', 'c'],
        ['b', 'd'],
        ['c', 'd'],
      ]
    );
    const paths = findAllPaths(g, 'a', 'd');
    expect(paths).toHaveLength(2);
    const encoded = paths.map((p) => p.nodes.join('>')).sort();
    expect(encoded).toEqual(['a>b>d', 'a>c>d']);
    expect(paths.every((p) => p.totalWeight === 2)).toBe(true);
  });

  it('maxDepth is node-count; depth 2 blocks a→b→c (3 nodes)', () => {
    const g = undirected(
      ['a', 'b', 'c'],
      [
        ['a', 'b'],
        ['b', 'c'],
      ]
    );
    // path [a,b,c] has length 3 — rejected when maxDepth=2
    expect(findAllPaths(g, 'a', 'c', 2)).toEqual([]);
    expect(findAllPaths(g, 'a', 'c', 3)).toHaveLength(1);
    // direct edge is path length 2
    expect(findAllPaths(g, 'a', 'b', 2)).toHaveLength(1);
  });

  it('start===end returns the trivial single-node path', () => {
    const g = undirected(['a', 'b'], [['a', 'b']]);
    const paths = findAllPaths(g, 'a', 'a');
    expect(paths).toEqual([{ nodes: ['a'], totalWeight: 0 }]);
  });

  it('complete K4 has (n-2)! simple paths of length n-1 between a pair? — count all simple', () => {
    // K3: exactly 2 simple paths a-b-c and a-c between a and c? wait a-c direct + a-b-c
    const g = undirected(
      ['a', 'b', 'c'],
      [
        ['a', 'b'],
        ['b', 'c'],
        ['a', 'c'],
      ]
    );
    const paths = findAllPaths(g, 'a', 'c');
    expect(paths).toHaveLength(2);
  });

  it('directed forbids reverse walk so only forward routes remain', () => {
    const g = directed(
      ['a', 'b', 'c', 'd'],
      [
        ['a', 'b'],
        ['a', 'c'],
        ['b', 'd'],
        ['c', 'd'],
      ]
    );
    const paths = findAllPaths(g, 'a', 'd');
    expect(paths).toHaveLength(2);
    // no edges out of d ⇒ no path d→…
    expect(findAllPaths(g, 'd', 'a')).toEqual([]);
    expect(findAllPaths(g, 'd', 'b')).toEqual([]);
  });

  it('accumulates custom edge weights along each path', () => {
    const g = undirected(
      ['a', 'b', 'c'],
      [
        ['a', 'b', 2],
        ['b', 'c', 3],
        ['a', 'c', 10],
      ]
    );
    const paths = findAllPaths(g, 'a', 'c');
    const byKey = new Map(paths.map((p) => [p.nodes.join('>'), p.totalWeight]));
    expect(byKey.get('a>c')).toBe(10);
    expect(byKey.get('a>b>c')).toBe(5);
  });
});
