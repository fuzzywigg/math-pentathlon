/**
 * Overnight HEAVY leftover after #274 — dijkstra unreachable end → found false.
 * Distinct from wave57 cheap weighted path. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { dijkstra } from '../../src/core/graph';
import type { Graph } from '../../src/core/graph';

describe('Wave 58 core graph — dijkstra disconnected', () => {
  it('two isolates yield found:false distance:-1', () => {
    const g: Graph = {
      nodes: new Map([
        ['a', { id: 'a', position: { x: 0, y: 0 } }],
        ['b', { id: 'b', position: { x: 10, y: 0 } }],
      ]),
      edges: [],
      directed: false,
    };
    expect(dijkstra(g, 'a', 'b')).toEqual({
      found: false,
      path: [],
      distance: -1,
    });
  });
});
