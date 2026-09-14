/**
 * Wave 33 — showValidMoves owned vs open neighbor matrix.
 * Deepens wave 22 single owned-neighbor case. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';

import {
  createGridGraph,
  createStarGraph,
  createTrackGraph,
  DEFAULT_GRAPH_CONFIG,
  type GraphBoard,
  type NodeState,
} from '../../src/core/graph/types';
import {
  renderGraph,
  showValidMoves,
  clearHighlights,
} from '../../src/core/graph/graph-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 33 graph-ui-valid-moves — ownership matrix', () => {
  it('star from center marks every unowned leaf; skips owned', () => {
    const graph = createStarGraph(4);
    const states = new Map<string, NodeState>([
      ['n0', { owner: 1 }],
      ['n2', { owner: 2 }],
    ]);
    const board: GraphBoard = { graph, nodeStates: states };
    const svg = renderGraph(graph, states);
    showValidMoves(svg, graph, 'center', board);

    for (const id of ['n1', 'n3']) {
      const node = svg.querySelector(
        `circle[data-node-id="${id}"]`
      ) as SVGElement;
      expect(node.getAttribute('stroke')).toBe(
        DEFAULT_GRAPH_CONFIG.nodeColors.highlighted
      );
      expect(node.getAttribute('stroke-width')).toBe('4');
      expect(node.getAttribute('stroke-dasharray')).toBe('5,3');
    }
    for (const id of ['n0', 'n2']) {
      const node = svg.querySelector(
        `circle[data-node-id="${id}"]`
      ) as SVGElement;
      expect(node.getAttribute('stroke-dasharray')).toBeNull();
    }
  });

  it('track endpoint only highlights the single open neighbor', () => {
    const graph = createTrackGraph(4);
    const board: GraphBoard = { graph, nodeStates: new Map() };
    const svg = renderGraph(graph);
    showValidMoves(svg, graph, 't0', board);
    const t1 = svg.querySelector('circle[data-node-id="t1"]') as SVGElement;
    const t2 = svg.querySelector('circle[data-node-id="t2"]') as SVGElement;
    expect(t1.getAttribute('stroke-dasharray')).toBe('5,3');
    expect(t2.getAttribute('stroke-dasharray')).toBeNull();
  });

  it('grid center-ish cell highlights up to 4 open neighbors', () => {
    const graph = createGridGraph(3, 3);
    const board: GraphBoard = {
      graph,
      nodeStates: new Map([['1-2', { owner: 1 }]]),
    };
    const svg = renderGraph(graph);
    showValidMoves(svg, graph, '1-1', board);
    // neighbors of 1-1: 1-0, 1-2, 0-1, 2-1 — 1-2 owned
    expect(
      svg
        .querySelector('circle[data-node-id="1-0"]')
        ?.getAttribute('stroke-dasharray')
    ).toBe('5,3');
    expect(
      svg
        .querySelector('circle[data-node-id="0-1"]')
        ?.getAttribute('stroke-dasharray')
    ).toBe('5,3');
    expect(
      svg
        .querySelector('circle[data-node-id="2-1"]')
        ?.getAttribute('stroke-dasharray')
    ).toBe('5,3');
    expect(
      svg
        .querySelector('circle[data-node-id="1-2"]')
        ?.getAttribute('stroke-dasharray')
    ).toBeNull();
  });

  it('custom highlighted color used for valid-move stroke', () => {
    const graph = createTrackGraph(2);
    const board: GraphBoard = { graph, nodeStates: new Map() };
    const svg = renderGraph(graph);
    showValidMoves(svg, graph, 't0', board, {
      nodeColors: {
        ...DEFAULT_GRAPH_CONFIG.nodeColors,
        highlighted: '#00ffcc',
      },
    });
    expect(
      svg.querySelector('circle[data-node-id="t1"]')?.getAttribute('stroke')
    ).toBe('#00ffcc');
    clearHighlights(svg);
    expect(
      svg.querySelector('circle[data-node-id="t1"]')?.getAttribute('stroke')
    ).toBe('#333');
  });
});
