/**
 * Overnight HEAVY leftover after #264 — animateMove path length ≥ 2 resolves.
 * Distinct from wave56 early-resolve path length < 2. Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { createTrackGraph } from '../../src/core/graph/types';
import { renderGraph, animateMove } from '../../src/core/graph/graph-ui';

import { stubRafClock } from '../helpers/raf-clock';

afterEach(() => {
  document.body.innerHTML = '';
  vi.unstubAllGlobals();
  vi.useRealTimers();
  // Targeted only — restoreAllMocks breaks hoisted vi.mock on isolate:false.
  const nowFn = performance.now as unknown as { mockRestore?: () => void };
  nowFn.mockRestore?.();
});

describe('Wave 57 core graph-ui — animate two-hop', () => {
  it('two-node path animates then removes marker', async () => {
    stubRafClock();
    const graph = createTrackGraph(2);
    const svg = renderGraph(graph);
    document.body.appendChild(svg);
    const done = animateMove(svg, ['t0', 't1'], graph, 48);
    await vi.advanceTimersByTimeAsync(200);
    await expect(done).resolves.toBeUndefined();
    expect(svg.querySelectorAll('circle[fill="#ff9800"]').length).toBe(0);
  });
});
