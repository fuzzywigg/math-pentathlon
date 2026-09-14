/**
 * Wave 34 — getNodeDegree handshaking + directed out-degree semantics.
 * Deepens wave 27 neighbors-degree. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  getNodeDegree,
  getNeighbors,
  createCompleteGraph,
  createTrackGraph,
  createStarGraph,
  createGridGraph,
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

describe('Wave 34 graph-degree — handshaking lemma', () => {
  it('sum of degrees equals 2|E| on undirected templates', () => {
    const graphs = [
      createTrackGraph(7),
      createStarGraph(5),
      createCompleteGraph(5),
      createGridGraph(3, 4),
    ];
    for (const g of graphs) {
      let sum = 0;
      for (const id of g.nodes.keys()) sum += getNodeDegree(g, id);
      expect(sum).toBe(2 * g.edges.length);
    }
  });

  it('degree equals neighbor count for every node', () => {
    const g = createGridGraph(3, 3);
    for (const id of g.nodes.keys()) {
      expect(getNodeDegree(g, id)).toBe(getNeighbors(g, id).length);
    }
  });

  it('directed out-degree: only outgoing edges count', () => {
    const g = directed(
      ['a', 'b', 'c'],
      [
        ['a', 'b'],
        ['a', 'c'],
        ['b', 'c'],
      ]
    );
    expect(getNodeDegree(g, 'a')).toBe(2);
    expect(getNodeDegree(g, 'b')).toBe(1);
    expect(getNodeDegree(g, 'c')).toBe(0);
  });

  it('unknown node has degree 0', () => {
    const g = createTrackGraph(3);
    expect(getNodeDegree(g, 'missing')).toBe(0);
  });

  it('track endpoints degree 1; interior degree 2', () => {
    const g = createTrackGraph(5);
    expect(getNodeDegree(g, 't0')).toBe(1);
    expect(getNodeDegree(g, 't4')).toBe(1);
    for (const mid of ['t1', 't2', 't3']) {
      expect(getNodeDegree(g, mid)).toBe(2);
    }
  });
});
