/**
 * Wave 37 — createCompleteGraph Kn dense invariant matrix.
 * Deeper than wave 27/34 smoke edge counts. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createCompleteGraph,
  getNeighbors,
  getNodeDegree,
  areAdjacent,
  bfs,
  findAllPaths,
  isConnected,
} from '../../src/core/graph';

describe('Wave 37 graph-complete — Kn edge/degree formulas', () => {
  it.each([1, 2, 3, 4, 5, 6, 7, 8])(
    'K_%i has n(n-1)/2 undirected edges and degree n-1',
    (n) => {
      const g = createCompleteGraph(n);
      expect(g.nodes.size).toBe(n);
      expect(g.edges.length).toBe((n * (n - 1)) / 2);
      expect(g.directed).toBe(false);
      for (const id of g.nodes.keys()) {
        expect(getNodeDegree(g, id)).toBe(n - 1);
        expect(getNeighbors(g, id)).toHaveLength(n - 1);
      }
    }
  );

  it('every distinct pair is adjacent exactly once (undirected)', () => {
    for (const n of [3, 5, 7]) {
      const g = createCompleteGraph(n);
      const ids = [...g.nodes.keys()];
      let pairCount = 0;
      for (let i = 0; i < ids.length; i++) {
        for (let j = i + 1; j < ids.length; j++) {
          expect(areAdjacent(g, ids[i], ids[j])).toBe(true);
          pairCount++;
        }
      }
      expect(pairCount).toBe(g.edges.length);
    }
  });

  it('diameter is 1 for n>=2; bfs distance always 1', () => {
    for (const n of [2, 4, 6]) {
      const g = createCompleteGraph(n);
      const ids = [...g.nodes.keys()];
      for (let i = 0; i < ids.length; i++) {
        for (let j = i + 1; j < ids.length; j++) {
          const path = bfs(g, ids[i], ids[j]);
          expect(path.found).toBe(true);
          expect(path.distance).toBe(1);
          expect(path.path).toEqual([ids[i], ids[j]]);
        }
      }
    }
  });

  it('findAllPaths depth 2 yields only the direct edge; depth 3 adds length-2 detours', () => {
    const g = createCompleteGraph(4);
    const direct = findAllPaths(g, 'n0', 'n2', 2);
    expect(direct).toHaveLength(1);
    expect(direct[0].nodes).toEqual(['n0', 'n2']);

    const withDetours = findAllPaths(g, 'n0', 'n2', 3);
    expect(withDetours.length).toBeGreaterThan(1);
    expect(withDetours.some((p) => p.nodes.length === 2)).toBe(true);
    expect(withDetours.every((p) => p.nodes[0] === 'n0' && p.nodes.at(-1) === 'n2')).toBe(
      true
    );
  });

  it('remains connected after removing one edge when n>=3', () => {
    const g = createCompleteGraph(5);
    g.edges.pop();
    expect(isConnected(g)).toBe(true);
    expect(g.edges.length).toBe((5 * 4) / 2 - 1);
  });
});
