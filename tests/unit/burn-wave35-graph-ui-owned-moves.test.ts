/**
 * Wave 35 — showValidMoves skips owned neighbors leftovers.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';

import {
  createStarGraph,
  showValidMoves,
  renderGraph,
  type GraphBoard,
  type NodeState,
} from '../../src/core/graph';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 35 graph-ui-owned — valid moves filter', () => {
  it('does not dash-highlight owned neighbor', () => {
    const graph = createStarGraph(3);
    const nodeStates = new Map<string, NodeState>([
      ['n0', { owner: 1 }],
    ]);
    const board: GraphBoard = { graph, nodeStates };
    const svg = renderGraph(graph, nodeStates);
    showValidMoves(svg, graph, 'center', board);
    const owned = svg.querySelector('circle[data-node-id="n0"]');
    expect(owned?.getAttribute('stroke-dasharray')).toBeNull();
    const free = svg.querySelector('circle[data-node-id="n1"]');
    expect(free?.getAttribute('stroke-dasharray')).toBe('5,3');
  });
});
