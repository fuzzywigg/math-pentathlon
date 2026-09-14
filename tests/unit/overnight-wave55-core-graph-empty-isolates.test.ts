/**
 * Overnight HEAVY leftover after #250 — empty graph isConnected; two isolates
 * are two components. Distinct from wave34 reachable-dag. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { isConnected, findComponents } from '../../src/core/graph/algorithms';
import type { Graph } from '../../src/core/graph/types';

describe('Wave 55 core graph — empty + isolate components', () => {
  it('empty nodes → connected true and zero components', () => {
    const empty: Graph = { nodes: new Map(), edges: [], directed: false };
    expect(isConnected(empty)).toBe(true);
    expect(findComponents(empty)).toEqual([]);
  });

  it('two unlabeled isolates are two singleton components', () => {
    const g: Graph = {
      nodes: new Map([
        ['p', { id: 'p', position: { x: 0, y: 0 } }],
        ['q', { id: 'q', position: { x: 1, y: 0 } }],
      ]),
      edges: [],
      directed: false,
    };
    expect(isConnected(g)).toBe(false);
    const comps = findComponents(g).map((c) => c.sort());
    expect(comps).toEqual([['p'], ['q']]);
  });
});
