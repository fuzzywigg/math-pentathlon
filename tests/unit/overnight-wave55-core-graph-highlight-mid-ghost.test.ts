/**
 * Overnight HEAVY leftover after #250 — highlightPath paints reverse stored
 * data-from/to and skips a missing mid hop without wiping earlier strokes.
 * Distinct from wave53 reverse-order + wave39 ghost ids. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { renderGraph, highlightPath } from '../../src/core/graph/graph-ui';
import { createTrackGraph } from '../../src/core/graph/types';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 55 core graph — highlight skip mid hop', () => {
  it('t0-ghost-t2 leaves t0 stroke default; t2 still highlighted as a node', () => {
    const graph = createTrackGraph(3);
    const svg = renderGraph(graph);
    document.body.appendChild(svg);
    highlightPath(svg, ['t0', 'ghost', 't2'], '#00ff88');
    const t0 = svg.querySelector('circle[data-node-id="t0"]') as SVGElement;
    const t2 = svg.querySelector('circle[data-node-id="t2"]') as SVGElement;
    expect(t0.getAttribute('stroke')).toBe('#00ff88');
    expect(t2.getAttribute('stroke')).toBe('#00ff88');
    const line01 = svg.querySelector('line[data-from="t0"][data-to="t1"]');
    expect(line01?.getAttribute('stroke')).not.toBe('#00ff88');
  });
});
