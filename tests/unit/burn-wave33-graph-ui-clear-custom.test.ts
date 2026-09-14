/**
 * Wave 33 — clearHighlights honors custom edgeColor / edgeWidth.
 * Complements highlight-bidir defaults. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';

import { createCompleteGraph, createStarGraph } from '../../src/core/graph/types';
import {
  renderGraph,
  highlightPath,
  clearHighlights,
} from '../../src/core/graph/graph-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 33 graph-ui-clear — custom config restore', () => {
  it('clearHighlights uses provided edgeColor and edgeWidth', () => {
    const graph = createStarGraph(4);
    const custom = { edgeColor: '#abcdef', edgeWidth: 7 };
    const svg = renderGraph(graph, undefined, custom);
    highlightPath(svg, ['center', 'n0', 'center', 'n1'], '#000');
    clearHighlights(svg, custom);
    svg.querySelectorAll('line').forEach((edge) => {
      expect(edge.getAttribute('stroke')).toBe('#abcdef');
      expect(edge.getAttribute('stroke-width')).toBe('7');
    });
  });

  it('clear after complete-graph full path restores every edge', () => {
    const graph = createCompleteGraph(4);
    const svg = renderGraph(graph);
    const ids = [...graph.nodes.keys()];
    highlightPath(svg, ids, '#f0f');
    clearHighlights(svg);
    const thick = [...svg.querySelectorAll('line')].filter(
      (l) => l.getAttribute('stroke-width') === '5'
    );
    expect(thick).toHaveLength(0);
  });
});
