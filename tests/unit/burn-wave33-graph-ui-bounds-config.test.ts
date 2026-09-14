/**
 * Wave 33 — graph-ui viewBox / padding / radius config matrix.
 * Deepens wave 22 render smoke into measurable SVG geometry.
 * Distinct from #156 dice / wave 27 graph algorithms. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';

import {
  createCircularGraph,
  createGridGraph,
  createTrackGraph,
  DEFAULT_GRAPH_CONFIG,
} from '../../src/core/graph/types';
import { renderGraph } from '../../src/core/graph/graph-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 33 graph-ui-bounds — padding × radius matrix', () => {
  it('viewBox grows with padding and nodeRadius for a 1×2 track', () => {
    const graph = createTrackGraph(2, 100);
    // nodes at x=0 and x=100, y=0 → spanX=100, spanY=0
    for (const padding of [10, 40, 80]) {
      for (const nodeRadius of [5, 20, 30]) {
        const svg = renderGraph(graph, undefined, { padding, nodeRadius });
        const expectedW = 100 + padding * 2 + nodeRadius * 2;
        const expectedH = 0 + padding * 2 + nodeRadius * 2;
        expect(svg.getAttribute('width')).toBe(String(expectedW));
        expect(svg.getAttribute('height')).toBe(String(expectedH));
        expect(svg.getAttribute('viewBox')).toBe(
          `0 0 ${expectedW} ${expectedH}`
        );
      }
    }
  });

  it('circular graph size matches node bounding box + padding + radius', () => {
    const radius = 80;
    const graph = createCircularGraph(6, radius);
    const cfg = { padding: 20, nodeRadius: 12 };
    const xs = [...graph.nodes.values()].map((n) => n.position.x);
    const ys = [...graph.nodes.values()].map((n) => n.position.y);
    const spanX = Math.max(...xs) - Math.min(...xs);
    const spanY = Math.max(...ys) - Math.min(...ys);
    const svg = renderGraph(graph, undefined, cfg);
    expect(Number(svg.getAttribute('width'))).toBeCloseTo(
      spanX + cfg.padding * 2 + cfg.nodeRadius * 2,
      5
    );
    expect(Number(svg.getAttribute('height'))).toBeCloseTo(
      spanY + cfg.padding * 2 + cfg.nodeRadius * 2,
      5
    );
  });

  it('default config matches DEFAULT_GRAPH_CONFIG geometry on a grid', () => {
    const graph = createGridGraph(2, 2, 50);
    const svg = renderGraph(graph);
    const { padding, nodeRadius } = DEFAULT_GRAPH_CONFIG;
    // span 50×50
    const expected = 50 + padding * 2 + nodeRadius * 2;
    expect(svg.getAttribute('width')).toBe(String(expected));
    expect(svg.getAttribute('height')).toBe(String(expected));
  });
});
