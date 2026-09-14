/**
 * Overnight HEAVY leftover after #234 — getNodeDegree on missing nodeId is 0.
 * Distinct from burn-wave34-graph-degree-handshake. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getNodeDegree } from '../../src/core/graph/algorithms';
import { createTrackGraph } from '../../src/core/graph/types';

describe('Wave 52 core graph — degree missing node', () => {
  it('unknown id → degree 0; endpoint degree 1', () => {
    const g = createTrackGraph(3);
    expect(getNodeDegree(g, 'ghost')).toBe(0);
    expect(getNodeDegree(g, 't0')).toBe(1);
    expect(getNodeDegree(g, 't1')).toBe(2);
  });
});
