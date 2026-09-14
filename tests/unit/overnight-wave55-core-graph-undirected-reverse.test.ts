/**
 * Overnight HEAVY leftover after #250 — getEdge reverse hop on undirected graphs.
 * Distinct from overnight-graph-directed-edge-helpers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getEdge, areAdjacent, getNeighbors } from '../../src/core/graph/algorithms';
import { createTrackGraph } from '../../src/core/graph/types';

describe('Wave 55 core graph — undirected reverse edge', () => {
  it('getEdge(t1,t0) finds the stored t0→t1 hop; directed would miss', () => {
    const g = createTrackGraph(3);
    const fwd = getEdge(g, 't0', 't1');
    const rev = getEdge(g, 't1', 't0');
    expect(fwd).toBe(rev);
    expect(areAdjacent(g, 't1', 't0')).toBe(true);
    expect(getNeighbors(g, 't1').sort()).toEqual(['t0', 't2']);

    const directed = { ...g, directed: true };
    expect(getEdge(directed, 't1', 't0')).toBeUndefined();
    expect(areAdjacent(directed, 't1', 't0')).toBe(false);
    expect(getNeighbors(directed, 't1')).toEqual(['t2']);
  });
});
