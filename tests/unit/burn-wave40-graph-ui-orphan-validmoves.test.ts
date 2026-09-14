/**
 * Wave 40 — graph-ui orphan edges skipped + empty path / validmoves leftovers.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';

import {
  createTrackGraph,
  type Graph,
  type GraphBoard,
  type GraphNode,
} from '../../src/core/graph/types';
import {
  renderGraph,
  highlightPath,
  showValidMoves,
  clearHighlights,
} from '../../src/core/graph/graph-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 40 graph-ui — orphan edges + validmoves/path empties', () => {
  it('orphan edges with missing endpoints are skipped', () => {
    const graph = createTrackGraph(3);
    graph.edges.push(
      { from: 't0', to: 'ghost' },
      { from: 'missing', to: 't1' },
      { from: 'a', to: 'b' }
    );
    const svg = renderGraph(graph, undefined, { showLabels: false });
    expect(svg.querySelectorAll('.edges line')).toHaveLength(2);
  });

  it('empty highlightPath is a no-op; single-node path highlights node only', () => {
    const graph = createTrackGraph(3);
    const svg = renderGraph(graph);
    const before = svg
      .querySelector('line[data-from="t0"][data-to="t1"]')
      ?.getAttribute('stroke');
    highlightPath(svg, [], '#00ff00');
    expect(
      svg
        .querySelector('line[data-from="t0"][data-to="t1"]')
        ?.getAttribute('stroke')
    ).toBe(before);

    highlightPath(svg, ['t1'], '#00ff00');
    expect(
      svg.querySelector('circle[data-node-id="t1"]')?.getAttribute('stroke')
    ).toBe('#00ff00');
  });

  it('showValidMoves on leaf with owned neighbor paints nothing owned', () => {
    const graph = createTrackGraph(3);
    const board: GraphBoard = {
      graph,
      nodeStates: new Map([
        ['t0', { owner: 1 }],
        ['t1', {}],
        ['t2', {}],
      ]),
    };
    const svg = renderGraph(graph, board.nodeStates);
    showValidMoves(svg, graph, 't0', board);
    // t1 is the only neighbor of t0 and is unowned → dashed highlight
    const t1 = svg.querySelector(
      'circle[data-node-id="t1"]'
    ) as SVGCircleElement;
    expect(t1.getAttribute('stroke-dasharray')).toBe('5,3');
    expect(
      svg
        .querySelector('circle[data-node-id="t0"]')
        ?.getAttribute('stroke-dasharray')
    ).toBeNull();
  });

  it('showValidMoves with no neighbors is a silent no-op', () => {
    const nodes = new Map<string, GraphNode>([
      ['solo', { id: 'solo', position: { x: 0, y: 0 } }],
    ]);
    const graph: Graph = { nodes, edges: [], directed: false };
    const board: GraphBoard = { graph, nodeStates: new Map() };
    const svg = renderGraph(graph);
    expect(() => showValidMoves(svg, graph, 'solo', board)).not.toThrow();
    expect(
      svg
        .querySelector('circle[data-node-id="solo"]')
        ?.getAttribute('stroke-dasharray')
    ).toBeNull();
  });

  it('clearHighlights restores default strokes after valid-move dashes', () => {
    const graph = createTrackGraph(3);
    const board: GraphBoard = { graph, nodeStates: new Map() };
    const svg = renderGraph(graph);
    showValidMoves(svg, graph, 't1', board);
    clearHighlights(svg);
    for (const node of svg.querySelectorAll('.graph-node')) {
      expect((node as SVGElement).getAttribute('stroke')).toBe('#333');
      expect((node as SVGElement).getAttribute('stroke-width')).toBe('2');
    }
  });
});
