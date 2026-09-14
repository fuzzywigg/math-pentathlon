/**
 * Overnight HEAVY leftover after #280 — findNodesAtDistance beyond diameter.
 * Distinct from wave58 dijkstra-disconnected leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createTrackGraph,
  findNodesAtDistance,
} from '../../src/core/graph';

describe('Wave 59 core graph — nodes at distance far', () => {
  it('distance beyond track diameter yields empty', () => {
    expect(findNodesAtDistance(createTrackGraph(3), 't0', 10)).toEqual([]);
  });
});
