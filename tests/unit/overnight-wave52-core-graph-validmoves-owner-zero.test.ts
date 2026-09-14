/**
 * Overnight HEAVY leftover after #234 — showValidMoves treats owner:0 as free (!state?.owner).
 * Distinct from overnight-core-graph-show-valid-moves-all-owned. Tests-only.
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

describe('Wave 52 core graph-ui — validmoves owner zero', () => {
  it('neighbor with owner:0 still gets dasharray (falsy owner gate)', () => {
    const graph = createStarGraph(2);
    const states = new Map<string, NodeState>([
      ['n0', { owner: 0 as unknown as 1 }],
      ['n1', { owner: 1 }],
    ]);
    const board: GraphBoard = { graph, nodeStates: states };
    const svg = renderGraph(graph, states);
    showValidMoves(svg, graph, 'center', board);
    expect(
      svg.querySelector('circle[data-node-id="n0"]')?.getAttribute('stroke-dasharray')
    ).toBe('5,3');
    expect(
      svg.querySelector('circle[data-node-id="n1"]')?.getAttribute('stroke-dasharray')
    ).toBeNull();
  });
});
