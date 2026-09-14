/**
 * Wave 37 — dijkstra weight overlays on template graphs.
 * Distinct from wave 34 unit-weight agree cases. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createTrackGraph,
  createGridGraph,
  createStarGraph,
  createCircularGraph,
  bfs,
  dijkstra,
  type Graph,
} from '../../src/core/graph';

function withWeights(g: Graph, weightFn: (from: string, to: string) => number): Graph {
  return {
    ...g,
    edges: g.edges.map((e) => ({
      ...e,
      weight: weightFn(e.from, e.to),
    })),
  };
}

describe('Wave 37 graph-weighted — track / grid / star / circle', () => {
  it('uniform weights make dijkstra distance match bfs hops × w', () => {
    const g = withWeights(createTrackGraph(6), () => 3);
    const d = dijkstra(g, 't0', 't5');
    expect(d.found).toBe(true);
    expect(d.distance).toBe(15);
    expect(bfs(g, 't0', 't5').distance).toBe(5);
  });

  it('escalating track weights prefer earlier hops still only one path', () => {
    const g = withWeights(createTrackGraph(5), (from) => {
      const i = Number(from.slice(1));
      return i + 1;
    });
    // edges t0-t1:1, t1-t2:2, t2-t3:3, t3-t4:4 → sum 10
    expect(dijkstra(g, 't0', 't4').distance).toBe(10);
  });

  it('grid with expensive middle vertical prefers detour when cheaper', () => {
    const base = createGridGraph(3, 3);
    const g = withWeights(base, (from, to) => {
      const pair = [from, to].sort().join('|');
      if (pair === '0-1|1-1' || pair === '1-1|2-1') return 100;
      return 1;
    });
    const d = dijkstra(g, '0-1', '2-1');
    expect(d.found).toBe(true);
    expect(d.distance).toBeLessThan(100);
    expect(d.path).not.toContain('1-1');
  });

  it('star leaf-to-leaf is always 2 hops; weights sum center edges', () => {
    const g = withWeights(createStarGraph(4), (from, to) => {
      if (from === 'center' || to === 'center') {
        const leaf = from === 'center' ? to : from;
        return Number(leaf.slice(1)) + 1;
      }
      return 1;
    });
    const d = dijkstra(g, 'n0', 'n3');
    expect(d.found).toBe(true);
    expect(d.path).toEqual(['n0', 'center', 'n3']);
    expect(d.distance).toBe(1 + 4);
  });

  it('circular heavy chord forces the opposite arc', () => {
    // Undirected ring: inflate the three edges on the n0-n5-n4-n3 arc.
    const heavy = new Set(['n0|n5', 'n5|n4', 'n4|n3']);
    const g = withWeights(createCircularGraph(6), (from, to) => {
      const key = [from, to].sort().join('|');
      return heavy.has(key) ? 50 : 1;
    });
    const d = dijkstra(g, 'n0', 'n3');
    expect(d.found).toBe(true);
    expect(d.distance).toBe(3);
    expect(d.path).toEqual(['n0', 'n1', 'n2', 'n3']);
  });

  it('missing destination yields undefined dijkstra distance', () => {
    const g = withWeights(createTrackGraph(3), () => 2);
    expect(dijkstra(g, 't0', 'ghost').distance).toBeUndefined();
  });
});
