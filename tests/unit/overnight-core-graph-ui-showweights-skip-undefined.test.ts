/**
 * Overnight TOKENMAXX — showWeights skips edges without weight field.
 * Tests-only. After #214/#215.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { renderGraph } from '../../src/core/graph/graph-ui';
import { createTrackGraph, type GraphEdge } from '../../src/core/graph/types';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Overnight core graph-ui — showWeights skip undefined', () => {
  it('unweighted track emits no edge weight texts even when showWeights true', () => {
    const g = createTrackGraph(4);
    const svg = renderGraph(g, undefined, {
      showWeights: true,
      showLabels: false,
    });
    expect(svg.querySelectorAll('.edges text')).toHaveLength(0);
    expect(svg.querySelectorAll('line')).toHaveLength(3);
  });

  it('only weighted edges emit mid-edge labels', () => {
    const g = createTrackGraph(4);
    g.edges = g.edges.map((e, i): GraphEdge =>
      i === 1 ? { ...e, weight: 42 } : { ...e }
    );
    const svg = renderGraph(g, undefined, {
      showWeights: true,
      showLabels: false,
    });
    const texts = [...svg.querySelectorAll('.edges text')].map((t) => t.textContent);
    expect(texts).toEqual(['42']);
  });
});
