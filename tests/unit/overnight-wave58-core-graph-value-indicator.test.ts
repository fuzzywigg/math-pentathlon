/**
 * Overnight HEAVY leftover after #274 — node state.value renders below circle.
 * Distinct from wave57 player2 fill+label. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createTrackGraph, renderGraph } from '../../src/core/graph';
import { DEFAULT_GRAPH_CONFIG } from '../../src/core/graph';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 58 core graph-ui — value indicator', () => {
  it('value text sits at y + nodeRadius + 14 with font-size 11', () => {
    const g = createTrackGraph(1);
    const states = new Map([['t0', { value: 42 }]]);
    const svg = renderGraph(g, states, { showLabels: false });
    const node = g.nodes.get('t0')!;
    const texts = [...svg.querySelectorAll('.nodes text')];
    const valueText = texts.find((t) => t.textContent === '42') as SVGTextElement;
    expect(valueText).toBeTruthy();
    expect(valueText.getAttribute('font-size')).toBe('11');
    // Absolute y includes padding/offset — assert relative to circle cy
    const circle = svg.querySelector(
      'circle[data-node-id="t0"]'
    ) as SVGCircleElement;
    const cy = Number(circle.getAttribute('cy'));
    expect(Number(valueText.getAttribute('y'))).toBe(
      cy + DEFAULT_GRAPH_CONFIG.nodeRadius + 14
    );
  });
});
