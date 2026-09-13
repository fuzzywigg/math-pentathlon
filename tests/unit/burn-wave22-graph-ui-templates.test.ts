/**
 * Wave 22 — graph templates + graph-ui render / interactive / path / legend.
 * Distinct from graph.test createGridGraph coverage and wave 21 hex-region edges.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  createCircularGraph,
  createStarGraph,
  createHexLatticeGraph,
  createTrackGraph,
  createCompleteGraph,
  createGridGraph,
  DEFAULT_GRAPH_CONFIG,
  type GraphBoard,
  type NodeId,
} from '../../src/core/graph/types';
import {
  renderGraph,
  createInteractiveGraph,
  highlightPath,
  clearHighlights,
  showValidMoves,
  injectGraphStyles,
  createGraphLegend,
  animateMove,
} from '../../src/core/graph/graph-ui';
import { getNeighbors } from '../../src/core/graph/algorithms';

afterEach(() => {
  document.body.innerHTML = '';
  document.querySelectorAll('#graph-styles').forEach((el) => el.remove());
  vi.restoreAllMocks();
});

describe('Wave 22 graph — template invariants', () => {
  it('circular / star / track / hex / complete shape contracts', () => {
    const ring = createCircularGraph(8);
    expect(ring.nodes.size).toBe(8);
    expect(ring.edges).toHaveLength(8);
    expect(getNeighbors(ring, 'n0').sort()).toEqual(['n1', 'n7']);

    const star = createStarGraph(6);
    expect(star.nodes.size).toBe(7);
    expect(star.edges).toHaveLength(6);
    expect(getNeighbors(star, 'center')).toHaveLength(6);
    expect(getNeighbors(star, 'n0')).toEqual(['center']);

    const track = createTrackGraph(5);
    expect(track.nodes.size).toBe(5);
    expect(track.edges).toHaveLength(4);
    expect(getNeighbors(track, 't2').sort()).toEqual(['t1', 't3']);

    const hex = createHexLatticeGraph(1);
    // center + 6 neighbors
    expect(hex.nodes.size).toBe(7);
    expect(hex.edges.length).toBeGreaterThanOrEqual(6);

    const complete = createCompleteGraph(4);
    const circular = createCircularGraph(4);
    expect(complete.nodes.size).toBe(4);
    expect(complete.edges.length).toBeGreaterThan(circular.edges.length);
  });
});

describe('Wave 22 graph-ui — render + interactive', () => {
  it('renderGraph builds edges/nodes and honors owner/highlight states', () => {
    const graph = createCircularGraph(4);
    const states = new Map();
    states.set('n0', { owner: 1 });
    states.set('n1', { owner: 2 });
    states.set('n2', { highlighted: true });
    states.set('n3', { disabled: true, value: 9 });

    const svg = renderGraph(graph, states, { showWeights: false });
    expect(svg.classList.contains('graph-view')).toBe(true);
    expect(svg.querySelectorAll('.edges line')).toHaveLength(4);
    expect(svg.querySelectorAll('.graph-node')).toHaveLength(4);
    expect(
      svg.querySelector('circle[data-node-id="n2"]')?.classList.contains(
        'highlighted'
      )
    ).toBe(true);
    expect(
      svg.querySelector('circle[data-node-id="n0"]')?.getAttribute('fill')
    ).toBe(DEFAULT_GRAPH_CONFIG.nodeColors.player1);
    expect(
      svg.querySelector('circle[data-node-id="n1"]')?.getAttribute('fill')
    ).toBe(DEFAULT_GRAPH_CONFIG.nodeColors.player2);
  });

  it('createInteractiveGraph wires click and hover callbacks', () => {
    const graph = createStarGraph(3);
    const board: GraphBoard = {
      graph,
      nodeStates: new Map(),
    };
    const clicks: NodeId[] = [];
    const hovers: Array<NodeId | null> = [];
    const el = createInteractiveGraph(
      board,
      (id) => clicks.push(id),
      (id) => hovers.push(id)
    );
    expect(el.classList.contains('graph-container')).toBe(true);
    const center = el.querySelector(
      'circle[data-node-id="center"]'
    ) as SVGElement;
    center.dispatchEvent(new Event('click'));
    center.dispatchEvent(new Event('mouseenter'));
    center.dispatchEvent(new Event('mouseleave'));
    expect(clicks).toEqual(['center']);
    expect(hovers).toEqual(['center', null]);
  });
});

describe('Wave 22 graph-ui — path / moves / legend / styles / animate', () => {
  it('highlightPath / clearHighlights / showValidMoves class and stroke toggles', () => {
    const graph = createTrackGraph(4);
    const svg = renderGraph(graph);
    highlightPath(svg, ['t0', 't1', 't2'], '#4caf50');
    const edge = svg.querySelector(
      'line[data-from="t0"][data-to="t1"]'
    ) as SVGElement;
    expect(edge.getAttribute('stroke')).toBe('#4caf50');
    expect(edge.getAttribute('stroke-width')).toBe('5');

    clearHighlights(svg);
    expect(edge.getAttribute('stroke')).toBe(DEFAULT_GRAPH_CONFIG.edgeColor);
    expect(edge.getAttribute('stroke-width')).toBe(
      String(DEFAULT_GRAPH_CONFIG.edgeWidth)
    );

    const board: GraphBoard = {
      graph,
      nodeStates: new Map([['t2', { owner: 1 }]]),
    };
    showValidMoves(svg, graph, 't1', board);
    const open = svg.querySelector(
      'circle[data-node-id="t0"]'
    ) as SVGElement;
    const owned = svg.querySelector(
      'circle[data-node-id="t2"]'
    ) as SVGElement;
    expect(open.getAttribute('stroke-dasharray')).toBe('5,3');
    expect(owned.getAttribute('stroke-dasharray')).toBeNull();
  });

  it('injectGraphStyles idempotent + createGraphLegend labels', () => {
    injectGraphStyles();
    injectGraphStyles();
    expect(document.querySelectorAll('#graph-styles')).toHaveLength(1);
    expect(document.getElementById('graph-styles')?.textContent).toContain(
      'graph-node'
    );

    const legend = createGraphLegend();
    expect(legend.classList.contains('graph-legend')).toBe(true);
    expect(legend.textContent).toContain('Empty');
    expect(legend.textContent).toContain('Player 1');
    expect(legend.textContent).toContain('Player 2');
    expect(legend.textContent).toContain('Valid Move');
  });

  it('animateMove resolves for short and long paths', async () => {
    const graph = createGridGraph(1, 2);
    const svg = renderGraph(graph);
    document.body.appendChild(svg);
    await expect(animateMove(svg, ['0-0'], graph, 10)).resolves.toBeUndefined();
    await expect(
      animateMove(svg, ['0-0', '0-1'], graph, 20)
    ).resolves.toBeUndefined();
  });
});
