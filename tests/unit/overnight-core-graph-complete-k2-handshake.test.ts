/**
 * Overnight TOKENMAXX — createCompleteGraph K2 edge count vs circular base.
 * Tests-only. After #214/#215.
 */
import { describe, it, expect } from 'vitest';
import {
  createCompleteGraph,
  createCircularGraph,
} from '../../src/core/graph/types';
import {
  getNodeDegree,
  isConnected,
  findAllPaths,
} from '../../src/core/graph/algorithms';

describe('Overnight core graph — complete K2/K4', () => {
  it('K2 matches circular(2): single edge, degrees 1', () => {
    const k2 = createCompleteGraph(2);
    const circ = createCircularGraph(2);
    expect(k2.edges).toHaveLength(circ.edges.length);
    expect(getNodeDegree(k2, 'n0')).toBe(1);
    expect(getNodeDegree(k2, 'n1')).toBe(1);
    expect(isConnected(k2)).toBe(true);
  });

  it('K4 every degree is 3; multiple simple paths n0→n2', () => {
    const k4 = createCompleteGraph(4);
    for (const id of k4.nodes.keys()) {
      expect(getNodeDegree(k4, id)).toBe(3);
    }
    const paths = findAllPaths(k4, 'n0', 'n2', 4);
    expect(paths.length).toBeGreaterThan(1);
    expect(paths.some((p) => p.nodes.length === 2)).toBe(true);
  });
});
