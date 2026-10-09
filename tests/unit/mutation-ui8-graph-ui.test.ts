/**
 * q-mp-272 mutation audit UI wave 8 — kill survivors in graph/graph-ui.
 * Structural / timing-structure pins only — no AI move/timing policy asserts.
 * animateMove duration here is decorative UI motion, not AI think time.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';

import { createTrackGraph } from '../../src/core/graph/types';
import { animateMove, renderGraph } from '../../src/core/graph/graph-ui';
import {
  resetSettingsFlagsForTests,
  setUserReducedMotionFlag,
} from '../../src/core/settings-flags';
import { stubRafClock } from '../helpers/raf-clock';

afterEach(() => {
  document.body.innerHTML = '';
  resetSettingsFlagsForTests();
  vi.unstubAllGlobals();
  vi.useRealTimers();
  const nowFn = performance.now as unknown as { mockRestore?: () => void };
  nowFn.mockRestore?.();
});

function stubMatchMedia(matches: boolean): void {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: () =>
      ({
        matches,
        media: '(prefers-color-scheme: light)',
        onchange: null,
        addListener: () => undefined,
        removeListener: () => undefined,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        dispatchEvent: () => false,
      }) satisfies MediaQueryList,
  });
}

describe('mutation-ui8 graph-ui', () => {
  it('user reduced-motion flag forces immediate animateMove settle (kills L18 true→false)', async () => {
    // Survivor: return true → return false inside getUserReducedMotionFlag branch.
    stubRafClock();
    setUserReducedMotionFlag(true);
    stubMatchMedia(false);
    const graph = createTrackGraph(2);
    const svg = renderGraph(graph);
    document.body.appendChild(svg);
    let resolved = false;
    const done = animateMove(svg, ['t0', 't1'], graph, 500).then(() => {
      resolved = true;
    });
    await vi.advanceTimersByTimeAsync(64);
    await done;
    expect(resolved).toBe(true);
  });

  it('OS matchMedia reduce settles immediately when user flag false (kills L21/L22 typeof flips)', async () => {
    // Survivors: typeof window === → !== ; matchMedia !== → === — skip matches read.
    stubRafClock();
    setUserReducedMotionFlag(false);
    stubMatchMedia(true);
    const graph = createTrackGraph(2);
    const svg = renderGraph(graph);
    document.body.appendChild(svg);
    let resolved = false;
    const done = animateMove(svg, ['t0', 't1'], graph, 500).then(() => {
      resolved = true;
    });
    await vi.advanceTimersByTimeAsync(64);
    await done;
    expect(resolved).toBe(true);
  });

  it('missing matchMedia does not force reduced motion (kills L24 false→true)', async () => {
    // Survivor: return false → true when matchMedia missing.
    stubRafClock();
    setUserReducedMotionFlag(false);
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: undefined,
    });
    const graph = createTrackGraph(2);
    const svg = renderGraph(graph);
    document.body.appendChild(svg);
    let resolved = false;
    const done = animateMove(svg, ['t0', 't1'], graph, 500).then(() => {
      resolved = true;
    });
    await vi.advanceTimersByTimeAsync(64);
    expect(resolved).toBe(false);
    await vi.advanceTimersByTimeAsync(2000);
    await done;
    expect(resolved).toBe(true);
  });

  it('matchMedia throw does not force reduced motion (kills L29 false→true)', async () => {
    // Survivor: catch return false → true.
    stubRafClock();
    setUserReducedMotionFlag(false);
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: () => {
        throw new Error('mql boom');
      },
    });
    const graph = createTrackGraph(2);
    const svg = renderGraph(graph);
    document.body.appendChild(svg);
    let resolved = false;
    const done = animateMove(svg, ['t0', 't1'], graph, 500).then(() => {
      resolved = true;
    });
    await vi.advanceTimersByTimeAsync(64);
    expect(resolved).toBe(false);
    await vi.advanceTimersByTimeAsync(2000);
    await done;
    expect(resolved).toBe(true);
  });
});
