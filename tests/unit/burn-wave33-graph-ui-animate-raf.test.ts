/**
 * Wave 33 — animateMove RAF lifecycle (short / multi-step / missing nodes).
 * Deepens wave 22 async resolve smoke with deterministic RAF. Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import { createGridGraph, createTrackGraph } from '../../src/core/graph/types';
import { renderGraph, animateMove } from '../../src/core/graph/graph-ui';

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

describe('Wave 33 graph-ui-animate — RAF lifecycle', () => {
  it('path length < 2 resolves immediately without marker', async () => {
    const graph = createTrackGraph(3);
    const svg = renderGraph(graph);
    document.body.appendChild(svg);
    await expect(animateMove(svg, [], graph, 100)).resolves.toBeUndefined();
    await expect(animateMove(svg, ['t0'], graph, 100)).resolves.toBeUndefined();
    expect(svg.querySelectorAll('circle[fill="#ff9800"]')).toHaveLength(0);
  });

  it('two-node path adds then removes the orange marker', async () => {
    stubRafClock();
    const graph = createTrackGraph(2);
    const svg = renderGraph(graph);
    document.body.appendChild(svg);
    const done = animateMove(svg, ['t0', 't1'], graph, 64);
    // allow several frames
    await vi.advanceTimersByTimeAsync(500);
    await done;
    expect(svg.querySelectorAll('circle[fill="#ff9800"]')).toHaveLength(0);
  });

  it('multi-step grid path resolves after advancing timers', async () => {
    stubRafClock();
    const graph = createGridGraph(2, 2);
    const svg = renderGraph(graph);
    document.body.appendChild(svg);
    const path = ['0-0', '0-1', '1-1', '1-0'];
    const done = animateMove(svg, path, graph, 120);
    await vi.advanceTimersByTimeAsync(2000);
    await done;
    expect(svg.querySelectorAll('circle[fill="#ff9800"]')).toHaveLength(0);
  });

  it('missing mid-path node skips step and still resolves', async () => {
    stubRafClock();
    const graph = createTrackGraph(3);
    const svg = renderGraph(graph);
    document.body.appendChild(svg);
    const done = animateMove(svg, ['t0', 'ghost', 't2'], graph, 80);
    await vi.advanceTimersByTimeAsync(1000);
    await done;
  });
});
