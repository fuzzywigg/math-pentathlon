/**
 * Wave 34 — distance rings partition reachable set.
 * Deepens wave 27 paths-distance. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  findNodesAtDistance,
  findNodesWithinDistance,
  findReachable,
  createGridGraph,
  createTrackGraph,
  createStarGraph,
  type Graph,
  type GraphNode,
  type NodeId,
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

describe('Wave 34 graph-distance-rings — partition + nesting', () => {
  it('rings 0..D partition the reachable set on a track', () => {
    const g = createTrackGraph(6);
    const start = 't0';
    const reachable = findReachable(g, start);
    const union = new Set<NodeId>();
    for (let d = 0; d <= 5; d++) {
      for (const id of findNodesAtDistance(g, start, d)) union.add(id);
    }
    expect([...union].sort()).toEqual([...reachable].sort());
    expect(findNodesAtDistance(g, start, 0)).toEqual([start]);
    expect(findNodesAtDistance(g, start, 5).sort()).toEqual(['t5']);
    expect(findNodesAtDistance(g, start, 6)).toEqual([]);
  });

  it('within(d) equals union of rings 0..d and is nested', () => {
    const g = createGridGraph(3, 3);
    const start = '1-1';
    let prev = new Set<NodeId>();
    for (let d = 0; d <= 4; d++) {
      const within = new Set(findNodesWithinDistance(g, start, d));
      const ringUnion = new Set<NodeId>();
      for (let k = 0; k <= d; k++) {
        for (const id of findNodesAtDistance(g, start, k)) ringUnion.add(id);
      }
      expect([...within].sort()).toEqual([...ringUnion].sort());
      for (const id of prev) expect(within.has(id)).toBe(true);
      prev = within;
    }
  });

  it('star: ring1 is all leaves; ring2 empty', () => {
    const g = createStarGraph(6);
    expect(findNodesAtDistance(g, 'center', 1).sort()).toEqual(
      ['n0', 'n1', 'n2', 'n3', 'n4', 'n5'].sort()
    );
    expect(findNodesAtDistance(g, 'center', 2)).toEqual([]);
    expect(findNodesWithinDistance(g, 'center', 1).length).toBe(7);
  });

  it('distance from a leaf across undirected line', () => {
    const g = undirected(
      ['a', 'b', 'c', 'd'],
      [
        ['a', 'b'],
        ['b', 'c'],
        ['c', 'd'],
      ]
    );
    expect(findNodesAtDistance(g, 'a', 3)).toEqual(['d']);
    expect(findNodesWithinDistance(g, 'a', 2).sort()).toEqual([
      'a',
      'b',
      'c',
    ]);
  });
});
