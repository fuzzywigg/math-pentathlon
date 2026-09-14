/**
 * Wave 40 — graph UI legend / valid moves / animate leftovers after #176.
 * Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';

import {
  createCircularGraph,
  createGraphLegend,
  showValidMoves,
  animateMove,
  renderGraph,
  injectGraphStyles,
} from '../../src/core/graph';
import type { GraphBoard } from '../../src/core/graph';

describe('Wave 40 graph UI — legend / valids / animate', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.head.innerHTML = '';
  });

  it('createGraphLegend has empty + player labels', () => {
    const legend = createGraphLegend();
    expect(legend.className).toBe('graph-legend');
    expect(legend.textContent).toContain('Empty');
    expect(legend.textContent).toContain('Player 1');
    expect(legend.textContent).toContain('Valid Move');
  });

  it('showValidMoves marks neighbors; animateMove settles short path', async () => {
    injectGraphStyles();
    const graph = createCircularGraph(4, 40);
    const svg = renderGraph(graph);
    document.body.appendChild(svg);
    const board: GraphBoard = { graph, nodeStates: new Map() };
    showValidMoves(svg, graph, 'n0', board);
    const stroked = Array.from(
      svg.querySelectorAll('circle[data-node-id]')
    ).filter((el) => el.getAttribute('stroke-dasharray'));
    expect(stroked.length).toBeGreaterThan(0);
    await animateMove(svg, ['n0', 'n1'], graph, 20);
  });
});
