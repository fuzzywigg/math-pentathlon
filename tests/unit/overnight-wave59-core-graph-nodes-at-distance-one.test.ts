/**
 * Overnight HEAVY leftover after #280 — findNodesAtDistance(d=1) neighbors.
 * Opposite of wave56/57 distance-0 / within-distance leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createTrackGraph,
  findNodesAtDistance,
} from '../../src/core/graph';

describe('Wave 59 core graph — nodes at distance one', () => {
  it('track mid at distance 1 returns both neighbors', () => {
    const graph = createTrackGraph(5);
    expect(findNodesAtDistance(graph, 't2', 1).sort()).toEqual(['t1', 't3']);
  });
});
