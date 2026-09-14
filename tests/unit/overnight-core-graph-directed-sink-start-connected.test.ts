/**
 * Overnight TOKENMAXX — directed isConnected depends on Map iteration start.
 * Sink-first Map key → not connected. Tests-only. After #214/#215.
 */
import { describe, it, expect } from 'vitest';
import { isConnected, findComponents, findReachable } from '../../src/core/graph/algorithms';
import type { Graph } from '../../src/core/graph/types';

describe('Overnight core graph — directed sink-start connected', () => {
  it('source-first Map order → connected along outgoing chain', () => {
    const g: Graph = {
      nodes: new Map([
        ['a', { id: 'a', position: { x: 0, y: 0 } }],
        ['b', { id: 'b', position: { x: 1, y: 0 } }],
        ['c', { id: 'c', position: { x: 2, y: 0 } }],
      ]),
      directed: true,
      edges: [
        { from: 'a', to: 'b' },
        { from: 'b', to: 'c' },
      ],
    };
    expect(isConnected(g)).toBe(true);
    expect(findComponents(g)).toHaveLength(1);
  });

  it('sink-first Map order → isConnected false; two digraph components', () => {
    const g: Graph = {
      nodes: new Map([
        ['c', { id: 'c', position: { x: 0, y: 0 } }],
        ['a', { id: 'a', position: { x: 1, y: 0 } }],
        ['b', { id: 'b', position: { x: 2, y: 0 } }],
      ]),
      directed: true,
      edges: [
        { from: 'a', to: 'b' },
        { from: 'b', to: 'c' },
      ],
    };
    expect(isConnected(g)).toBe(false);
    const comps = findComponents(g);
    expect(comps).toHaveLength(2);
    expect(comps.find((c) => c.includes('c'))).toEqual(['c']);
    expect([...findReachable(g, 'c')]).toEqual(['c']);
    expect([...findReachable(g, 'a')].sort()).toEqual(['a', 'b', 'c']);
  });
});
