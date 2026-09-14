/**
 * Overnight HEAVY leftover after #234 — showWeights renders weight 0 as text "0".
 * Distinct from overnight-core-graph-ui-showweights-skip-undefined. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { renderGraph } from '../../src/core/graph/graph-ui';
import type { Graph } from '../../src/core/graph/types';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 52 core graph-ui — weight zero label', () => {
  it('edge weight 0 appears in .edges text when showWeights', () => {
    const g: Graph = {
      nodes: new Map([
        ['a', { id: 'a', position: { x: 0, y: 0 }, label: 'A' }],
        ['b', { id: 'b', position: { x: 80, y: 0 }, label: 'B' }],
      ]),
      directed: false,
      edges: [{ from: 'a', to: 'b', weight: 0 }],
    };
    const svg = renderGraph(g, undefined, { showWeights: true, showLabels: false });
    const texts = [...svg.querySelectorAll('.edges text')].map((t) => t.textContent);
    expect(texts).toContain('0');
  });
});
