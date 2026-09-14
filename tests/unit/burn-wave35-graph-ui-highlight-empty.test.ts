/**
 * Wave 35 — highlightPath / clearHighlights empty-path leftovers.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';

import { createTrackGraph, DEFAULT_GRAPH_CONFIG } from '../../src/core/graph';
import {
  renderGraph,
  highlightPath,
  clearHighlights,
} from '../../src/core/graph';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 35 graph-ui-hl-empty — short paths no-op', () => {
  it('empty and single-node paths do not thicken edges', () => {
    const graph = createTrackGraph(4);
    const svg = renderGraph(graph);
    const before = [...svg.querySelectorAll('line')].map((l) =>
      l.getAttribute('stroke-width')
    );
    highlightPath(svg, []);
    highlightPath(svg, ['t0']);
    const after = [...svg.querySelectorAll('line')].map((l) =>
      l.getAttribute('stroke-width')
    );
    expect(after).toEqual(before);
  });

  it('clearHighlights after empty highlight restores default width', () => {
    const graph = createTrackGraph(3);
    const svg = renderGraph(graph);
    highlightPath(svg, []);
    clearHighlights(svg);
    svg.querySelectorAll('line').forEach((edge) => {
      expect(edge.getAttribute('stroke-width')).toBe(
        String(DEFAULT_GRAPH_CONFIG.edgeWidth)
      );
    });
  });
});
