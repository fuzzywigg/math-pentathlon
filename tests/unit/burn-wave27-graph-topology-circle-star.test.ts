/**
 * Wave 27 — topology factories: circular / star / complete graphs.
 * Distinct from wave 22 graph-ui templates; pure structure + algorithm checks.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  createCircularGraph,
  createStarGraph,
  createCompleteGraph,
  getNeighbors,
  getNodeDegree,
  isConnected,
  bfs,
  dijkstra,
  findAllPaths,
  findComponents,
} from '../../src/core/graph';

describe('Wave 27 graph-topology — createCircularGraph', () => {
  it('n nodes labeled 1..n with ids n0..', () => {
    const g = createCircularGraph(5, 100);
    expect(g.nodes.size).toBe(5);
    expect(g.nodes.get('n0')?.label).toBe('1');
    expect(g.nodes.get('n4')?.label).toBe('5');
    expect(g.directed).toBe(false);
  });

  it('n>2 forms a closed ring (n edges)', () => {
    const g = createCircularGraph(6);
    expect(g.edges).toHaveLength(6);
    expect(getNeighbors(g, 'n0').sort()).toEqual(['n1', 'n5']);
    expect(getNeighbors(g, 'n3').sort()).toEqual(['n2', 'n4']);
  });

  it('n=1 is an isolate; n=2 is a single undirected edge (no close)', () => {
    const one = createCircularGraph(1);
    expect(one.nodes.size).toBe(1);
    expect(one.edges).toEqual([]);

    const two = createCircularGraph(2);
    expect(two.edges).toEqual([{ from: 'n0', to: 'n1' }]);
    expect(getNodeDegree(two, 'n0')).toBe(1);
  });

  it('every node on a ring has degree 2', () => {
    const g = createCircularGraph(8);
    for (const id of g.nodes.keys()) {
      expect(getNodeDegree(g, id)).toBe(2);
    }
  });

  it('BFS diametral distance on even ring is n/2', () => {
    const g = createCircularGraph(8);
    expect(bfs(g, 'n0', 'n4').distance).toBe(4);
  });

  it('places n0 at the top of the circle (angle -π/2)', () => {
    const g = createCircularGraph(4, 10);
    const p = g.nodes.get('n0')!.position;
    expect(p.x).toBeCloseTo(0, 5);
    expect(p.y).toBeCloseTo(-10, 5);
  });

  it('is connected for n>=1', () => {
    expect(isConnected(createCircularGraph(1))).toBe(true);
    expect(isConnected(createCircularGraph(3))).toBe(true);
    expect(isConnected(createCircularGraph(12))).toBe(true);
  });
});

describe('Wave 27 graph-topology — createStarGraph', () => {
  it('center + n leaves', () => {
    const g = createStarGraph(5, 80);
    expect(g.nodes.size).toBe(6);
    expect(g.nodes.has('center')).toBe(true);
    expect(g.edges).toHaveLength(5);
  });

  it('center degree n; each leaf degree 1', () => {
    const g = createStarGraph(7);
    expect(getNodeDegree(g, 'center')).toBe(7);
    for (let i = 0; i < 7; i++) {
      expect(getNodeDegree(g, `n${i}`)).toBe(1);
      expect(getNeighbors(g, `n${i}`)).toEqual(['center']);
    }
  });

  it('n=0 is center-only', () => {
    const g = createStarGraph(0);
    expect([...g.nodes.keys()]).toEqual(['center']);
    expect(g.edges).toEqual([]);
  });

  it('leaf-to-leaf BFS goes through center (distance 2)', () => {
    const g = createStarGraph(4);
    expect(bfs(g, 'n0', 'n2')).toEqual({
      found: true,
      path: ['n0', 'center', 'n2'],
      distance: 2,
    });
  });

  it('center label is C; leaves labeled 1..n', () => {
    const g = createStarGraph(3);
    expect(g.nodes.get('center')?.label).toBe('C');
    expect(g.nodes.get('n0')?.label).toBe('1');
    expect(g.nodes.get('n2')?.label).toBe('3');
  });

  it('is a single connected component', () => {
    expect(findComponents(createStarGraph(10))).toHaveLength(1);
  });
});

describe('Wave 27 graph-topology — createCompleteGraph', () => {
  it('Kn has n nodes', () => {
    expect(createCompleteGraph(1).nodes.size).toBe(1);
    expect(createCompleteGraph(4).nodes.size).toBe(4);
    expect(createCompleteGraph(6).nodes.size).toBe(6);
  });

  it('every pair is adjacent for n>=2', () => {
    const g = createCompleteGraph(5);
    const ids = [...g.nodes.keys()];
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const ni = getNeighbors(g, ids[i]);
        expect(ni).toContain(ids[j]);
      }
    }
  });

  it('each node has degree n-1', () => {
    for (const n of [2, 3, 4, 5, 7]) {
      const g = createCompleteGraph(n);
      for (const id of g.nodes.keys()) {
        expect(getNodeDegree(g, id)).toBe(n - 1);
      }
    }
  });

  it('edge count equals C(n,2)', () => {
    for (const n of [1, 2, 3, 4, 5, 6]) {
      const g = createCompleteGraph(n);
      const expected = (n * (n - 1)) / 2;
      expect(g.edges.length).toBe(expected);
    }
  });

  it('BFS between any distinct pair is distance 1', () => {
    const g = createCompleteGraph(6);
    expect(bfs(g, 'n0', 'n3').distance).toBe(1);
    expect(dijkstra(g, 'n1', 'n5').distance).toBe(1);
  });

  it('findAllPaths lists direct edge plus longer routes under depth', () => {
    const g = createCompleteGraph(4);
    const paths = findAllPaths(g, 'n0', 'n1', 3);
    expect(paths.some((p) => p.nodes.length === 2)).toBe(true);
    expect(paths.length).toBeGreaterThan(1);
  });

  it('remains connected', () => {
    expect(isConnected(createCompleteGraph(8))).toBe(true);
  });
});
