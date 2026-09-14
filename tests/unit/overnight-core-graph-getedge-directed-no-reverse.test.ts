/**
 * Overnight TOKENMAXX — directed getEdge/areAdjacent refuse reverse.
 * Tests-only. After #214/#215.
 */
import { describe, it, expect } from 'vitest';
import { getEdge, areAdjacent, getNeighbors } from '../../src/core/graph/algorithms';
import type { Graph } from '../../src/core/graph/types';

describe('Overnight core graph — directed getEdge no reverse', () => {
  it('forward hit; reverse miss; neighbors one-way', () => {
    const g: Graph = {
      nodes: new Map([
        ['a', { id: 'a', position: { x: 0, y: 0 } }],
        ['b', { id: 'b', position: { x: 1, y: 0 } }],
      ]),
      directed: true,
      edges: [{ from: 'a', to: 'b', weight: 3, label: 'ab' }],
    };
    expect(getEdge(g, 'a', 'b')?.label).toBe('ab');
    expect(getEdge(g, 'b', 'a')).toBeUndefined();
    expect(areAdjacent(g, 'a', 'b')).toBe(true);
    expect(areAdjacent(g, 'b', 'a')).toBe(false);
    expect(getNeighbors(g, 'a')).toEqual(['b']);
    expect(getNeighbors(g, 'b')).toEqual([]);
  });
});
