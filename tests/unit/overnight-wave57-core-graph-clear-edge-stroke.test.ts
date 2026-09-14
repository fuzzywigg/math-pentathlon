/**
 * Overnight HEAVY leftover after #264 — clearHighlights restores edge stroke/width.
 * Distinct from wave56 node stroke #333 restore. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import {
  createTrackGraph,
  renderGraph,
  highlightPath,
  clearHighlights,
  DEFAULT_GRAPH_CONFIG,
} from '../../src/core/graph';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 57 core graph-ui — clear edge stroke', () => {
  it('edge stroke returns to default after path highlight', () => {
    const graph = createTrackGraph(3);
    const svg = renderGraph(graph);
    highlightPath(svg, ['t0', 't1', 't2']);
    const edge = svg.querySelector(
      'line[data-from="t0"][data-to="t1"]'
    ) as SVGLineElement;
    expect(edge.getAttribute('stroke-width')).toBe('5');
    clearHighlights(svg);
    expect(edge.getAttribute('stroke')).toBe(DEFAULT_GRAPH_CONFIG.edgeColor);
    expect(edge.getAttribute('stroke-width')).toBe(
      String(DEFAULT_GRAPH_CONFIG.edgeWidth)
    );
  });
});
