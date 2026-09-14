/**
 * Wave 33 — graph-ui handshake stress: render ↔ highlight ↔ moves ↔ legend.
 * Cross-cuts UI APIs without inventing product behavior. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';

import {
  createCircularGraph,
  createGridGraph,
  createStarGraph,
  createTrackGraph,
  DEFAULT_GRAPH_CONFIG,
  type GraphBoard,
  type NodeState,
} from '../../src/core/graph/types';
import {
  renderGraph,
  createInteractiveGraph,
  highlightPath,
  clearHighlights,
  showValidMoves,
  createGraphLegend,
  injectGraphStyles,
} from '../../src/core/graph/graph-ui';
import { getNeighbors, bfs } from '../../src/core/graph/algorithms';

afterEach(() => {
  document.body.innerHTML = '';
  document.querySelectorAll('#graph-styles').forEach((el) => el.remove());
});

describe('Wave 33 graph-ui-handshake — algo path ↔ highlight', () => {
  it('BFS path on grid highlights exactly path.length-1 edges', () => {
    const graph = createGridGraph(3, 3);
    const { found, path } = bfs(graph, '0-0', '2-2');
    expect(found).toBe(true);
    expect(path.length).toBeGreaterThan(1);

    const svg = renderGraph(graph);
    highlightPath(svg, path, '#abc123');
    const thickEdges = [...svg.querySelectorAll('line')].filter(
      (l) => l.getAttribute('stroke') === '#abc123'
    );
    expect(thickEdges).toHaveLength(path.length - 1);

    const thickNodes = [...svg.querySelectorAll('.graph-node')].filter(
      (n) => (n as SVGElement).getAttribute('stroke') === '#abc123'
    );
    expect(thickNodes).toHaveLength(path.length);

    clearHighlights(svg);
    expect(
      [...svg.querySelectorAll('line')].every(
        (l) => l.getAttribute('stroke') === DEFAULT_GRAPH_CONFIG.edgeColor
      )
    ).toBe(true);
  });

  it('showValidMoves neighbors agree with getNeighbors minus owned', () => {
    const graph = createStarGraph(5);
    const owned = new Set(['n1', 'n3']);
    const states = new Map<string, NodeState>();
    for (const id of owned) states.set(id, { owner: 1 });
    const board: GraphBoard = { graph, nodeStates: states };
    const svg = renderGraph(graph, states);
    showValidMoves(svg, graph, 'center', board);

    const expected = getNeighbors(graph, 'center').filter((id) => !owned.has(id));
    for (const id of expected) {
      expect(
        svg
          .querySelector(`circle[data-node-id="${id}"]`)
          ?.getAttribute('stroke-dasharray')
      ).toBe('5,3');
    }
    for (const id of owned) {
      expect(
        svg
          .querySelector(`circle[data-node-id="${id}"]`)
          ?.getAttribute('stroke-dasharray')
      ).toBeNull();
    }
  });
});

describe('Wave 33 graph-ui-handshake — interactive + legend + styles', () => {
  it('interactive container + legend + styles compose without collision', () => {
    injectGraphStyles();
    const graph = createCircularGraph(6);
    const board: GraphBoard = { graph, nodeStates: new Map() };
    const clicks: string[] = [];
    const el = createInteractiveGraph(board, (id) => clicks.push(id), () => {});
    const legend = createGraphLegend();
    document.body.appendChild(el);
    document.body.appendChild(legend);

    expect(document.querySelectorAll('#graph-styles')).toHaveLength(1);
    expect(document.querySelectorAll('.graph-container')).toHaveLength(1);
    expect(document.querySelectorAll('.graph-legend')).toHaveLength(1);
    expect(el.querySelectorAll('.graph-node')).toHaveLength(6);

    el.querySelector('circle[data-node-id="n3"]')?.dispatchEvent(
      new Event('click')
    );
    expect(clicks).toEqual(['n3']);
  });

  it('track highlight then valid-moves still leaves path nodes queryable', () => {
    const graph = createTrackGraph(5);
    const svg = renderGraph(graph);
    highlightPath(svg, ['t0', 't1', 't2']);
    const board: GraphBoard = {
      graph,
      nodeStates: new Map([['t3', { owner: 1 }]]),
    };
    showValidMoves(svg, graph, 't2', board);
    // t1 is previous path node; t3 owned neighbor of t2; t4 is open? wait neighbors of t2 are t1,t3
    expect(
      svg.querySelector('circle[data-node-id="t1"]')?.getAttribute('stroke-dasharray')
    ).toBe('5,3');
    expect(
      svg.querySelector('circle[data-node-id="t3"]')?.getAttribute('stroke-dasharray')
    ).toBeNull();
    expect(svg.querySelector('circle[data-node-id="t0"]')).toBeTruthy();
  });
});
