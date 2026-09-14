/**
 * Wave 33 — graph-ui skips edges whose endpoints are missing.
 * Edge-case deepen beyond wave 22 template smoke. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';

import {
  createTrackGraph,
  type Graph,
  type GraphNode,
} from '../../src/core/graph/types';
import { renderGraph } from '../../src/core/graph/graph-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 33 graph-ui-orphan — missing endpoint edges', () => {
  it('does not render lines for edges with unknown from/to', () => {
    const graph = createTrackGraph(3);
    graph.edges.push(
      { from: 't0', to: 'ghost' },
      { from: 'missing', to: 't2' },
      { from: 'nope', to: 'nada' }
    );
    const svg = renderGraph(graph, undefined, { showLabels: false });
    // only the two real track edges
    expect(svg.querySelectorAll('.edges line')).toHaveLength(2);
    expect(svg.querySelectorAll('.graph-node')).toHaveLength(3);
  });

  it('single-node graph with self-referencing missing peer draws zero edges', () => {
    const nodes = new Map<string, GraphNode>([
      ['solo', { id: 'solo', label: 'S', position: { x: 0, y: 0 } }],
    ]);
    const graph: Graph = {
      nodes,
      edges: [{ from: 'solo', to: 'elsewhere' }],
      directed: false,
    };
    const svg = renderGraph(graph);
    expect(svg.querySelectorAll('.edges line')).toHaveLength(0);
    expect(svg.querySelectorAll('.graph-node')).toHaveLength(1);
  });

  it('dataset.from / dataset.to mirror surviving edge endpoints', () => {
    const graph = createTrackGraph(2);
    const svg = renderGraph(graph);
    const line = svg.querySelector('.edges line') as SVGLineElement;
    expect(line.dataset.from).toBe('t0');
    expect(line.dataset.to).toBe('t1');
  });
});
