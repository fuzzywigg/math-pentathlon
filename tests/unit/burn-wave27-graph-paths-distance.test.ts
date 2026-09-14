/**
 * Wave 27 — findAllPaths / distance rings / maxDepth truncation.
 * Distinct from contiguous path-edges (#141) and thin graph.test smoke.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  findAllPaths,
  findNodesAtDistance,
  findNodesWithinDistance,
  createGridGraph,
  createTrackGraph,
  createCompleteGraph,
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
    edges: edges.map(([from, to, weight]) => ({ from, to, weight })),
  };
}

function directed(
  nodes: NodeId[],
  edges: Array<[NodeId, NodeId, number?]>
): Graph {
  return { ...undirected(nodes, edges), directed: true };
}

describe('Wave 27 graph-paths — findAllPaths basics', () => {
  it('start === end yields a single zero-weight path', () => {
    const g = undirected(['a', 'b'], [['a', 'b']]);
    expect(findAllPaths(g, 'a', 'a')).toEqual([
      { nodes: ['a'], totalWeight: 0 },
    ]);
  });

  it('enumerates both diamond routes', () => {
    const g = undirected(
      ['a', 'b', 'c', 'd'],
      [
        ['a', 'b'],
        ['b', 'd'],
        ['a', 'c'],
        ['c', 'd'],
      ]
    );
    const paths = findAllPaths(g, 'a', 'd');
    expect(paths).toHaveLength(2);
    const keyed = paths.map((p) => p.nodes.join('-')).sort();
    expect(keyed).toEqual(['a-b-d', 'a-c-d']);
    expect(paths.every((p) => p.totalWeight === 2)).toBe(true);
  });

  it('returns empty when disconnected', () => {
    const g = undirected(['a', 'b'], []);
    expect(findAllPaths(g, 'a', 'b')).toEqual([]);
  });

  it('accumulates explicit edge weights along each path', () => {
    const g = undirected(
      ['a', 'b', 'c'],
      [
        ['a', 'b', 2],
        ['b', 'c', 3],
        ['a', 'c', 9],
      ]
    );
    const paths = findAllPaths(g, 'a', 'c');
    const byKey = new Map(paths.map((p) => [p.nodes.join('-'), p.totalWeight]));
    expect(byKey.get('a-c')).toBe(9);
    expect(byKey.get('a-b-c')).toBe(5);
  });

  it('directed graphs only list outbound routes', () => {
    const g = directed(
      ['a', 'b', 'c'],
      [
        ['a', 'b'],
        ['b', 'c'],
        ['a', 'c'],
      ]
    );
    const paths = findAllPaths(g, 'a', 'c');
    expect(paths.map((p) => p.nodes.join('-')).sort()).toEqual([
      'a-b-c',
      'a-c',
    ]);
    expect(findAllPaths(g, 'c', 'a')).toEqual([]);
  });
});

describe('Wave 27 graph-paths — maxDepth truncation', () => {
  it('default maxDepth 10 still finds a short path', () => {
    const track = createTrackGraph(5);
    const paths = findAllPaths(track, 't0', 't4');
    expect(paths).toHaveLength(1);
    expect(paths[0].nodes).toEqual(['t0', 't1', 't2', 't3', 't4']);
  });

  it('maxDepth smaller than needed yields no paths', () => {
    const track = createTrackGraph(6);
    // path length (nodes) for t0→t5 is 6; maxDepth 4 rejects when path.length > 4
    expect(findAllPaths(track, 't0', 't5', 4)).toEqual([]);
    expect(findAllPaths(track, 't0', 't5', 5)).toEqual([]);
    expect(findAllPaths(track, 't0', 't5', 6)).toHaveLength(1);
  });

  it('maxDepth 1 only allows the trivial self path', () => {
    const g = undirected(['a', 'b'], [['a', 'b']]);
    expect(findAllPaths(g, 'a', 'a', 1)).toEqual([
      { nodes: ['a'], totalWeight: 0 },
    ]);
    // neighbor expansion pushes path length 2 which exceeds maxDepth 1
    expect(findAllPaths(g, 'a', 'b', 1)).toEqual([]);
  });

  it('complete graph enumerates many routes until depth cap', () => {
    const k4 = createCompleteGraph(4);
    const paths = findAllPaths(k4, 'n0', 'n2', 4);
    expect(paths.length).toBeGreaterThanOrEqual(2);
    expect(paths.every((p) => p.nodes.length <= 4)).toBe(true);
    expect(
      paths.every((p) => p.nodes[0] === 'n0' && p.nodes.at(-1) === 'n2')
    ).toBe(true);
  });
});

describe('Wave 27 graph-paths — findNodesAtDistance', () => {
  it('distance 0 is only the start', () => {
    const g = undirected(['a', 'b'], [['a', 'b']]);
    expect(findNodesAtDistance(g, 'a', 0)).toEqual(['a']);
  });

  it('distance 1 lists immediate neighbors', () => {
    const g = undirected(
      ['a', 'b', 'c', 'd'],
      [
        ['a', 'b'],
        ['a', 'c'],
        ['c', 'd'],
      ]
    );
    expect(findNodesAtDistance(g, 'a', 1).sort()).toEqual(['b', 'c']);
  });

  it('distance 2 on a path', () => {
    const track = createTrackGraph(5);
    expect(findNodesAtDistance(track, 't0', 2)).toEqual(['t2']);
    expect(findNodesAtDistance(track, 't2', 2).sort()).toEqual(['t0', 't4']);
  });

  it('grid manhattan ring at distance 2 from center', () => {
    const grid = createGridGraph(5, 5);
    const ring = findNodesAtDistance(grid, '2-2', 2).sort();
    // cells with |dr|+|dc| = 2
    expect(ring).toEqual(
      ['0-2', '1-1', '1-3', '2-0', '2-4', '3-1', '3-3', '4-2'].sort()
    );
  });

  it('beyond diameter returns empty', () => {
    const track = createTrackGraph(3);
    expect(findNodesAtDistance(track, 't0', 10)).toEqual([]);
  });

  it('directed distance ignores reverse arcs', () => {
    const g = directed(
      ['a', 'b', 'c'],
      [
        ['a', 'b'],
        ['b', 'c'],
      ]
    );
    expect(findNodesAtDistance(g, 'a', 2)).toEqual(['c']);
    expect(findNodesAtDistance(g, 'c', 1)).toEqual([]);
  });
});

describe('Wave 27 graph-paths — findNodesWithinDistance', () => {
  it('within 0 is only start', () => {
    const g = undirected(['a', 'b'], [['a', 'b']]);
    expect(findNodesWithinDistance(g, 'a', 0)).toEqual(['a']);
  });

  it('within 1 includes start and neighbors', () => {
    const g = undirected(
      ['a', 'b', 'c'],
      [
        ['a', 'b'],
        ['a', 'c'],
      ]
    );
    expect(findNodesWithinDistance(g, 'a', 1).sort()).toEqual(['a', 'b', 'c']);
  });

  it('within k is union of rings 0..k', () => {
    const track = createTrackGraph(6);
    const within3 = new Set(findNodesWithinDistance(track, 't0', 3));
    for (let d = 0; d <= 3; d++) {
      for (const id of findNodesAtDistance(track, 't0', d)) {
        expect(within3.has(id)).toBe(true);
      }
    }
    expect(within3.has('t4')).toBe(false);
  });

  it('large within covers the whole connected component', () => {
    const grid = createGridGraph(3, 3);
    const all = findNodesWithinDistance(grid, '1-1', 100);
    expect(all).toHaveLength(9);
  });

  it('star: within 1 from center is all nodes; from leaf is leaf+center', () => {
    const star = undirected(
      ['center', 'n0', 'n1', 'n2'],
      [
        ['center', 'n0'],
        ['center', 'n1'],
        ['center', 'n2'],
      ]
    );
    expect(findNodesWithinDistance(star, 'center', 1).sort()).toEqual([
      'center',
      'n0',
      'n1',
      'n2',
    ]);
    expect(findNodesWithinDistance(star, 'n0', 1).sort()).toEqual([
      'center',
      'n0',
    ]);
    expect(findNodesWithinDistance(star, 'n0', 2).sort()).toEqual([
      'center',
      'n0',
      'n1',
      'n2',
    ]);
  });
});
