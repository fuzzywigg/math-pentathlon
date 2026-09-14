/**
 * Overnight HEAVY leftover after #264 — createStarGraph(0) is center-only.
 * Distinct from wave56 star(4/6). Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createStarGraph, getNeighbors } from '../../src/core/graph';

describe('Wave 57 core graph — star zero outer', () => {
  it('zero outer leaves only center with no edges', () => {
    const g = createStarGraph(0);
    expect([...g.nodes.keys()]).toEqual(['center']);
    expect(g.edges).toEqual([]);
    expect(getNeighbors(g, 'center')).toEqual([]);
  });
});
