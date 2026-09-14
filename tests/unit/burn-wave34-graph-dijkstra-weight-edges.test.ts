/**
 * Wave 34 — dijkstra zero / missing / uneven weight edges.
 * Distinct from wave 27 positive-weight matrix. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  dijkstra,
  bfs,
  type Graph,
  type GraphNode,
  type NodeId,
} from '../../src/core/graph';

function node(id: NodeId): GraphNode {
  return { id, position: { x: 0, y: 0 } };
}

function weighted(
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

describe('Wave 34 graph-dijkstra-weights — zero / default / skew', () => {
  it('zero-weight edge is preferred over longer positive path', () => {
    const g = weighted(
      ['a', 'b', 'c'],
      [
        ['a', 'b', 0],
        ['b', 'c', 0],
        ['a', 'c', 10],
      ]
    );
    const r = dijkstra(g, 'a', 'c');
    expect(r.found).toBe(true);
    expect(r.distance).toBe(0);
    expect(r.path).toEqual(['a', 'b', 'c']);
  });

  it('missing weight defaults to 1 (matches bfs hop count)', () => {
    const g = weighted(
      ['a', 'b', 'c', 'd'],
      [
        ['a', 'b'],
        ['b', 'c'],
        ['c', 'd'],
      ]
    );
    const d = dijkstra(g, 'a', 'd');
    const b = bfs(g, 'a', 'd');
    expect(d.distance).toBe(3);
    expect(d.distance).toBe(b.distance);
  });

  it('expensive direct edge loses to cheap multi-hop', () => {
    const g = weighted(
      ['a', 'b', 'c'],
      [
        ['a', 'c', 100],
        ['a', 'b', 1],
        ['b', 'c', 1],
      ]
    );
    const r = dijkstra(g, 'a', 'c');
    expect(r.distance).toBe(2);
    expect(r.path).toEqual(['a', 'b', 'c']);
  });

  it('directed weighted path cannot go upstream on a chain', () => {
    const g: Graph = {
      nodes: new Map(['a', 'b', 'c'].map((id) => [id, node(id)])),
      directed: true,
      edges: [
        { from: 'a', to: 'b', weight: 1 },
        { from: 'b', to: 'c', weight: 1 },
      ],
    };
    expect(dijkstra(g, 'c', 'b').found).toBe(false);
    expect(dijkstra(g, 'c', 'a').found).toBe(false);
    expect(dijkstra(g, 'a', 'c').distance).toBe(2);
  });
});
