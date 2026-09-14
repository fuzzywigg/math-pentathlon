/**
 * Overnight HEAVY leftover after #256 — owner ∉ {1,2} keeps default fill.
 * Distinct from wave33 owner 1/2 and wave52 owner:0 valid-moves. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createTrackGraph, DEFAULT_GRAPH_CONFIG } from '../../src/core/graph/types';
import { renderGraph } from '../../src/core/graph/graph-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 56 core graph — owner other default fill', () => {
  it('owner 3 uses default node color not player fills', () => {
    const graph = createTrackGraph(2);
    const states = new Map([['t0', { owner: 3 }]]);
    const svg = renderGraph(graph, states);
    const fill = svg
      .querySelector('circle[data-node-id="t0"]')
      ?.getAttribute('fill');
    expect(fill).toBe(DEFAULT_GRAPH_CONFIG.nodeColors.default);
    expect(fill).toBe('#e0e0e0');
    expect(fill).not.toBe(DEFAULT_GRAPH_CONFIG.nodeColors.player1);
    expect(fill).not.toBe(DEFAULT_GRAPH_CONFIG.nodeColors.player2);
  });
});
