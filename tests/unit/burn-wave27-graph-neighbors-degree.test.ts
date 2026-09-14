/**
 * Wave 27 — graph neighbor / edge / adjacency / degree APIs.
 * Distinct from #141 contiguous floods and wave 22 graph-ui templates.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  getNeighbors,
  getEdge,
  areAdjacent,
  getNodeDegree,
  type Graph,
  type GraphNode,
  type NodeId,
} from '../../src/core/graph';

function node(id: NodeId, x = 0, y = 0): GraphNode {
  return { id, position: { x, y } };
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

describe('Wave 27 graph-neighbors — undirected getNeighbors', () => {
  it('lists both ends of an undirected edge', () => {
    const g = undirected(
      ['a', 'b', 'c'],
      [
        ['a', 'b'],
        ['b', 'c'],
      ]
    );
    expect(getNeighbors(g, 'a').sort()).toEqual(['b']);
    expect(getNeighbors(g, 'b').sort()).toEqual(['a', 'c']);
    expect(getNeighbors(g, 'c').sort()).toEqual(['b']);
  });

  it('dedupes parallel edges between the same pair', () => {
    const g = undirected(
      ['a', 'b'],
      [
        ['a', 'b'],
        ['a', 'b'],
        ['b', 'a'],
      ]
    );
    expect(getNeighbors(g, 'a')).toEqual(['b']);
    expect(getNeighbors(g, 'b')).toEqual(['a']);
  });

  it('returns empty for isolated and unknown nodes', () => {
    const g = undirected(['a', 'b', 'z'], [['a', 'b']]);
    expect(getNeighbors(g, 'z')).toEqual([]);
    expect(getNeighbors(g, 'missing')).toEqual([]);
  });

  it('handles a self-loop as a single neighbor entry (self)', () => {
    const g = undirected(['a'], [['a', 'a']]);
    expect(getNeighbors(g, 'a')).toEqual(['a']);
  });

  it('supports star hubs with many leaves', () => {
    const leaves = ['n0', 'n1', 'n2', 'n3', 'n4'];
    const g = undirected(
      ['center', ...leaves],
      leaves.map((leaf) => ['center', leaf] as [NodeId, NodeId])
    );
    expect(getNeighbors(g, 'center').sort()).toEqual(leaves);
    for (const leaf of leaves) {
      expect(getNeighbors(g, leaf)).toEqual(['center']);
    }
  });
});

describe('Wave 27 graph-neighbors — directed getNeighbors', () => {
  it('only follows outgoing edges', () => {
    const g = directed(
      ['a', 'b', 'c'],
      [
        ['a', 'b'],
        ['b', 'c'],
        ['c', 'a'],
      ]
    );
    expect(getNeighbors(g, 'a')).toEqual(['b']);
    expect(getNeighbors(g, 'b')).toEqual(['c']);
    expect(getNeighbors(g, 'c')).toEqual(['a']);
  });

  it('does not reverse an inbound-only edge', () => {
    const g = directed(['a', 'b'], [['a', 'b']]);
    expect(getNeighbors(g, 'a')).toEqual(['b']);
    expect(getNeighbors(g, 'b')).toEqual([]);
  });

  it('allows multiple distinct out-neighbors', () => {
    const g = directed(
      ['s', 'a', 'b', 'c'],
      [
        ['s', 'a'],
        ['s', 'b'],
        ['s', 'c'],
      ]
    );
    expect(getNeighbors(g, 's').sort()).toEqual(['a', 'b', 'c']);
  });
});

describe('Wave 27 graph-neighbors — getEdge / areAdjacent', () => {
  it('finds undirected edges from either orientation', () => {
    const g = undirected(['a', 'b'], [['a', 'b', 3]]);
    const ab = getEdge(g, 'a', 'b');
    const ba = getEdge(g, 'b', 'a');
    expect(ab).toEqual({ from: 'a', to: 'b', weight: 3 });
    expect(ba).toEqual(ab);
    expect(areAdjacent(g, 'a', 'b')).toBe(true);
    expect(areAdjacent(g, 'b', 'a')).toBe(true);
  });

  it('requires exact direction on directed graphs', () => {
    const g = directed(['a', 'b'], [['a', 'b', 2]]);
    expect(getEdge(g, 'a', 'b')?.weight).toBe(2);
    expect(getEdge(g, 'b', 'a')).toBeUndefined();
    expect(areAdjacent(g, 'a', 'b')).toBe(true);
    expect(areAdjacent(g, 'b', 'a')).toBe(false);
  });

  it('returns undefined for missing pairs', () => {
    const g = undirected(['a', 'b', 'c'], [['a', 'b']]);
    expect(getEdge(g, 'a', 'c')).toBeUndefined();
    expect(areAdjacent(g, 'a', 'c')).toBe(false);
    expect(areAdjacent(g, 'a', 'missing')).toBe(false);
  });

  it('preserves first matching edge when duplicates exist', () => {
    const g = undirected(
      ['a', 'b'],
      [
        ['a', 'b', 1],
        ['a', 'b', 9],
      ]
    );
    expect(getEdge(g, 'a', 'b')?.weight).toBe(1);
  });
});

describe('Wave 27 graph-neighbors — getNodeDegree', () => {
  it('matches neighbor count on undirected graphs', () => {
    const g = undirected(
      ['a', 'b', 'c', 'd'],
      [
        ['a', 'b'],
        ['a', 'c'],
        ['a', 'd'],
        ['b', 'c'],
      ]
    );
    expect(getNodeDegree(g, 'a')).toBe(3);
    expect(getNodeDegree(g, 'b')).toBe(2);
    expect(getNodeDegree(g, 'c')).toBe(2);
    expect(getNodeDegree(g, 'd')).toBe(1);
  });

  it('counts out-degree only on directed graphs', () => {
    const g = directed(
      ['a', 'b', 'c'],
      [
        ['a', 'b'],
        ['a', 'c'],
        ['b', 'a'],
      ]
    );
    expect(getNodeDegree(g, 'a')).toBe(2);
    expect(getNodeDegree(g, 'b')).toBe(1);
    expect(getNodeDegree(g, 'c')).toBe(0);
  });

  it('is zero for isolates and unknown ids', () => {
    const g = undirected(['solo', 'a', 'b'], [['a', 'b']]);
    expect(getNodeDegree(g, 'solo')).toBe(0);
    expect(getNodeDegree(g, 'ghost')).toBe(0);
  });

  it('degree matrix on a path graph', () => {
    const g = undirected(
      ['0', '1', '2', '3', '4'],
      [
        ['0', '1'],
        ['1', '2'],
        ['2', '3'],
        ['3', '4'],
      ]
    );
    expect(getNodeDegree(g, '0')).toBe(1);
    expect(getNodeDegree(g, '1')).toBe(2);
    expect(getNodeDegree(g, '2')).toBe(2);
    expect(getNodeDegree(g, '3')).toBe(2);
    expect(getNodeDegree(g, '4')).toBe(1);
  });

  it('complete K4 every node has degree 3', () => {
    const ids = ['a', 'b', 'c', 'd'];
    const edges: Array<[NodeId, NodeId]> = [];
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        edges.push([ids[i], ids[j]]);
      }
    }
    const g = undirected(ids, edges);
    for (const id of ids) {
      expect(getNodeDegree(g, id)).toBe(3);
    }
  });
});
