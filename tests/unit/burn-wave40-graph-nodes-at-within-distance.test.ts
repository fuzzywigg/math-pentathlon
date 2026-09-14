/**
 * Wave 40 — findNodesAtDistance / WithinDistance leftovers after #176.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createTrackGraph,
  findNodesAtDistance,
  findNodesWithinDistance,
} from '../../src/core/graph';

describe('Wave 40 graph — nodes at / within distance', () => {
  const g = createTrackGraph(5, 10); // t0..t4

  it('distance 0 is start only; beyond diameter empty', () => {
    expect(findNodesAtDistance(g, 't0', 0)).toEqual(['t0']);
    expect(findNodesAtDistance(g, 't0', 99)).toEqual([]);
  });

  it('within distance includes start and neighbors', () => {
    expect(findNodesWithinDistance(g, 't0', 1).sort()).toEqual(['t0', 't1']);
    expect(findNodesAtDistance(g, 't0', 2).sort()).toEqual(['t2']);
  });
});
