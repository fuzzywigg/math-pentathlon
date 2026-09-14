/**
 * Overnight TOKENMAXX — showValidMoves no-ops when all neighbors owned.
 * Tests-only. After #214/#215.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { renderGraph, showValidMoves } from '../../src/core/graph/graph-ui';
import {
  createStarGraph,
  type GraphBoard,
  type NodeState,
} from '../../src/core/graph/types';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Overnight core graph-ui — valid moves all owned', () => {
  it('owned neighbors stay undashed; free neighbor gets dasharray', () => {
    const graph = createStarGraph(3);
    const states = new Map<string, NodeState>([
      ['n0', { owner: 1 }],
      ['n1', { owner: 2 }],
      // n2 free
    ]);
    const board: GraphBoard = { graph, nodeStates: states };
    const svg = renderGraph(graph, states);
    showValidMoves(svg, graph, 'center', board);
    expect(
      svg.querySelector('circle[data-node-id="n0"]')?.getAttribute('stroke-dasharray')
    ).toBeNull();
    expect(
      svg.querySelector('circle[data-node-id="n1"]')?.getAttribute('stroke-dasharray')
    ).toBeNull();
    expect(
      svg.querySelector('circle[data-node-id="n2"]')?.getAttribute('stroke-dasharray')
    ).toBe('5,3');
  });
});
