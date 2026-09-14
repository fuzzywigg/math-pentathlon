/**
 * Overnight TOKENMAXX — findAllPaths self / maxDepth leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { findAllPaths, findReachable } from '../../src/core/graph/algorithms';
import type { Graph } from '../../src/core/graph/types';

describe('Overnight graph — paths self endpoint', () => {
  it('start===end yields single zero-weight path', () => {
    const g: Graph = {
      nodes: new Map([
        ['a', { id: 'a', position: { x: 0, y: 0 } }],
        ['b', { id: 'b', position: { x: 1, y: 0 } }],
      ]),
      edges: [{ from: 'a', to: 'b', weight: 2 }],
      directed: false,
    };
    const paths = findAllPaths(g, 'a', 'a');
    expect(paths).toEqual([{ nodes: ['a'], totalWeight: 0 }]);
    expect(findReachable(g, 'b').has('a')).toBe(true);
  });
});
