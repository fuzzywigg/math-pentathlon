/**
 * Overnight HEAVY leftover after #264 — getNodeDegree missing node → 0.
 * Distinct from wave52 degree missing may differ; wave56 star degree center. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createTrackGraph, getNodeDegree } from '../../src/core/graph';

describe('Wave 57 core graph — degree missing', () => {
  it('unknown node id returns degree 0', () => {
    const g = createTrackGraph(3);
    expect(getNodeDegree(g, 'missing')).toBe(0);
    expect(getNodeDegree(g, 't1')).toBe(2);
  });
});
