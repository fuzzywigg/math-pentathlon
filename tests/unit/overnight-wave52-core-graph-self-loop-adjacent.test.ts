/**
 * Overnight HEAVY leftover after #234 — areAdjacent / getEdge on self-loop.
 * Distinct from overnight-core-graph-getedge-directed-no-reverse. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { areAdjacent, getEdge } from '../../src/core/graph/algorithms';
import type { Graph } from '../../src/core/graph/types';

describe('Wave 52 core graph — self-loop adjacent', () => {
  it('undirected self-loop → areAdjacent true; no loop → false', () => {
    const withLoop: Graph = {
      nodes: new Map([['a', { id: 'a', position: { x: 0, y: 0 } }]]),
      directed: false,
      edges: [{ from: 'a', to: 'a', weight: 1 }],
    };
    const bare: Graph = {
      nodes: new Map([['a', { id: 'a', position: { x: 0, y: 0 } }]]),
      directed: false,
      edges: [],
    };
    expect(areAdjacent(withLoop, 'a', 'a')).toBe(true);
    expect(getEdge(withLoop, 'a', 'a')).toEqual({ from: 'a', to: 'a', weight: 1 });
    expect(areAdjacent(bare, 'a', 'a')).toBe(false);
    expect(getEdge(bare, 'a', 'a')).toBeUndefined();
  });
});
