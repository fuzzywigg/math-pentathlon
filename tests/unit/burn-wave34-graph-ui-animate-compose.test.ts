/**
 * Wave 34 — graph-ui animateMove + highlight + clear compose leftovers.
 * Stresses short paths, custom clear config, and missing mid-path nodes.
 * Distinct from wave 33 RAF smoke. Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  createTrackGraph,
  DEFAULT_GRAPH_CONFIG,
} from '../../src/core/graph/types';
import {
  animateMove,
  clearHighlights,
  highlightPath,
  renderGraph,
} from '../../src/core/graph/graph-ui';

afterEach(() => {
  document.body.innerHTML = '';
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('Wave 34 graph-ui-animate-compose — path lifecycle', () => {
  it('path length < 2 resolves immediately without marker', async () => {
    const graph = createTrackGraph(3);
    const svg = renderGraph(graph);
    await expect(animateMove(svg, ['t0'], graph, 50)).resolves.toBeUndefined();
    expect(svg.querySelectorAll('circle').length).toBe(graph.nodes.size);
  });

  it('highlight then clear with custom edge config restores custom stroke', () => {
    const graph = createTrackGraph(4);
    const svg = renderGraph(graph, undefined, {
      edgeColor: '#112233',
      edgeWidth: 7,
    });
    highlightPath(svg, ['t0', 't1', 't2'], '#ff0000');
    expect(
      svg.querySelector('line[data-from="t0"][data-to="t1"]')?.getAttribute(
        'stroke'
      )
    ).toBe('#ff0000');

    clearHighlights(svg, { edgeColor: '#112233', edgeWidth: 7 });
    const edge = svg.querySelector(
      'line[data-from="t0"][data-to="t1"]'
    ) as SVGElement;
    expect(edge.getAttribute('stroke')).toBe('#112233');
    expect(edge.getAttribute('stroke-width')).toBe('7');
    expect(
      svg.querySelector('circle[data-node-id="t1"]')?.getAttribute('stroke')
    ).toBe('#333');
  });

  it('animateMove skips missing mid-path nodes and still completes', async () => {
    vi.useFakeTimers();
    const graph = createTrackGraph(4);
    // Remove a node from the graph map copy used by animate lookup
    const broken = {
      ...graph,
      nodes: new Map(graph.nodes),
    };
    broken.nodes.delete('t1');
    const svg = renderGraph(graph);

    const done = animateMove(svg, ['t0', 't1', 't2'], broken, 90);
    await vi.advanceTimersByTimeAsync(500);
    await expect(done).resolves.toBeUndefined();
    // No leftover animation marker
    expect(
      [...svg.querySelectorAll('circle')].filter(
        (c) => !(c as SVGElement).dataset.nodeId
      )
    ).toHaveLength(0);
    expect(DEFAULT_GRAPH_CONFIG.nodeRadius).toBeGreaterThan(0);
  });
});
