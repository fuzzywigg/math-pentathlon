/**
 * Overnight TOKENMAXX — highlightPath with 0/1 node paths is a no-op on edges.
 * Tests-only. After #214/#215.
 */
import { describe, it, expect, afterEach } from 'vitest';
import {
  renderGraph,
  highlightPath,
  clearHighlights,
} from '../../src/core/graph/graph-ui';
import { createTrackGraph, DEFAULT_GRAPH_CONFIG } from '../../src/core/graph/types';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Overnight core graph-ui — highlight short paths', () => {
  it('empty and single-node highlightPath leave edge strokes default', () => {
    const g = createTrackGraph(3);
    const svg = renderGraph(g);
    highlightPath(svg, []);
    highlightPath(svg, ['t1']);
    for (const line of svg.querySelectorAll('line')) {
      expect(line.getAttribute('stroke')).toBe(DEFAULT_GRAPH_CONFIG.edgeColor);
      expect(line.getAttribute('stroke-width')).toBe(
        String(DEFAULT_GRAPH_CONFIG.edgeWidth)
      );
    }
  });

  it('clearHighlights restores after a real path highlight', () => {
    const g = createTrackGraph(3);
    const svg = renderGraph(g);
    highlightPath(svg, ['t0', 't1', 't2'], '#ff00aa');
    const mid = svg.querySelector('line[data-from="t0"][data-to="t1"]');
    expect(mid?.getAttribute('stroke')).toBe('#ff00aa');
    clearHighlights(svg);
    expect(mid?.getAttribute('stroke')).toBe(DEFAULT_GRAPH_CONFIG.edgeColor);
  });
});
