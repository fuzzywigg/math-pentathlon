/**
 * Wave 33 — renderGraph edge stroke/width config + data-node-id coverage.
 * Geometry companion to bounds-config. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';

import {
  createCompleteGraph,
  createGridGraph,
  createTrackGraph,
  DEFAULT_GRAPH_CONFIG,
} from '../../src/core/graph/types';
import { renderGraph } from '../../src/core/graph/graph-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 33 graph-ui-edge-style — stroke config matrix', () => {
  it('custom edgeColor and edgeWidth apply to every line', () => {
    const graph = createCompleteGraph(4);
    const svg = renderGraph(graph, undefined, {
      edgeColor: '#ff8800',
      edgeWidth: 9,
      showLabels: false,
    });
    const lines = svg.querySelectorAll('.edges line');
    expect(lines.length).toBe(graph.edges.length);
    lines.forEach((line) => {
      expect(line.getAttribute('stroke')).toBe('#ff8800');
      expect(line.getAttribute('stroke-width')).toBe('9');
      expect(line.getAttribute('stroke-linecap')).toBe('round');
    });
  });

  it('default edge style matches DEFAULT_GRAPH_CONFIG', () => {
    const graph = createTrackGraph(3);
    const svg = renderGraph(graph);
    svg.querySelectorAll('.edges line').forEach((line) => {
      expect(line.getAttribute('stroke')).toBe(DEFAULT_GRAPH_CONFIG.edgeColor);
      expect(line.getAttribute('stroke-width')).toBe(
        String(DEFAULT_GRAPH_CONFIG.edgeWidth)
      );
    });
  });

  it('every node circle carries data-node-id matching graph keys', () => {
    const graph = createGridGraph(2, 3);
    const svg = renderGraph(graph);
    const ids = [...svg.querySelectorAll('.graph-node')].map(
      (n) => (n as SVGElement).dataset.nodeId
    );
    expect(ids.sort()).toEqual([...graph.nodes.keys()].sort());
  });
});
