/**
 * Wave 34 — directed adjacency / getEdge / areAdjacent asymmetry matrix.
 * Deepens wave 27 neighbors beyond undirected smoke. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  getNeighbors,
  getEdge,
  areAdjacent,
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

function undirected(nodes: NodeId[], edges: Array<[NodeId, NodeId]>): Graph {
  return { ...directed(nodes, edges), directed: false };
}

describe('Wave 34 graph-directed-adj — one-way neighbors', () => {
  it('A→B yields neighbor B from A but not A from B', () => {
    const g = directed(
      ['a', 'b', 'c'],
      [
        ['a', 'b'],
        ['b', 'c'],
      ]
    );
    expect(getNeighbors(g, 'a').sort()).toEqual(['b']);
    expect(getNeighbors(g, 'b').sort()).toEqual(['c']);
    expect(getNeighbors(g, 'c')).toEqual([]);
  });

  it('areAdjacent is directional under directed:true', () => {
    const g = directed(['a', 'b'], [['a', 'b']]);
    expect(areAdjacent(g, 'a', 'b')).toBe(true);
    expect(areAdjacent(g, 'b', 'a')).toBe(false);
    expect(getEdge(g, 'a', 'b')?.from).toBe('a');
    expect(getEdge(g, 'b', 'a')).toBeUndefined();
  });

  it('undirected still finds reverse getEdge', () => {
    const g = undirected(['a', 'b'], [['a', 'b']]);
    expect(areAdjacent(g, 'b', 'a')).toBe(true);
    expect(getEdge(g, 'b', 'a')?.from).toBe('a');
    expect(getNeighbors(g, 'b')).toEqual(['a']);
  });

  it('multi-out star center fans out; leaves have zero out-neighbors', () => {
    const leaves = ['n0', 'n1', 'n2', 'n3', 'n4'];
    const g = directed(
      ['center', ...leaves],
      leaves.map((l) => ['center', l] as [NodeId, NodeId])
    );
    expect(getNeighbors(g, 'center').sort()).toEqual([...leaves].sort());
    for (const leaf of leaves) {
      expect(getNeighbors(g, leaf)).toEqual([]);
      expect(areAdjacent(g, 'center', leaf)).toBe(true);
      expect(areAdjacent(g, leaf, 'center')).toBe(false);
    }
  });

  it('unknown node returns empty neighbors and no adjacency', () => {
    const g = directed(['a'], []);
    expect(getNeighbors(g, 'ghost')).toEqual([]);
    expect(areAdjacent(g, 'a', 'ghost')).toBe(false);
    expect(getEdge(g, 'ghost', 'a')).toBeUndefined();
  });
});
