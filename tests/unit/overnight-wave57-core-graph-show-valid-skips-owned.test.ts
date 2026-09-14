/**
 * Overnight HEAVY leftover after #264 — showValidMoves skips owned neighbors.
 * Distinct from wave53 isolated / wave52 owner:0 free. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import {
  createTrackGraph,
  renderGraph,
  showValidMoves,
  type GraphBoard,
} from '../../src/core/graph';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 57 core graph-ui — showValidMoves owned skip', () => {
  it('owned neighbor has no dasharray; free neighbor is dashed', () => {
    const graph = createTrackGraph(3);
    const board: GraphBoard = {
      graph,
      nodeStates: new Map([['t2', { owner: 1 }]]),
    };
    const svg = renderGraph(graph, board.nodeStates);
    showValidMoves(svg, graph, 't1', board);
    const free = svg.querySelector(
      'circle[data-node-id="t0"]'
    ) as SVGCircleElement;
    const owned = svg.querySelector(
      'circle[data-node-id="t2"]'
    ) as SVGCircleElement;
    expect(free.getAttribute('stroke-dasharray')).toBe('5,3');
    expect(owned.getAttribute('stroke-dasharray')).toBeNull();
  });
});
