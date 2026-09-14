/**
 * Overnight HEAVY leftover after #264 — areAdjacent works both ways undirected.
 * Distinct from wave56 directed neighbors one-way. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { areAdjacent, type Graph } from '../../src/core/graph';

describe('Wave 57 core graph — areAdjacent undirected', () => {
  it('undirected edge is adjacent in both directions', () => {
    const g: Graph = {
      nodes: new Map([
        ['x', { id: 'x', position: { x: 0, y: 0 } }],
        ['y', { id: 'y', position: { x: 1, y: 0 } }],
      ]),
      edges: [{ from: 'x', to: 'y' }],
      directed: false,
    };
    expect(areAdjacent(g, 'x', 'y')).toBe(true);
    expect(areAdjacent(g, 'y', 'x')).toBe(true);
    expect(areAdjacent(g, 'x', 'x')).toBe(false);
  });
});
