/**
 * Wave 27 — topology factory: hexagonal lattice + cross-template stress.
 * Distinct from #141 contiguous hex neighbors and wave 21 hex-region edges.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  createHexLatticeGraph,
  createGridGraph,
  createCircularGraph,
  createStarGraph,
  createTrackGraph,
  createCompleteGraph,
  getNeighbors,
  getNodeDegree,
  isConnected,
  bfs,
  dijkstra,
  findComponents,
  findReachable,
  findNodesAtDistance,
} from '../../src/core/graph';

/** Closed-form hex count for rings r: 3r(r+1)+1 */
function hexCount(rings: number): number {
  return 3 * rings * (rings + 1) + 1;
}

describe('Wave 27 graph-topology — createHexLatticeGraph shape', () => {
  it('rings=0 is a single center cell', () => {
    const g = createHexLatticeGraph(0);
    expect(g.nodes.size).toBe(1);
    expect(g.nodes.has('0,0')).toBe(true);
    expect(g.edges).toEqual([]);
    expect(g.directed).toBe(false);
  });

  it('rings=1 has 7 cells', () => {
    const g = createHexLatticeGraph(1);
    expect(g.nodes.size).toBe(hexCount(1));
    expect(g.nodes.size).toBe(7);
  });

  it('rings=2 has 19 cells; rings=3 has 37', () => {
    expect(createHexLatticeGraph(2).nodes.size).toBe(19);
    expect(createHexLatticeGraph(3).nodes.size).toBe(37);
  });

  it('center has up to 6 neighbors for rings>=1', () => {
    const g = createHexLatticeGraph(2);
    expect(getNeighbors(g, '0,0').sort()).toEqual(
      ['-1,0', '-1,1', '0,-1', '0,1', '1,-1', '1,0'].sort()
    );
    expect(getNodeDegree(g, '0,0')).toBe(6);
  });

  it('does not duplicate undirected edges (id < neighborId guard)', () => {
    const g = createHexLatticeGraph(2);
    const keys = g.edges.map((e) =>
      e.from < e.to ? `${e.from}|${e.to}` : `${e.to}|${e.from}`
    );
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('is a single connected component', () => {
    for (const r of [0, 1, 2, 3]) {
      const g = createHexLatticeGraph(r);
      expect(isConnected(g)).toBe(true);
      expect(findComponents(g)).toHaveLength(1);
      expect(findReachable(g, '0,0').size).toBe(g.nodes.size);
    }
  });

  it('edge cells have fewer than 6 neighbors', () => {
    const g = createHexLatticeGraph(2);
    const degrees = [...g.nodes.keys()].map((id) => getNodeDegree(g, id));
    expect(Math.max(...degrees)).toBe(6);
    expect(Math.min(...degrees)).toBeLessThan(6);
  });

  it('custom size scales pixel positions', () => {
    const a = createHexLatticeGraph(1, 40);
    const b = createHexLatticeGraph(1, 80);
    const pa = a.nodes.get('1,0')!.position;
    const pb = b.nodes.get('1,0')!.position;
    expect(pb.x).toBeCloseTo(pa.x * 2, 5);
    expect(pb.y).toBeCloseTo(pa.y * 2, 5);
  });
});

describe('Wave 27 graph-topology — hex lattice path metrics', () => {
  it('adjacent axial neighbors are BFS distance 1', () => {
    const g = createHexLatticeGraph(2);
    expect(bfs(g, '0,0', '1,0').distance).toBe(1);
    expect(bfs(g, '0,0', '0,1').distance).toBe(1);
    expect(bfs(g, '0,0', '-1,1').distance).toBe(1);
  });

  it('opposite cells in rings=1 are distance 2 via center', () => {
    const g = createHexLatticeGraph(1);
    expect(bfs(g, '1,0', '-1,0').distance).toBe(2);
  });

  it('dijkstra matches bfs on unit weights', () => {
    const g = createHexLatticeGraph(2);
    const pairs = [
      ['0,0', '2,-1'],
      ['1,0', '-1,1'],
      ['0,0', '0,0'],
    ] as const;
    for (const [from, to] of pairs) {
      expect(dijkstra(g, from, to).distance).toBe(bfs(g, from, to).distance);
    }
  });

  it('distance-1 ring from center has 6 cells', () => {
    const g = createHexLatticeGraph(2);
    expect(findNodesAtDistance(g, '0,0', 1)).toHaveLength(6);
  });
});

describe('Wave 27 graph-topology — cross-template stress matrix', () => {
  it('all factories produce undirected graphs', () => {
    const graphs = [
      createGridGraph(3, 3),
      createTrackGraph(5),
      createCircularGraph(6),
      createStarGraph(4),
      createCompleteGraph(5),
      createHexLatticeGraph(2),
    ];
    for (const g of graphs) {
      expect(g.directed).toBe(false);
      expect(isConnected(g)).toBe(true);
    }
  });

  it('node ids are unique strings with matching map keys', () => {
    const g = createHexLatticeGraph(2);
    for (const [id, n] of g.nodes) {
      expect(n.id).toBe(id);
    }
  });

  it('every edge endpoint exists as a node', () => {
    const graphs = [
      createGridGraph(4, 4),
      createCircularGraph(9),
      createStarGraph(8),
      createCompleteGraph(6),
      createHexLatticeGraph(3),
      createTrackGraph(12),
    ];
    for (const g of graphs) {
      for (const e of g.edges) {
        expect(g.nodes.has(e.from)).toBe(true);
        expect(g.nodes.has(e.to)).toBe(true);
      }
    }
  });

  it('sum of degrees equals 2|E| (handshaking)', () => {
    const graphs = [
      createGridGraph(3, 5),
      createTrackGraph(9),
      createCircularGraph(7),
      createStarGraph(6),
      createCompleteGraph(5),
      createHexLatticeGraph(2),
    ];
    for (const g of graphs) {
      let degreeSum = 0;
      for (const id of g.nodes.keys()) {
        degreeSum += getNodeDegree(g, id);
      }
      expect(degreeSum).toBe(2 * g.edges.length);
    }
  });

  it('BFS self-distance is 0 across templates', () => {
    const samples = [
      [createGridGraph(2, 2), '0-0'],
      [createTrackGraph(3), 't1'],
      [createCircularGraph(4), 'n2'],
      [createStarGraph(3), 'center'],
      [createCompleteGraph(3), 'n0'],
      [createHexLatticeGraph(1), '0,0'],
    ] as const;
    for (const [g, id] of samples) {
      expect(bfs(g, id, id).distance).toBe(0);
    }
  });
});
