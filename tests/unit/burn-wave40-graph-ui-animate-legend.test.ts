/**
 * Wave 40 — graph-ui animateMove duration0 + legend + styles idempotent leftovers.
 * Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  createTrackGraph,
  DEFAULT_GRAPH_CONFIG,
} from '../../src/core/graph/types';
import {
  animateMove,
  createGraphLegend,
  injectGraphStyles,
  renderGraph,
} from '../../src/core/graph/graph-ui';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('graph-styles')?.remove();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('Wave 40 graph-ui — animate duration0 + legend + styles', () => {
  it('animateMove with duration 0 completes without leftover marker', async () => {
    vi.useFakeTimers();
    const graph = createTrackGraph(3);
    const svg = renderGraph(graph);
    const done = animateMove(svg, ['t0', 't1', 't2'], graph, 0);
    await vi.advanceTimersByTimeAsync(50);
    await expect(done).resolves.toBeUndefined();
    expect(
      [...svg.querySelectorAll('circle')].filter(
        (c) => !(c as SVGElement).dataset.nodeId
      )
    ).toHaveLength(0);
  });

  it('empty and single-node animateMove resolve immediately', async () => {
    const graph = createTrackGraph(2);
    const svg = renderGraph(graph);
    await expect(animateMove(svg, [], graph, 0)).resolves.toBeUndefined();
    await expect(animateMove(svg, ['t0'], graph, 0)).resolves.toBeUndefined();
  });

  it('createGraphLegend lists Empty / Player 1 / Player 2 / Valid Move', () => {
    const legend = createGraphLegend();
    expect(legend.className).toBe('graph-legend');
    const text = legend.textContent ?? '';
    expect(text).toContain('Empty');
    expect(text).toContain('Player 1');
    expect(text).toContain('Player 2');
    expect(text).toContain('Valid Move');
    expect(legend.children).toHaveLength(4);
  });

  it('legend honors custom nodeColors', () => {
    const nodeColors = {
      ...DEFAULT_GRAPH_CONFIG.nodeColors,
      player1: '#112233',
      highlighted: '#ff00aa',
    };
    const legend = createGraphLegend({ nodeColors });
    const items = [...legend.querySelectorAll(':scope > div')];
    expect(items).toHaveLength(4);
    const backgrounds = items.map(
      (el) =>
        (el.querySelector('span:first-child') as HTMLElement).style.background
    );
    const probe = (hex: string) => {
      const span = document.createElement('span');
      span.style.background = hex;
      document.body.appendChild(span);
      const resolved = getComputedStyle(span).backgroundColor;
      span.remove();
      return resolved;
    };
    expect(probe(backgrounds[1])).toBe(probe('#112233'));
    expect(probe(backgrounds[3])).toBe(probe('#ff00aa'));
  });

  it('injectGraphStyles is idempotent by style id', () => {
    injectGraphStyles();
    injectGraphStyles();
    expect(document.querySelectorAll('#graph-styles')).toHaveLength(1);
    expect(document.getElementById('graph-styles')?.textContent).toContain(
      '.graph-node'
    );
  });
});
