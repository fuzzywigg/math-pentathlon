/**
 * Wave 40 — dijkstra unreachable leftovers after #176.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { dijkstra } from '../../src/core/graph';
import type { Graph } from '../../src/core/graph';

describe('Wave 40 graph — dijkstra unreachable', () => {
  it('disconnected components → found false distance -1', () => {
    const graph: Graph = {
      directed: false,
      nodes: new Map([
        ['a', { id: 'a', position: { x: 0, y: 0 } }],
        ['b', { id: 'b', position: { x: 1, y: 0 } }],
        ['c', { id: 'c', position: { x: 10, y: 0 } }],
      ]),
      edges: [{ from: 'a', to: 'b', weight: 1 }],
    };
    const r = dijkstra(graph, 'a', 'c');
    expect(r.found).toBe(false);
    expect(r.path).toEqual([]);
    expect(r.distance).toBe(-1);
  });

  it('connected path returns positive distance', () => {
    const graph: Graph = {
      directed: false,
      nodes: new Map([
        ['a', { id: 'a', position: { x: 0, y: 0 } }],
        ['b', { id: 'b', position: { x: 1, y: 0 } }],
      ]),
      edges: [{ from: 'a', to: 'b', weight: 3 }],
    };
    const r = dijkstra(graph, 'a', 'b');
    expect(r.found).toBe(true);
    expect(r.distance).toBe(3);
    expect(r.path).toEqual(['a', 'b']);
  });
});
