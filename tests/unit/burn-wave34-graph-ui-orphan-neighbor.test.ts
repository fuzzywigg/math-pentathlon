/**
 * Wave 34 — graph-ui showValidMoves when neighbor circle is missing from SVG.
 * Hits the `if (node)` false branch leftover after wave 33 ownership matrix.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';

import {
  createStarGraph,
  createTrackGraph,
  type GraphBoard,
} from '../../src/core/graph/types';
import {
  renderGraph,
  showValidMoves,
  clearHighlights,
} from '../../src/core/graph/graph-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 34 graph-ui-orphan-neighbor — missing circle', () => {
  it('skips highlight when neighbor exists in graph but circle was removed', () => {
    const graph = createStarGraph(3);
    const board: GraphBoard = { graph, nodeStates: new Map() };
    const svg = renderGraph(graph);
    svg.querySelector('circle[data-node-id="n1"]')?.remove();

    showValidMoves(svg, graph, 'center', board);

    // Remaining open leaves still highlighted
    for (const id of ['n0', 'n2']) {
      expect(
        svg
          .querySelector(`circle[data-node-id="${id}"]`)
          ?.getAttribute('stroke-dasharray')
      ).toBe('5,3');
    }
    expect(svg.querySelector('circle[data-node-id="n1"]')).toBeNull();
  });

  it('track with all neighbor circles removed is a silent no-op', () => {
    const graph = createTrackGraph(3);
    const board: GraphBoard = { graph, nodeStates: new Map() };
    const svg = renderGraph(graph);
    svg.querySelector('circle[data-node-id="t1"]')?.remove();
    showValidMoves(svg, graph, 't0', board);
    expect(
      [...svg.querySelectorAll('.graph-node')].every(
        (n) => !(n as SVGElement).getAttribute('stroke-dasharray')
      )
    ).toBe(true);
    clearHighlights(svg);
  });
});
