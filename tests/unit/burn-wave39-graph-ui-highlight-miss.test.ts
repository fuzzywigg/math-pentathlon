/**
 * Wave 39 — graph-ui highlight / clear / valid-moves / legend leftovers.
 * After waves 33–34; not re-burned in 36–38. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';

import {
  createTrackGraph,
  createStarGraph,
  createCompleteGraph,
  type GraphBoard,
} from '../../src/core/graph/types';
import {
  renderGraph,
  highlightPath,
  clearHighlights,
  showValidMoves,
  animateMove,
  createGraphLegend,
} from '../../src/core/graph/graph-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 39 graph-ui — ghost path / clear leftovers', () => {
  it('highlightPath ignores missing node/edge ids without throwing', () => {
    const graph = createTrackGraph(4);
    const svg = renderGraph(graph);
    document.body.appendChild(svg);
    expect(() =>
      highlightPath(svg, ['ghost-a', 't0', 'ghost-b'], '#ff00aa')
    ).not.toThrow();
    clearHighlights(svg);
    expect(svg.querySelectorAll('circle').length).toBeGreaterThan(0);
  });

  it('showValidMoves skips owned neighbors; animateMove no-ops short paths', async () => {
    const graph = createStarGraph(3);
    const board: GraphBoard = {
      graph,
      nodeStates: new Map([['n0', { owner: 1 }]]),
    };
    const svg = renderGraph(graph, board.nodeStates);
    document.body.appendChild(svg);
    showValidMoves(svg, graph, 'center', board);
    // n0 owned → no dash; other spokes open
    expect(
      svg
        .querySelector('circle[data-node-id="n0"]')
        ?.getAttribute('stroke-dasharray')
    ).toBeNull();
    await expect(animateMove(svg, ['center'], graph, 1)).resolves.toBeUndefined();
    await expect(animateMove(svg, [], graph, 1)).resolves.toBeUndefined();
  });

  it('createGraphLegend always ships the four chrome slots', () => {
    const legend = createGraphLegend();
    expect(legend.className).toBe('graph-legend');
    expect(legend.textContent).toMatch(/Empty/);
    expect(legend.textContent).toMatch(/Player 1/);
    expect(legend.textContent).toMatch(/Valid Move/);
  });

  it('complete-graph clear after full path restores edge widths', () => {
    const graph = createCompleteGraph(4);
    const svg = renderGraph(graph);
    const ids = [...graph.nodes.keys()];
    highlightPath(svg, ids, '#f0f');
    clearHighlights(svg);
    const thick = [...svg.querySelectorAll('line')].filter(
      (l) => l.getAttribute('stroke-width') === '5'
    );
    expect(thick).toHaveLength(0);
  });
});
