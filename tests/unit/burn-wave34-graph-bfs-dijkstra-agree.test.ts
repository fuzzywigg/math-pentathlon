/**
 * Wave 34 — bfs ↔ dijkstra agreement when every edge weight is 1.
 * Cross-cuts wave 27 separate bfs/dijkstra burns. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  bfs,
  dijkstra,
  createGridGraph,
  createCircularGraph,
  createTrackGraph,
  createStarGraph,
  createCompleteGraph,
  type Graph,
  type GraphNode,
  type NodeId,
} from '../../src/core/graph';

function node(id: NodeId): GraphNode {
  return { id, position: { x: 0, y: 0 } };
}

function withUnitWeights(graph: Graph): Graph {
  return {
    ...graph,
    edges: graph.edges.map((e) => ({ ...e, weight: 1 })),
  };
}

function undirected(nodes: NodeId[], edges: Array<[NodeId, NodeId]>): Graph {
  return {
    nodes: new Map(nodes.map((id) => [id, node(id)])),
    directed: false,
    edges: edges.map(([from, to]) => ({ from, to, weight: 1 })),
  };
}

describe('Wave 34 graph-bfs-dijkstra — unit-weight agreement', () => {
  it('matches on diamond and chord graphs', () => {
    const diamond = undirected(
      ['a', 'b', 'c', 'd'],
      [
        ['a', 'b'],
        ['a', 'c'],
        ['b', 'd'],
        ['c', 'd'],
      ]
    );
    const b = bfs(diamond, 'a', 'd');
    const d = dijkstra(diamond, 'a', 'd');
    expect(b.found).toBe(true);
    expect(d.found).toBe(true);
    expect(b.distance).toBe(d.distance);
    expect(b.distance).toBe(2);

    const chord = undirected(
      ['a', 'b', 'c'],
      [
        ['a', 'b'],
        ['b', 'c'],
        ['a', 'c'],
      ]
    );
    expect(bfs(chord, 'a', 'c').distance).toBe(
      dijkstra(chord, 'a', 'c').distance
    );
  });

  it('agrees across template factories for sample pairs', () => {
    const cases: Array<[Graph, NodeId, NodeId]> = [
      [withUnitWeights(createTrackGraph(6)), 't0', 't5'],
      [withUnitWeights(createCircularGraph(8)), 'n0', 'n4'],
      [withUnitWeights(createStarGraph(5)), 'center', 'n3'],
      [withUnitWeights(createGridGraph(3, 3)), '0-0', '2-2'],
      [withUnitWeights(createCompleteGraph(5)), 'n0', 'n3'],
    ];
    for (const [g, s, e] of cases) {
      const b = bfs(g, s, e);
      const d = dijkstra(g, s, e);
      expect(b.found).toBe(true);
      expect(d.found).toBe(true);
      expect(b.distance).toBe(d.distance);
      expect(b.path[0]).toBe(s);
      expect(b.path.at(-1)).toBe(e);
      expect(d.path[0]).toBe(s);
      expect(d.path.at(-1)).toBe(e);
    }
  });

  it('both miss the same disconnected pair', () => {
    const g = undirected(
      ['a', 'b', 'c', 'd'],
      [
        ['a', 'b'],
        ['c', 'd'],
      ]
    );
    expect(bfs(g, 'a', 'c')).toEqual({ found: false, path: [], distance: -1 });
    expect(dijkstra(g, 'a', 'c')).toEqual({
      found: false,
      path: [],
      distance: -1,
    });
  });
});
