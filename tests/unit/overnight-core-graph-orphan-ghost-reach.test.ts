/**
 * Overnight TOKENMAXX — orphan edges expose ghost neighbor ids in reachability.
 * Tests-only. After #214/#215.
 */
import { describe, it, expect } from 'vitest';
import {
  getNeighbors,
  findReachable,
  bfs,
  getNodeDegree,
} from '../../src/core/graph/algorithms';
import type { Graph } from '../../src/core/graph/types';

describe('Overnight core graph — orphan ghost reach', () => {
  it('undirected orphan edge lists ghost as neighbor', () => {
    const g: Graph = {
      nodes: new Map([['a', { id: 'a', position: { x: 0, y: 0 } }]]),
      directed: false,
      edges: [{ from: 'a', to: 'ghost' }],
    };
    expect(getNeighbors(g, 'a')).toEqual(['ghost']);
    expect(getNodeDegree(g, 'a')).toBe(1);
    expect([...findReachable(g, 'a')].sort()).toEqual(['a', 'ghost']);
  });

  it('bfs to orphan ghost still finds a path (ghost need not be in nodes)', () => {
    const g: Graph = {
      nodes: new Map([
        ['a', { id: 'a', position: { x: 0, y: 0 } }],
        ['b', { id: 'b', position: { x: 1, y: 0 } }],
      ]),
      directed: false,
      edges: [
        { from: 'a', to: 'b' },
        { from: 'b', to: 'specter' },
      ],
    };
    expect(bfs(g, 'a', 'specter')).toEqual({
      found: true,
      path: ['a', 'b', 'specter'],
      distance: 2,
    });
  });

  it('directed orphan only expands from→to', () => {
    const g: Graph = {
      nodes: new Map([['a', { id: 'a', position: { x: 0, y: 0 } }]]),
      directed: true,
      edges: [{ from: 'ghost', to: 'a' }],
    };
    expect(getNeighbors(g, 'a')).toEqual([]);
    expect(getNeighbors(g, 'ghost')).toEqual(['a']);
  });
});
