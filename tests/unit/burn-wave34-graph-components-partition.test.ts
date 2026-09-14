/**
 * Wave 34 — findComponents partition invariants + directed weak components.
 * Deepens wave 27 connectivity. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  findComponents,
  isConnected,
  createTrackGraph,
  createGridGraph,
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

describe('Wave 34 graph-components — partition invariants', () => {
  it('every node appears in exactly one component', () => {
    const g = undirected(
      ['a', 'b', 'c', 'd', 'e', 'f'],
      [
        ['a', 'b'],
        ['c', 'd'],
        ['d', 'e'],
      ]
    );
    const comps = findComponents(g);
    expect(comps).toHaveLength(3);
    const flat = comps.flat().sort();
    expect(flat).toEqual(['a', 'b', 'c', 'd', 'e', 'f']);
    expect(new Set(flat).size).toBe(flat.length);
    expect(isConnected(g)).toBe(false);
  });

  it('connected templates yield a single component covering all nodes', () => {
    for (const g of [
      createTrackGraph(5),
      createStarGraph(4),
      createGridGraph(2, 3),
    ]) {
      const comps = findComponents(g);
      expect(comps).toHaveLength(1);
      expect(comps[0].sort()).toEqual([...g.nodes.keys()].sort());
      expect(isConnected(g)).toBe(true);
    }
  });

  it('isolated nodes are singleton components', () => {
    const g = undirected(['x', 'y', 'z'], []);
    const comps = findComponents(g);
    expect(comps).toHaveLength(3);
    expect(comps.every((c) => c.length === 1)).toBe(true);
    expect(isConnected(g)).toBe(false);
  });

  it('empty graph is vacuously connected with zero components', () => {
    const g: Graph = { nodes: new Map(), edges: [], directed: false };
    expect(findComponents(g)).toEqual([]);
    expect(isConnected(g)).toBe(true);
  });
});
