/**
 * Wave 35 — graph-ui empty / single-node render leftovers.
 * Distinct from #160 algorithms and #161 leftover UI. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';

import type { Graph, GraphNode, NodeId } from '../../src/core/graph';
import { renderGraph, createGraphLegend } from '../../src/core/graph';

afterEach(() => {
  document.body.innerHTML = '';
});

function node(id: NodeId, x = 0, y = 0): GraphNode {
  return { id, position: { x, y } };
}

describe('Wave 35 graph-ui-empty — empty graph', () => {
  it('renders svg with no nodes/edges groups children', () => {
    const graph: Graph = { nodes: new Map(), edges: [], directed: false };
    const svg = renderGraph(graph);
    expect(svg.classList.contains('graph-view')).toBe(true);
    expect(svg.querySelectorAll('.graph-node')).toHaveLength(0);
    expect(svg.querySelectorAll('line')).toHaveLength(0);
  });
});

describe('Wave 35 graph-ui-empty — singleton', () => {
  it('renders one node and zero edges', () => {
    const graph: Graph = {
      nodes: new Map([['only', node('only', 10, 20)]]),
      edges: [],
      directed: false,
    };
    const svg = renderGraph(graph);
    expect(svg.querySelectorAll('.graph-node')).toHaveLength(1);
    expect(svg.querySelector('circle[data-node-id="only"]')).toBeTruthy();
    expect(svg.querySelectorAll('line')).toHaveLength(0);
  });
});

describe('Wave 35 graph-ui-empty — legend defaults', () => {
  it('createGraphLegend returns labeled color rows', () => {
    const legend = createGraphLegend();
    expect(legend.className).toBe('graph-legend');
    expect(legend.children.length).toBe(4);
    expect(legend.textContent).toMatch(/Empty/);
    expect(legend.textContent).toMatch(/Player 1/);
    expect(legend.textContent).toMatch(/Valid Move/);
  });
});
