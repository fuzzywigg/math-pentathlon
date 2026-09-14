/**
 * Overnight HEAVY leftover after #274 — showWeights renders positive weight text.
 * Distinct from wave52 weight-0 label. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { renderGraph } from '../../src/core/graph';
import type { Graph } from '../../src/core/graph';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 58 core graph-ui — showWeights positive', () => {
  it('edge weight 7 appears as mid-edge text', () => {
    const g: Graph = {
      nodes: new Map([
        ['a', { id: 'a', position: { x: 0, y: 0 }, label: 'A' }],
        ['b', { id: 'b', position: { x: 80, y: 0 }, label: 'B' }],
      ]),
      directed: false,
      edges: [{ from: 'a', to: 'b', weight: 7 }],
    };
    const svg = renderGraph(g, undefined, {
      showWeights: true,
      showLabels: false,
    });
    const texts = [...svg.querySelectorAll('.edges text')].map(
      (t) => t.textContent
    );
    expect(texts).toContain('7');
  });
});
