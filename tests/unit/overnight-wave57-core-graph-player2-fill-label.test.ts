/**
 * Overnight HEAVY leftover after #264 — owner 2 fill + white label.
 * Distinct from wave56 analysis Blue/Red headings. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import {
  createTrackGraph,
  renderGraph,
  DEFAULT_GRAPH_CONFIG,
} from '../../src/core/graph';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 57 core graph-ui — player2 fill', () => {
  it('owner 2 uses player2 color and white label fill', () => {
    const graph = createTrackGraph(1);
    const svg = renderGraph(graph, new Map([['t0', { owner: 2 }]]));
    const circle = svg.querySelector(
      'circle[data-node-id="t0"]'
    ) as SVGCircleElement;
    expect(circle.getAttribute('fill')).toBe(
      DEFAULT_GRAPH_CONFIG.nodeColors.player2
    );
    const label = svg.querySelector('text') as SVGTextElement;
    expect(label.getAttribute('fill')).toBe('white');
  });
});
