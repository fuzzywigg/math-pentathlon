/**
 * Wave 27 — BFS shortest-path matrix / disconnect / directed asymmetry.
 * Distinct from #141 contiguous findPath and thin graph.test smoke.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  bfs,
  createGridGraph,
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

function directed(nodes: NodeId[], edges: Array<[NodeId, NodeId]>): Graph {
  return { ...undirected(nodes, edges), directed: true };
}

describe('Wave 27 graph-bfs — identity and misses', () => {
  it('start === end returns trivial found path', () => {
    const g = undirected(['a', 'b'], [['a', 'b']]);
    expect(bfs(g, 'a', 'a')).toEqual({
      found: true,
      path: ['a'],
      distance: 0,
    });
  });

  it('returns not-found for disconnected pairs', () => {
    const g = undirected(
      ['a', 'b', 'c', 'd'],
      [
        ['a', 'b'],
        ['c', 'd'],
      ]
    );
    expect(bfs(g, 'a', 'c')).toEqual({
      found: false,
      path: [],
      distance: -1,
    });
    expect(bfs(g, 'b', 'd').found).toBe(false);
  });

  it('returns not-found when end is missing from the graph', () => {
    const g = undirected(['a'], []);
    expect(bfs(g, 'a', 'ghost')).toEqual({
      found: false,
      path: [],
      distance: -1,
    });
  });
});

describe('Wave 27 graph-bfs — shortest unweighted paths', () => {
  it('prefers fewer hops on a diamond', () => {
    // a-b-d and a-c-d; both length 2
    const g = undirected(
      ['a', 'b', 'c', 'd'],
      [
        ['a', 'b'],
        ['b', 'd'],
        ['a', 'c'],
        ['c', 'd'],
      ]
    );
    const result = bfs(g, 'a', 'd');
    expect(result.found).toBe(true);
    expect(result.distance).toBe(2);
    expect(result.path[0]).toBe('a');
    expect(result.path.at(-1)).toBe('d');
    expect(result.path).toHaveLength(3);
  });

  it('takes the direct chord when present', () => {
    const g = undirected(
      ['a', 'b', 'c'],
      [
        ['a', 'b'],
        ['b', 'c'],
        ['a', 'c'],
      ]
    );
    const result = bfs(g, 'a', 'c');
    expect(result).toEqual({ found: true, path: ['a', 'c'], distance: 1 });
  });

  it('walks a long path without shortcuts', () => {
    const ids = Array.from({ length: 8 }, (_, i) => String(i));
    const edges: Array<[NodeId, NodeId]> = [];
    for (let i = 0; i < ids.length - 1; i++) {
      edges.push([ids[i], ids[i + 1]]);
    }
    const g = undirected(ids, edges);
    const result = bfs(g, '0', '7');
    expect(result.found).toBe(true);
    expect(result.distance).toBe(7);
    expect(result.path).toEqual(ids);
  });

  it('distance equals hop count (path.length - 1)', () => {
    const g = undirected(
      ['a', 'b', 'c', 'd'],
      [
        ['a', 'b'],
        ['b', 'c'],
        ['c', 'd'],
      ]
    );
    const result = bfs(g, 'a', 'd');
    expect(result.distance).toBe(result.path.length - 1);
  });
});

describe('Wave 27 graph-bfs — directed asymmetry', () => {
  it('follows one-way edges only', () => {
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
  });

  it('cannot traverse against an arrow even with undirected-looking pairs', () => {
    const g = directed(['a', 'b'], [['b', 'a']]);
    expect(bfs(g, 'a', 'b').found).toBe(false);
    expect(bfs(g, 'b', 'a')).toEqual({
      found: true,
      path: ['b', 'a'],
      distance: 1,
    });
  });

  it('cycle digraph reaches every node one way', () => {
    const g = directed(
      ['a', 'b', 'c'],
      [
        ['a', 'b'],
        ['b', 'c'],
        ['c', 'a'],
      ]
    );
    expect(bfs(g, 'a', 'c').path).toEqual(['a', 'b', 'c']);
    expect(bfs(g, 'c', 'b').path).toEqual(['c', 'a', 'b']);
  });
});

describe('Wave 27 graph-bfs — grid matrix', () => {
  it('manhattan distance on an open 4x4 grid', () => {
    const grid = createGridGraph(4, 4);
    const result = bfs(grid, '0-0', '3-3');
    expect(result.found).toBe(true);
    expect(result.distance).toBe(6); // 3 down + 3 right
    expect(result.path[0]).toBe('0-0');
    expect(result.path.at(-1)).toBe('3-3');
  });

  it('adjacent grid cells are distance 1', () => {
    const grid = createGridGraph(3, 3);
    expect(bfs(grid, '1-1', '1-2')).toEqual({
      found: true,
      path: ['1-1', '1-2'],
      distance: 1,
    });
    expect(bfs(grid, '1-1', '0-1').distance).toBe(1);
  });

  it('same cell on grid is distance 0', () => {
    const grid = createGridGraph(2, 2);
    expect(bfs(grid, '1-0', '1-0')).toEqual({
      found: true,
      path: ['1-0'],
      distance: 0,
    });
  });

  it('row-major corner-to-corner matrix of distances', () => {
    const grid = createGridGraph(3, 3);
    const corners: Array<[NodeId, NodeId, number]> = [
      ['0-0', '0-2', 2],
      ['0-0', '2-0', 2],
      ['0-0', '2-2', 4],
      ['0-2', '2-0', 4],
      ['1-1', '0-0', 2],
      ['1-1', '2-2', 2],
    ];
    for (const [from, to, dist] of corners) {
      expect(bfs(grid, from, to).distance).toBe(dist);
    }
  });

  it('blocked corridor forces detour when an edge is removed', () => {
    const grid = createGridGraph(3, 3);
    // Remove middle horizontal on top row: 0-0 — 0-1
    grid.edges = grid.edges.filter(
      (e) =>
        !(
          (e.from === '0-0' && e.to === '0-1') ||
          (e.from === '0-1' && e.to === '0-0')
        )
    );
    const result = bfs(grid, '0-0', '0-1');
    expect(result.found).toBe(true);
    // 0-0 → 1-0 → 1-1 → 0-1 (no direct top-row link)
    expect(result.distance).toBe(3);
    expect(result.path).not.toEqual(['0-0', '0-1']);
    expect(result.path).toContain('1-0');
  });
});

describe('Wave 27 graph-bfs — stress / invariants', () => {
  it('never revisits nodes in the returned path', () => {
    const g = undirected(
      ['a', 'b', 'c', 'd', 'e'],
      [
        ['a', 'b'],
        ['b', 'c'],
        ['c', 'd'],
        ['d', 'e'],
        ['a', 'c'],
        ['b', 'd'],
      ]
    );
    const result = bfs(g, 'a', 'e');
    expect(result.found).toBe(true);
    expect(new Set(result.path).size).toBe(result.path.length);
  });

  it('empty edge list only finds self', () => {
    const g = undirected(['a', 'b'], []);
    expect(bfs(g, 'a', 'a').found).toBe(true);
    expect(bfs(g, 'a', 'b').found).toBe(false);
  });

  it('large grid corner distance stays manhattan', () => {
    const grid = createGridGraph(8, 8);
    expect(bfs(grid, '0-0', '7-7').distance).toBe(14);
    expect(bfs(grid, '2-3', '5-6').distance).toBe(6);
  });
});
