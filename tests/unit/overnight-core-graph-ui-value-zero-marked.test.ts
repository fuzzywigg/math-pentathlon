/**
 * Overnight TOKENMAXX — state.value 0 still renders; marked flag is inert for fill.
 * Tests-only. After #214/#215.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { renderGraph } from '../../src/core/graph/graph-ui';
import {
  createTrackGraph,
  DEFAULT_GRAPH_CONFIG,
  type NodeState,
} from '../../src/core/graph/types';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Overnight core graph-ui — value zero / marked', () => {
  it('value 0 renders as text "0"', () => {
    const g = createTrackGraph(2);
    const states = new Map<string, NodeState>([['t0', { value: 0 }]]);
    const svg = renderGraph(g, states, { showLabels: false });
    const texts = [...svg.querySelectorAll('.nodes text')].map((t) => t.textContent);
    expect(texts).toContain('0');
  });

  it('marked alone does not change fill (stays default)', () => {
    const g = createTrackGraph(2);
    const states = new Map<string, NodeState>([['t0', { marked: true }]]);
    const svg = renderGraph(g, states);
    const fill = svg
      .querySelector('circle[data-node-id="t0"]')
      ?.getAttribute('fill');
    expect(fill).toBe(DEFAULT_GRAPH_CONFIG.nodeColors.default);
  });
});
