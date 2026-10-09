/**
 * q-mp-117 / burn-1008-mp-ui-helper-dedupe — generation-gate characterization.
 *
 * Preflight soft hold #2 (alpha-landing-preflight-2026-10-08 §6): real
 * `setTimeout(10/30)` awaits in this file timed out under full-suite load.
 * Drive with fake timers; keep the file in `unit-isolated` (vitest.config).
 * Do not raise Vitest / CI timeouts. No AI timing or player-facing copy pins.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  bumpGeneration,
  clearGenerationTimeout,
  clearNullableTimeout,
  createGenerationTimeoutHandle,
  scheduleGenerationGated,
  scheduleGenerationTimeout,
} from '../../src/ui/timeout-handle';

describe('ui-helper-dedupe characterization — timeout handle', () => {
  // Real-timer awaits flake under full-suite load (CI 30s timeouts). Drive
  // these with fake timers; do not raise the Vitest timeout.
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    try {
      vi.clearAllTimers();
    } catch {
      // ignore when timers are already real
    }
    vi.useRealTimers();
  });

  it('clearNullableTimeout clears and returns null', () => {
    let ran = false;
    const id = setTimeout(() => {
      ran = true;
    }, 50);
    expect(clearNullableTimeout(id)).toBeNull();
    expect(clearNullableTimeout(null)).toBeNull();
    expect(ran).toBe(false);
  });

  it('generation gate drops stale callbacks', async () => {
    const handle = createGenerationTimeoutHandle();
    let count = 0;
    scheduleGenerationTimeout(
      handle,
      () => {
        count += 1;
      },
      10
    );
    bumpGeneration(handle);
    await vi.advanceTimersByTimeAsync(30);
    expect(count).toBe(0);

    scheduleGenerationTimeout(
      handle,
      () => {
        count += 1;
      },
      10
    );
    await vi.advanceTimersByTimeAsync(30);
    expect(count).toBe(1);
    clearGenerationTimeout(handle);
  });

  it('scheduleGenerationGated matches separate timer/generation bindings', async () => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    let generation = 0;
    let count = 0;
    const clearTimer = () => {
      timer = clearNullableTimeout(timer);
    };
    scheduleGenerationGated(
      {
        clearTimer,
        setTimer: (t) => {
          timer = t;
        },
        getGeneration: () => generation,
      },
      () => {
        count += 1;
      },
      10
    );
    generation += 1;
    await vi.advanceTimersByTimeAsync(30);
    expect(count).toBe(0);
    scheduleGenerationGated(
      {
        clearTimer,
        setTimer: (t) => {
          timer = t;
        },
        getGeneration: () => generation,
      },
      () => {
        count += 1;
      },
      10
    );
    await vi.advanceTimersByTimeAsync(30);
    expect(count).toBe(1);
    clearTimer();
  });
});
