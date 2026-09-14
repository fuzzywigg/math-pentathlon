/**
 * Overnight TOKENMAXX — zero-size template factories (empty graphs).
 * Beyond wave27 n=1 circle / n=0 star. Tests-only. After #214/#215.
 */
import { describe, it, expect } from 'vitest';
import {
  createTrackGraph,
  createCircularGraph,
  createGridGraph,
  createCompleteGraph,
  createStarGraph,
  createHexLatticeGraph,
} from '../../src/core/graph/types';
import { isConnected, findComponents } from '../../src/core/graph/algorithms';

describe('Overnight core graph — degenerate templates', () => {
  it('length/n/rows/cols 0 yield empty node maps', () => {
    expect(createTrackGraph(0).nodes.size).toBe(0);
    expect(createTrackGraph(0).edges).toEqual([]);
    expect(createCircularGraph(0).nodes.size).toBe(0);
    expect(createGridGraph(0, 5).nodes.size).toBe(0);
    expect(createGridGraph(4, 0).nodes.size).toBe(0);
    expect(createCompleteGraph(0).nodes.size).toBe(0);
  });

  it('empty templates are connected with zero components', () => {
    for (const g of [
      createTrackGraph(0),
      createCircularGraph(0),
      createGridGraph(0, 0),
      createCompleteGraph(0),
    ]) {
      expect(isConnected(g)).toBe(true);
      expect(findComponents(g)).toEqual([]);
    }
  });

  it('K1 has no edges; star(0) is center-only; hex lattice(0) is one cell', () => {
    expect(createCompleteGraph(1).edges).toEqual([]);
    expect([...createStarGraph(0).nodes.keys()]).toEqual(['center']);
    expect(createHexLatticeGraph(0).nodes.size).toBe(1);
    expect(createHexLatticeGraph(0).nodes.has('0,0')).toBe(true);
  });
});
