/**
 * Overnight HEAVY leftover after #234 — findAllPaths mixes undefined weight (→1) + explicit 0.
 * Distinct from overnight-core-graph-zero-weight-findallpaths / missing-weight-defaults. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { findAllPaths } from '../../src/core/graph/algorithms';
import type { Graph } from '../../src/core/graph/types';

describe('Wave 52 core graph — findAllPaths mixed zero/default', () => {
  it('undefined then 0 on two-hop path → totalWeight 1', () => {
    const g: Graph = {
      nodes: new Map([
        ['a', { id: 'a', position: { x: 0, y: 0 } }],
        ['b', { id: 'b', position: { x: 1, y: 0 } }],
        ['c', { id: 'c', position: { x: 2, y: 0 } }],
      ]),
      directed: false,
      edges: [
        { from: 'a', to: 'b' },
        { from: 'b', to: 'c', weight: 0 },
      ],
    };
    const paths = findAllPaths(g, 'a', 'c');
    expect(paths).toHaveLength(1);
    expect(paths[0].totalWeight).toBe(1);
    expect(paths[0].nodes).toEqual(['a', 'b', 'c']);
  });
});
