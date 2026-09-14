/**
 * Wave 27 — topology factories: grid + track graphs.
 * Distinct from wave 22 graph-ui template smoke and #141 contiguous grids.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  createGridGraph,
  createTrackGraph,
  getNeighbors,
  getNodeDegree,
  isConnected,
  bfs,
  findComponents,
} from '../../src/core/graph';

describe('Wave 27 graph-topology — createGridGraph shape', () => {
  it('rows×cols nodes with row-col ids and labels', () => {
    const g = createGridGraph(2, 3, 10);
    expect(g.nodes.size).toBe(6);
    expect(g.directed).toBe(false);
    expect(g.nodes.get('0-0')).toEqual({
      id: '0-0',
      label: '0,0',
      position: { x: 0, y: 0 },
    });
    expect(g.nodes.get('1-2')?.position).toEqual({ x: 20, y: 10 });
  });

  it('uses default spacing of 60', () => {
    const g = createGridGraph(2, 2);
    expect(g.nodes.get('0-1')?.position).toEqual({ x: 60, y: 0 });
    expect(g.nodes.get('1-0')?.position).toEqual({ x: 0, y: 60 });
  });

  it('1×1 is a lone node with no edges', () => {
    const g = createGridGraph(1, 1);
    expect([...g.nodes.keys()]).toEqual(['0-0']);
    expect(g.edges).toEqual([]);
    expect(getNodeDegree(g, '0-0')).toBe(0);
  });

  it('edge count is horizontal + vertical adjacencies', () => {
    // 3x4: horiz = 3*3=9, vert = 2*4=8 → 17
    const g = createGridGraph(3, 4);
    expect(g.edges).toHaveLength(17);
  });

  it('interior cell has degree 4; corners degree 2; edge degree 3', () => {
    const g = createGridGraph(3, 3);
    expect(getNodeDegree(g, '1-1')).toBe(4);
    expect(getNodeDegree(g, '0-0')).toBe(2);
    expect(getNodeDegree(g, '0-1')).toBe(3);
    expect(getNodeDegree(g, '1-0')).toBe(3);
  });

  it('neighbors of center are cardinals only (no diagonals)', () => {
    const g = createGridGraph(3, 3);
    expect(getNeighbors(g, '1-1').sort()).toEqual(['0-1', '1-0', '1-2', '2-1']);
  });

  it('is a single connected component', () => {
    const g = createGridGraph(5, 5);
    expect(isConnected(g)).toBe(true);
    expect(findComponents(g)).toHaveLength(1);
  });

  it('BFS corner distance is manhattan', () => {
    const g = createGridGraph(4, 5);
    expect(bfs(g, '0-0', '3-4').distance).toBe(7);
  });
});

describe('Wave 27 graph-topology — createGridGraph sizing matrix', () => {
  it.each([
    [1, 5, 5, 4],
    [5, 1, 5, 4],
    [2, 2, 4, 4],
    [3, 3, 9, 12],
    [4, 2, 8, 10],
  ] as const)(
    '%ix%i → %i nodes / %i edges',
    (rows, cols, nodeCount, edgeCount) => {
      const g = createGridGraph(rows, cols);
      expect(g.nodes.size).toBe(nodeCount);
      expect(g.edges.length).toBe(edgeCount);
    }
  );

  it('custom spacing scales positions linearly', () => {
    const g = createGridGraph(2, 2, 100);
    expect(g.nodes.get('1-1')?.position).toEqual({ x: 100, y: 100 });
  });
});

describe('Wave 27 graph-topology — createTrackGraph', () => {
  it('length n yields n nodes and n-1 edges', () => {
    const g = createTrackGraph(7, 25);
    expect(g.nodes.size).toBe(7);
    expect(g.edges).toHaveLength(6);
    expect(g.directed).toBe(false);
  });

  it('ids are t0..t{n-1} with sequential labels', () => {
    const g = createTrackGraph(4);
    expect([...g.nodes.keys()]).toEqual(['t0', 't1', 't2', 't3']);
    expect(g.nodes.get('t2')?.label).toBe('2');
  });

  it('positions lie on the x-axis with spacing', () => {
    const g = createTrackGraph(3, 50);
    expect(g.nodes.get('t0')?.position).toEqual({ x: 0, y: 0 });
    expect(g.nodes.get('t1')?.position).toEqual({ x: 50, y: 0 });
    expect(g.nodes.get('t2')?.position).toEqual({ x: 100, y: 0 });
  });

  it('length 1 has no edges; length 2 is a single link', () => {
    expect(createTrackGraph(1).edges).toEqual([]);
    const two = createTrackGraph(2);
    expect(two.edges).toEqual([{ from: 't0', to: 't1' }]);
  });

  it('endpoints degree 1; interior degree 2', () => {
    const g = createTrackGraph(5);
    expect(getNodeDegree(g, 't0')).toBe(1);
    expect(getNodeDegree(g, 't4')).toBe(1);
    expect(getNodeDegree(g, 't2')).toBe(2);
  });

  it('BFS end-to-end distance is length-1', () => {
    const g = createTrackGraph(10);
    expect(bfs(g, 't0', 't9').distance).toBe(9);
    expect(bfs(g, 't0', 't9').path).toEqual(
      Array.from({ length: 10 }, (_, i) => `t${i}`)
    );
  });

  it('is always a single path component', () => {
    for (const n of [1, 2, 3, 8]) {
      const g = createTrackGraph(n);
      expect(isConnected(g)).toBe(true);
      expect(findComponents(g)).toHaveLength(1);
    }
  });

  it('default spacing is 50', () => {
    const g = createTrackGraph(2);
    expect(g.nodes.get('t1')?.position.x).toBe(50);
  });
});
