/**
 * Wave 40 — graph UI legend / valid moves / animate leftovers after #176.
 * Tests-only.
 *
 * animateMove is RAF + performance.now driven. Under isolate:false shuffle,
 * a prior file can leave fake timers or a performance.now spy that makes
 * wall-clock awaits hang until testTimeout. Drive the clock deterministically
 * (same pattern as burn-wave33 / overnight-wave57 graph animate tests).
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createCircularGraph } from '../../src/core/graph/types';
import { createGraphLegend, showValidMoves, animateMove, renderGraph, injectGraphStyles } from '../../src/core/graph/graph-ui';
import type { GraphBoard } from '../../src/core/graph/types';

import { stubRafClock } from '../helpers/raf-clock';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('graph-styles')?.remove();
  vi.unstubAllGlobals();
  vi.useRealTimers();
  // Targeted restore only — restoreAllMocks tears down hoisted vi.mock
  // factories (e.g. router.navigate) across the shared isolate:false graph.
  const nowFn = performance.now as unknown as { mockRestore?: () => void };
  nowFn.mockRestore?.();
});

describe('Wave 40 graph UI — legend / valids / animate', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('graph-styles')?.remove();
  });

  it('createGraphLegend has empty + player labels', () => {
    const legend = createGraphLegend();
    expect(legend.className).toBe('graph-legend');
    expect(legend.textContent).toContain('Empty');
    expect(legend.textContent).toContain('Player 1');
    expect(legend.textContent).toContain('Valid Move');
  });

  it('showValidMoves marks neighbors; animateMove settles short path', async () => {
    stubRafClock();
    injectGraphStyles();
    const graph = createCircularGraph(4, 40);
    const svg = renderGraph(graph);
    document.body.appendChild(svg);
    const board: GraphBoard = { graph, nodeStates: new Map() };
    showValidMoves(svg, graph, 'n0', board);
    const stroked = Array.from(
      svg.querySelectorAll('circle[data-node-id]')
    ).filter((el) => el.getAttribute('stroke-dasharray'));
    expect(stroked.length).toBeGreaterThan(0);
    const done = animateMove(svg, ['n0', 'n1'], graph, 20);
    await vi.advanceTimersByTimeAsync(500);
    await expect(done).resolves.toBeUndefined();
    expect(svg.querySelectorAll('circle[fill="#ff9800"]')).toHaveLength(0);
  });
});
