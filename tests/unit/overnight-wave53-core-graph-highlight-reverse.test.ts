/**
 * Overnight HEAVY leftover after #241 — highlightPath reverse-order uses data-to/from swap.
 * Distinct from wave33 bidir + wave52 empty-bounds. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { renderGraph, highlightPath } from '../../src/core/graph/graph-ui';
import { createTrackGraph } from '../../src/core/graph/types';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 53 core graph-ui — highlight reverse hop', () => {
  it('t2→t0 reverse walk still thickens the same undirected lines', () => {
    const graph = createTrackGraph(3);
    const svg = renderGraph(graph);
    const before = [...svg.querySelectorAll('line')].map((l) =>
      l.getAttribute('stroke-width')
    );
    highlightPath(svg, ['t2', 't1', 't0'], '#ff00aa');
    const after = [...svg.querySelectorAll('line')].map((el) => ({
      from: el.getAttribute('data-from'),
      to: el.getAttribute('data-to'),
      width: el.getAttribute('stroke-width'),
      stroke: el.getAttribute('stroke'),
    }));
    expect(before.every((w) => w !== '5')).toBe(true);
    expect(after.every((e) => e.width === '5')).toBe(true);
    expect(after.every((e) => e.stroke === '#ff00aa')).toBe(true);
  });
});
