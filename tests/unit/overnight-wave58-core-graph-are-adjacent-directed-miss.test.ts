/**
 * Overnight HEAVY leftover after #274 — directed reverse areAdjacent is false.
 * Distinct from wave57 undirected areAdjacent. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { areAdjacent, getEdge } from '../../src/core/graph';
import type { Graph } from '../../src/core/graph';

describe('Wave 58 core graph — directed adjacent miss', () => {
  it('forward edge yes; reverse getEdge/areAdjacent no', () => {
    const g: Graph = {
      nodes: new Map([
        ['a', { id: 'a', position: { x: 0, y: 0 } }],
        ['b', { id: 'b', position: { x: 1, y: 0 } }],
      ]),
      edges: [{ from: 'a', to: 'b' }],
      directed: true,
    };
    expect(areAdjacent(g, 'a', 'b')).toBe(true);
    expect(areAdjacent(g, 'b', 'a')).toBe(false);
    expect(getEdge(g, 'b', 'a')).toBeUndefined();
  });
});
