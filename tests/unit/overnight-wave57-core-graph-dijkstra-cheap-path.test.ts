/**
 * Overnight HEAVY leftover after #264 — weighted dijkstra prefers cheap detour.
 * Distinct from wave53 missing-start / wave56 short animate. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { dijkstra, type Graph } from '../../src/core/graph';

describe('Wave 57 core graph — dijkstra cheap path', () => {
  it('weight-10 direct loses to 1+1 via midpoint', () => {
    const g: Graph = {
      nodes: new Map([
        ['a', { id: 'a', position: { x: 0, y: 0 } }],
        ['b', { id: 'b', position: { x: 1, y: 0 } }],
        ['c', { id: 'c', position: { x: 2, y: 0 } }],
      ]),
      edges: [
        { from: 'a', to: 'c', weight: 10 },
        { from: 'a', to: 'b', weight: 1 },
        { from: 'b', to: 'c', weight: 1 },
      ],
      directed: false,
    };
    const result = dijkstra(g, 'a', 'c');
    expect(result.distance).toBe(2);
    expect(result.path).toEqual(['a', 'b', 'c']);
  });
});
