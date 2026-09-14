/**
 * Wave 33 — highlightPath bidirectional lookup + missing path nodes.
 * Deepens wave 22 forward-only track highlight. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';

import {
  createCircularGraph,
  createGridGraph,
  createTrackGraph,
  DEFAULT_GRAPH_CONFIG,
} from '../../src/core/graph/types';
import {
  highlightPath,
  clearHighlights,
  renderGraph,
} from '../../src/core/graph/graph-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 33 graph-ui-highlight — bidirectional + gaps', () => {
  it('finds reverse-stored edges when path walks opposite direction', () => {
    const graph = createTrackGraph(3);
    // edges stored as t0→t1, t1→t2; walk t2→t1→t0
    const svg = renderGraph(graph);
    highlightPath(svg, ['t2', 't1', 't0'], '#ff00aa');

    const e01 = svg.querySelector(
      'line[data-from="t0"][data-to="t1"]'
    ) as SVGElement;
    const e12 = svg.querySelector(
      'line[data-from="t1"][data-to="t2"]'
    ) as SVGElement;
    expect(e01.getAttribute('stroke')).toBe('#ff00aa');
    expect(e01.getAttribute('stroke-width')).toBe('5');
    expect(e12.getAttribute('stroke')).toBe('#ff00aa');
    expect(e12.getAttribute('stroke-width')).toBe('5');

    for (const id of ['t0', 't1', 't2']) {
      const node = svg.querySelector(
        `circle[data-node-id="${id}"]`
      ) as SVGElement;
      expect(node.getAttribute('stroke')).toBe('#ff00aa');
      expect(node.getAttribute('stroke-width')).toBe('4');
    }
  });

  it('default highlight color is #4caf50 when omitted', () => {
    const graph = createCircularGraph(4);
    const svg = renderGraph(graph);
    highlightPath(svg, ['n0', 'n1']);
    const edge = svg.querySelector(
      'line[data-from="n0"][data-to="n1"]'
    ) as SVGElement;
    expect(edge.getAttribute('stroke')).toBe('#4caf50');
  });

  it('unknown path nodes are skipped without throwing', () => {
    const graph = createGridGraph(2, 2);
    const svg = renderGraph(graph);
    expect(() =>
      highlightPath(svg, ['0-0', 'ghost', '0-1', 'missing'])
    ).not.toThrow();
    // real edges that exist between consecutive known pairs still highlight
    // '0-0'→'ghost' finds nothing; 'ghost'→'0-1' nothing; '0-1'→'missing' nothing
    const anyThick = [...svg.querySelectorAll('line')].some(
      (l) => l.getAttribute('stroke-width') === '5'
    );
    expect(anyThick).toBe(false);
  });

  it('clearHighlights restores default edge/node strokes after path', () => {
    const graph = createTrackGraph(3);
    const svg = renderGraph(graph);
    highlightPath(svg, ['t0', 't1', 't2'], '#111');
    clearHighlights(svg);
    svg.querySelectorAll('line').forEach((edge) => {
      expect(edge.getAttribute('stroke')).toBe(DEFAULT_GRAPH_CONFIG.edgeColor);
      expect(edge.getAttribute('stroke-width')).toBe(
        String(DEFAULT_GRAPH_CONFIG.edgeWidth)
      );
    });
    svg.querySelectorAll('.graph-node').forEach((node) => {
      expect((node as SVGElement).getAttribute('stroke')).toBe('#333');
      expect((node as SVGElement).getAttribute('stroke-width')).toBe('2');
    });
  });
});
