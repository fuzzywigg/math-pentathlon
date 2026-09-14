/**
 * Wave 34 — graph-ui legend / styles / interactive hover leftovers.
 * Deepens wave 33 legend-custom + styles-idempotent with compose edges.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';

import {
  createCircularGraph,
  createStarGraph,
  type GraphBoard,
  type NodeId,
} from '../../src/core/graph/types';
import {
  createGraphLegend,
  createInteractiveGraph,
  injectGraphStyles,
  renderGraph,
} from '../../src/core/graph/graph-ui';

afterEach(() => {
  document.body.innerHTML = '';
  document.querySelectorAll('#graph-styles').forEach((el) => el.remove());
});

describe('Wave 34 graph-ui-chrome — legend + styles compose', () => {
  it('legend lists Empty / Player 1 / Player 2 / Valid Move with default colors', () => {
    const legend = createGraphLegend();
    expect(legend.classList.contains('graph-legend')).toBe(true);
    const labels = [...legend.querySelectorAll('span')]
      .map((s) => s.textContent)
      .filter((t) => t && !t.startsWith('#') && t.length > 1);
    expect(labels).toEqual(
      expect.arrayContaining(['Empty', 'Player 1', 'Player 2', 'Valid Move'])
    );
    expect(legend.children).toHaveLength(4);
    for (const item of legend.children) {
      const dot = item.firstElementChild as HTMLElement;
      expect(dot.style.background.length).toBeGreaterThan(0);
      expect(dot.style.borderRadius).toBe('50%');
    }
  });

  it('injectGraphStyles twice keeps a single #graph-styles node', () => {
    injectGraphStyles();
    injectGraphStyles();
    expect(document.querySelectorAll('#graph-styles')).toHaveLength(1);
    expect(document.getElementById('graph-styles')?.textContent).toMatch(
      /pulse-node/
    );
  });

  it('interactive circular graph hover sequence ends with null', () => {
    const graph = createCircularGraph(4);
    const board: GraphBoard = { graph, nodeStates: new Map() };
    const hovers: Array<NodeId | null> = [];
    const el = createInteractiveGraph(
      board,
      () => {},
      (id) => hovers.push(id)
    );
    const nodes = [
      ...el.querySelectorAll('.graph-node'),
    ] as SVGElement[];
    for (const n of nodes) {
      n.dispatchEvent(new Event('mouseenter'));
      n.dispatchEvent(new Event('mouseleave'));
    }
    expect(hovers.filter((h) => h === null)).toHaveLength(nodes.length);
    expect(hovers.filter((h) => h !== null)).toHaveLength(nodes.length);
  });

  it('renderGraph + legend mount side-by-side without collision', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    host.appendChild(renderGraph(createStarGraph(2)));
    host.appendChild(createGraphLegend());
    expect(host.querySelectorAll('.graph-view')).toHaveLength(1);
    expect(host.querySelectorAll('.graph-legend')).toHaveLength(1);
  });
});
