/**
 * Wave 37 — graph template geometry/spacing invariants.
 * Beyond wave 27 topology counts and wave 34 algo handshake. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createGridGraph,
  createCircularGraph,
  createStarGraph,
  createTrackGraph,
  createHexLatticeGraph,
  createCompleteGraph,
} from '../../src/core/graph';

function dist(
  a: { x: number; y: number },
  b: { x: number; y: number }
): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

describe('Wave 37 graph-geometry — grid spacing', () => {
  it('default spacing 60 places nodes on a rectangular lattice', () => {
    const g = createGridGraph(3, 4);
    expect(g.nodes.get('0-0')!.position).toEqual({ x: 0, y: 0 });
    expect(g.nodes.get('0-3')!.position).toEqual({ x: 180, y: 0 });
    expect(g.nodes.get('2-0')!.position).toEqual({ x: 0, y: 120 });
    expect(g.nodes.get('2-3')!.position).toEqual({ x: 180, y: 120 });
  });

  it('custom spacing scales both axes', () => {
    const g = createGridGraph(2, 2, 25);
    expect(g.nodes.get('1-1')!.position).toEqual({ x: 25, y: 25 });
  });

  it('horizontal neighbors share y; vertical neighbors share x', () => {
    const g = createGridGraph(4, 4, 10);
    for (const e of g.edges) {
      const a = g.nodes.get(e.from)!.position!;
      const b = g.nodes.get(e.to)!.position!;
      const sameRow = a.y === b.y && Math.abs(a.x - b.x) === 10;
      const sameCol = a.x === b.x && Math.abs(a.y - b.y) === 10;
      expect(sameRow || sameCol).toBe(true);
    }
  });
});

describe('Wave 37 graph-geometry — circular / complete radius', () => {
  it('all circular nodes sit on the requested radius from origin', () => {
    for (const radius of [50, 150, 200]) {
      const g = createCircularGraph(8, radius);
      for (const node of g.nodes.values()) {
        expect(dist(node.position!, { x: 0, y: 0 })).toBeCloseTo(radius, 5);
      }
    }
  });

  it('complete graph reuses circular layout positions', () => {
    const circ = createCircularGraph(5, 90);
    const comp = createCompleteGraph(5, 90);
    for (const id of circ.nodes.keys()) {
      expect(comp.nodes.get(id)!.position).toEqual(circ.nodes.get(id)!.position);
    }
  });

  it('adjacent circular chord length is constant for regular n-gon', () => {
    const g = createCircularGraph(6, 100);
    const chords: number[] = [];
    for (let i = 0; i < 6; i++) {
      const a = g.nodes.get(`n${i}`)!.position!;
      const b = g.nodes.get(`n${(i + 1) % 6}`)!.position!;
      chords.push(dist(a, b));
    }
    for (const c of chords) expect(c).toBeCloseTo(chords[0], 5);
  });
});

describe('Wave 37 graph-geometry — star / track / hex', () => {
  it('star center is origin; leaves lie on radius', () => {
    const g = createStarGraph(5, 120);
    expect(g.nodes.get('center')!.position).toEqual({ x: 0, y: 0 });
    for (let i = 0; i < 5; i++) {
      expect(dist(g.nodes.get(`n${i}`)!.position!, { x: 0, y: 0 })).toBeCloseTo(
        120,
        5
      );
    }
  });

  it('track nodes are colinear on y=0 with equal spacing', () => {
    const g = createTrackGraph(7, 40);
    for (let i = 0; i < 7; i++) {
      expect(g.nodes.get(`t${i}`)!.position).toEqual({ x: i * 40, y: 0 });
    }
  });

  it('hex lattice center is at origin; ring-1 nodes share equal radius', () => {
    const g = createHexLatticeGraph(1, 40);
    expect(g.nodes.get('0,0')!.position).toEqual({ x: 0, y: 0 });
    const radii = [...g.nodes.entries()]
      .filter(([id]) => id !== '0,0')
      .map(([, n]) => dist(n.position!, { x: 0, y: 0 }));
    for (const r of radii) expect(r).toBeCloseTo(radii[0], 5);
    expect(radii[0]).toBeGreaterThan(0);
  });

  it('hex ring count formula holds for rings 0..3', () => {
    for (const rings of [0, 1, 2, 3]) {
      expect(createHexLatticeGraph(rings).nodes.size).toBe(
        3 * rings * (rings + 1) + 1
      );
    }
  });
});
