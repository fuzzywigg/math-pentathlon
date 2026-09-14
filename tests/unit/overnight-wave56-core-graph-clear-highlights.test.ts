/**
 * Overnight HEAVY leftover after #256 — graph clearHighlights restores strokes.
 * Distinct from alignment clearHighlights overnight. Tests-only.
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

describe('Wave 56 core graph-ui — clear highlights', () => {
  it('clearHighlights restores default node stroke after path highlight', () => {
    const graph = createTrackGraph(3);
    const svg = renderGraph(graph);
    document.body.appendChild(svg);
    highlightPath(svg, ['t0', 't1', 't2']);
    const mid = svg.querySelector(
      'circle[data-node-id="t1"]'
    ) as SVGCircleElement;
    expect(mid.getAttribute('stroke')).toBe(
      DEFAULT_GRAPH_CONFIG.nodeColors.highlighted
    );
    clearHighlights(svg);
    // clearHighlights hardcodes node stroke #333 (not nodeColors.default)
    expect(mid.getAttribute('stroke')).toBe('#333');
    expect(mid.getAttribute('stroke-width')).toBe('2');
  });
});
