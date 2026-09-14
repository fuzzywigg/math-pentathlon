/**
 * Overnight HEAVY leftover after #264 — findNodesWithinDistance includes start.
 * Distinct from wave56 findNodesAtDistance(…,0) only. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createTrackGraph, findNodesWithinDistance } from '../../src/core/graph';

describe('Wave 57 core graph — within distance', () => {
  it('maxDistance 2 on track includes start and two hops', () => {
    const g = createTrackGraph(5);
    const ids = findNodesWithinDistance(g, 't0', 2).sort();
    expect(ids).toEqual(['t0', 't1', 't2']);
  });
});
