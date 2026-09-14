/**
 * Overnight HEAVY leftover after #256 — showLabels skips nodes without label.
 * Distinct from wave33 all-labeled circular and wave52 value-without-labels.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import type { Graph } from '../../src/core/graph/types';
import { renderGraph } from '../../src/core/graph/graph-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 56 core graph — unlabeled skip text', () => {
  it('showLabels true emits text only for labeled sibling', () => {
    const graph: Graph = {
      nodes: new Map([
        ['a', { id: 'a', label: 'A', position: { x: 0, y: 0 } }],
        ['b', { id: 'b', position: { x: 40, y: 0 } }],
      ]),
      edges: [],
      directed: false,
    };
    const svg = renderGraph(graph, undefined, { showLabels: true });
    const texts = [...svg.querySelectorAll('.nodes text')].map(
      (t) => t.textContent
    );
    expect(texts).toEqual(['A']);
  });
});
