/**
 * Overnight HEAVY leftover after #234 — renderGraph empty node map bounds.
 * Distinct from overnight-core-graph-degenerate-templates (algo-only). Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { renderGraph } from '../../src/core/graph/graph-ui';
import type { Graph } from '../../src/core/graph/types';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 52 core graph-ui — empty bounds', () => {
  it('empty nodes yield SVG with non-finite width/height attributes', () => {
    const g: Graph = {
      nodes: new Map(),
      directed: false,
      edges: [],
    };
    const svg = renderGraph(g);
    const w = Number(svg.getAttribute('width'));
    const h = Number(svg.getAttribute('height'));
    // minX=Infinity → padding math produces Infinity/NaN
    expect(Number.isFinite(w) && Number.isFinite(h)).toBe(false);
  });
});
