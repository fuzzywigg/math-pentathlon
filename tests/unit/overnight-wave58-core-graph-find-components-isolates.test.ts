/**
 * Overnight HEAVY leftover after #274 — findComponents on two isolated nodes.
 * Distinct from wave55 empty isolates isConnected. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { findComponents } from '../../src/core/graph';
import type { Graph } from '../../src/core/graph';

describe('Wave 58 core graph — findComponents isolates', () => {
  it('two nodes with no edges → two singleton components', () => {
    const g: Graph = {
      nodes: new Map([
        ['x', { id: 'x', position: { x: 0, y: 0 } }],
        ['y', { id: 'y', position: { x: 1, y: 0 } }],
      ]),
      edges: [],
      directed: false,
    };
    const comps = findComponents(g);
    expect(comps).toHaveLength(2);
    expect(comps.map((c) => c.sort().join(',')).sort()).toEqual(['x', 'y']);
  });
});
