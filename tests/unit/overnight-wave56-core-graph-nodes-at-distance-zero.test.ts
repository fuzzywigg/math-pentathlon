/**
 * Overnight HEAVY leftover after #256 — findNodesAtDistance(..., 0) is start.
 * Distinct from overnight far-empty / withinDistance 0. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createTrackGraph, findNodesAtDistance } from '../../src/core/graph';

describe('Wave 56 core graph — nodes at distance zero', () => {
  it('distance 0 returns only the start node', () => {
    const g = createTrackGraph(4);
    expect(findNodesAtDistance(g, 't2', 0)).toEqual(['t2']);
    expect(findNodesAtDistance(g, 't0', 0)).toEqual(['t0']);
  });
});
