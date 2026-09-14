/**
 * Overnight HEAVY leftover after #274 — findReachable from track leaf.
 * Distinct from wave53 ghost-start singleton. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createTrackGraph, findReachable } from '../../src/core/graph';

describe('Wave 58 core graph — findReachable leaf', () => {
  it('from t2 on track(3) reaches all three nodes', () => {
    const g = createTrackGraph(3);
    expect([...findReachable(g, 't2')].sort()).toEqual(['t0', 't1', 't2']);
  });
});
