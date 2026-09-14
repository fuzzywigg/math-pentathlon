/**
 * Wave 34 — findReachable on directed DAGs / sinks / sources.
 * Deepens wave 27 reach beyond undirected. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  findReachable,
  type Graph,
  type GraphNode,
  type NodeId,
} from '../../src/core/graph';

function node(id: NodeId): GraphNode {
  return { id, position: { x: 0, y: 0 } };
}

function directed(nodes: NodeId[], edges: Array<[NodeId, NodeId]>): Graph {
  return {
    nodes: new Map(nodes.map((id) => [id, node(id)])),
    directed: true,
    edges: edges.map(([from, to]) => ({ from, to })),
  };
}

describe('Wave 34 graph-reachable — directed DAG matrix', () => {
  it('source reaches all descendants; sink reaches only itself', () => {
    // a→b→d, a→c→d
    const g = directed(
      ['a', 'b', 'c', 'd'],
      [
        ['a', 'b'],
        ['a', 'c'],
        ['b', 'd'],
        ['c', 'd'],
      ]
    );
    expect([...findReachable(g, 'a')].sort()).toEqual(['a', 'b', 'c', 'd']);
    expect([...findReachable(g, 'b')].sort()).toEqual(['b', 'd']);
    expect([...findReachable(g, 'c')].sort()).toEqual(['c', 'd']);
    expect([...findReachable(g, 'd')]).toEqual(['d']);
  });

  it('linear chain reachable sizes are suffix lengths', () => {
    const ids = ['n0', 'n1', 'n2', 'n3', 'n4'];
    const edges: Array<[NodeId, NodeId]> = [];
    for (let i = 0; i < ids.length - 1; i++) edges.push([ids[i], ids[i + 1]]);
    const g = directed(ids, edges);
    for (let i = 0; i < ids.length; i++) {
      expect(findReachable(g, ids[i]).size).toBe(ids.length - i);
    }
  });

  it('unreachable reverse edge does not enlarge set', () => {
    const g = directed(['a', 'b'], [['a', 'b']]);
    expect(findReachable(g, 'b').has('a')).toBe(false);
    expect(findReachable(g, 'a').has('b')).toBe(true);
  });

  it('always includes the start node even when isolated', () => {
    const g = directed(['solo', 'other'], []);
    expect([...findReachable(g, 'solo')]).toEqual(['solo']);
  });
});
