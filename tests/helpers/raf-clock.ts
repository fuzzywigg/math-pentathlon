/**
 * Deterministic RAF + performance.now clock for graph-ui animateMove tests.
 * Pair with afterEach: vi.unstubAllGlobals(), vi.useRealTimers(), and
 * targeted performance.now mockRestore (avoid restoreAllMocks under isolate:false).
 */
import { vi } from 'vitest';

/** Fake timers + 16ms RAF steps advancing performance.now. */
export function stubRafClock(): void {
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
