/**
 * Overnight HEAVY leftover after #264 — animateMove path length ≥ 2 resolves.
 * Distinct from wave56 early-resolve path length < 2. Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import {
  createTrackGraph,
  renderGraph,
  animateMove,
} from '../../src/core/graph';

afterEach(() => {
  document.body.innerHTML = '';
  vi.unstubAllGlobals();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

function stubRafClock(): void {
  vi.useFakeTimers();
  let now = 0;
  vi.spyOn(performance, 'now').mockImplementation(() => now);
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
    return setTimeout(() => {
      now += 16;
      cb(now);
    }, 16) as unknown as number;
  });
}

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
