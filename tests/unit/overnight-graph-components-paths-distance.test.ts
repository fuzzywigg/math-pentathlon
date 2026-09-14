/**
 * Overnight TOKENMAXX — components / paths / distance leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  isConnected,
  findComponents,
  findReachable,
  findAllPaths,
  findNodesAtDistance,
  findNodesWithinDistance,
} from '../../src/core/graph/algorithms';
import type { Graph } from '../../src/core/graph/types';

function g(): Graph {
  return {
    nodes: new Map([
      ['A', { id: 'A', position: { x: 0, y: 0 } }],
      ['B', { id: 'B', position: { x: 0, y: 0 } }],
      ['C', { id: 'C', position: { x: 0, y: 0 } }],
      ['X', { id: 'X', position: { x: 0, y: 0 } }],
      ['Y', { id: 'Y', position: { x: 0, y: 0 } }],
    ]),
    edges: [
      { from: 'A', to: 'B', weight: 1 },
      { from: 'B', to: 'C', weight: 2 },
      { from: 'A', to: 'C', weight: 5 },
      { from: 'X', to: 'Y', weight: 1 },
    ],
    directed: false,
  };
}

describe('Overnight graph — components/paths/distance', () => {
  it('disconnected components and reachability', () => {
    const graph = g();
    expect(isConnected(graph)).toBe(false);
    expect(findComponents(graph)).toHaveLength(2);
    expect([...findReachable(graph, 'A')].sort()).toEqual(['A', 'B', 'C']);
  });

  it('findAllPaths respects maxDepth and weights', () => {
    const graph = g();
    const paths = findAllPaths(graph, 'A', 'C', 10);
    expect(paths.length).toBeGreaterThanOrEqual(2);
    const direct = paths.find((p) => p.nodes.length === 2);
    expect(direct?.totalWeight).toBe(5);
    const shallow = findAllPaths(graph, 'A', 'C', 1);
    expect(shallow.every((p) => p.nodes.length <= 2)).toBe(true);
  });

  it('nodes at/within distance', () => {
    const graph = g();
    expect(findNodesAtDistance(graph, 'A', 1).sort()).toEqual(['B', 'C']);
    expect(findNodesWithinDistance(graph, 'A', 1).sort()).toEqual(['A', 'B', 'C']);
  });

  it('empty graph is connected', () => {
    expect(isConnected({ nodes: new Map(), edges: [], directed: false })).toBe(true);
  });
});
