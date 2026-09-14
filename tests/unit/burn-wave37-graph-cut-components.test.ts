/**
 * Wave 37 — cutting template edges splits components / reachability.
 * Beyond wave 34 partition smoke. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createTrackGraph,
  createGridGraph,
  createStarGraph,
  createCircularGraph,
  createHexLatticeGraph,
  findComponents,
  isConnected,
  findReachable,
  getNeighbors,
  type Graph,
} from '../../src/core/graph';

function dropEdges(g: Graph, pred: (from: string, to: string) => boolean): Graph {
  return {
    ...g,
    edges: g.edges.filter((e) => !pred(e.from, e.to) && !pred(e.to, e.from)),
  };
}

describe('Wave 37 graph-cut — template edge deletions', () => {
  it('removing one track edge yields two components', () => {
    const g = dropEdges(createTrackGraph(8), (a, b) => a === 't3' && b === 't4');
    expect(isConnected(g)).toBe(false);
    const comps = findComponents(g);
    expect(comps).toHaveLength(2);
    expect(comps.map((c) => c.length).sort()).toEqual([4, 4]);
    expect(findReachable(g, 't0').has('t7')).toBe(false);
  });

  it('removing star center edges isolates leaves', () => {
    let g = createStarGraph(5);
    g = { ...g, edges: [] };
    expect(isConnected(g)).toBe(false);
    expect(findComponents(g)).toHaveLength(6); // center + 5 leaves
    expect(getNeighbors(g, 'center')).toEqual([]);
  });

  it('removing one circular edge leaves a path still connected', () => {
    const g = dropEdges(createCircularGraph(7), (a, b) => a === 'n0' && b === 'n6');
    expect(isConnected(g)).toBe(true);
    expect(findComponents(g)).toHaveLength(1);
    expect(findReachable(g, 'n0').size).toBe(7);
  });

  it('removing two circular edges can disconnect the ring', () => {
    let g = createCircularGraph(8);
    g = dropEdges(g, (a, b) => a === 'n0' && b === 'n1');
    g = dropEdges(g, (a, b) => a === 'n4' && b === 'n5');
    expect(isConnected(g)).toBe(false);
    expect(findComponents(g).length).toBe(2);
  });

  it('grid without a bridge cell edges splits into islands', () => {
    // 2x3 grid; remove edges around middle of top row effectively by deleting 0-1 edges
    const g = dropEdges(createGridGraph(2, 3), (a, b) => {
      return (
        (a === '0-0' && b === '0-1') ||
        (a === '0-1' && b === '0-2') ||
        (a === '0-1' && b === '1-1')
      );
    });
    expect(findReachable(g, '0-1').size).toBe(1);
    expect(isConnected(g)).toBe(false);
  });

  it('hex lattice remains connected after removing a single peripheral edge', () => {
    const base = createHexLatticeGraph(1);
    const edge = base.edges[0];
    const g = dropEdges(base, (a, b) => a === edge.from && b === edge.to);
    expect(isConnected(g)).toBe(true);
    expect(findComponents(g)).toHaveLength(1);
  });
});
