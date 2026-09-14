/**
 * Overnight HEAVY leftover after #234 — value indicator independent of showLabels.
 * Distinct from overnight-core-graph-ui-value-zero-marked (track + value 0). Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { renderGraph } from '../../src/core/graph/graph-ui';
import type { Graph, NodeState } from '../../src/core/graph/types';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 52 core graph-ui — value without labels', () => {
  it('showLabels false keeps value text but omits node.label', () => {
    const g: Graph = {
      nodes: new Map([
        ['a', { id: 'a', position: { x: 0, y: 0 }, label: 'Alpha' }],
      ]),
      directed: false,
      edges: [],
    };
    const states = new Map<string, NodeState>([['a', { value: 7 }]]);
    const svg = renderGraph(g, states, { showLabels: false });
    const texts = [...svg.querySelectorAll('.nodes text')].map((t) => t.textContent);
    expect(texts).toContain('7');
    expect(texts).not.toContain('Alpha');
  });
});
