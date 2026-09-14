/**
 * Overnight HEAVY leftover after #264 — render fill priority disabled > highlighted.
 * Distinct from wave56 clearHighlights stroke restore. Tests-only.
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

describe('Wave 57 core graph-ui — disabled beats highlight', () => {
  it('disabled fill wins when highlighted and owned', () => {
    const graph = createTrackGraph(2);
    const svg = renderGraph(
      graph,
      new Map([['t0', { owner: 1, highlighted: true, disabled: true }]])
    );
    const node = svg.querySelector(
      'circle[data-node-id="t0"]'
    ) as SVGCircleElement;
    expect(node.getAttribute('fill')).toBe(
      DEFAULT_GRAPH_CONFIG.nodeColors.disabled
    );
  });
});
