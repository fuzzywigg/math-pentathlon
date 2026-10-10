/**
 * q-mp-350 mutation audit UI wave 11 — structural re-pins for timeout-handle.
 * All 6 mutants already killed at baseline; re-pin generation / null / clear arms.
 * No AI timing assertions — only generation-gate / clear semantics.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  bumpGeneration,
  clearGenerationTimeout,
  clearNullableTimeout,
  createGenerationTimeoutHandle,
  scheduleGenerationGated,
  scheduleGenerationTimeout,
} from '../../src/ui/timeout-handle';

describe('mutation-ui11 timeout-handle', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('createGenerationTimeoutHandle starts generation at exactly 0 (not 1)', () => {
    const handle = createGenerationTimeoutHandle();
    expect(handle.generation).toBe(0);
    expect(handle.timer).toBeNull();
  });

  it('bumpGeneration increments by exactly +1 each call', () => {
    const handle = createGenerationTimeoutHandle();
    bumpGeneration(handle);
    expect(handle.generation).toBe(1);
    bumpGeneration(handle);
    expect(handle.generation).toBe(2);
    bumpGeneration(handle);
    expect(handle.generation).toBe(3);
  });

  it('clearNullableTimeout clears real ids and is idempotent on null', () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const id = setTimeout(fn, 30);
    expect(clearNullableTimeout(id)).toBeNull();
    vi.advanceTimersByTime(30);
    expect(fn).not.toHaveBeenCalled();
    expect(clearNullableTimeout(null)).toBeNull();
  });

  it('scheduleGenerationTimeout runs once then nulls timer; bump cancels', () => {
    vi.useFakeTimers();
    const handle = createGenerationTimeoutHandle();
    const ran = vi.fn();
    scheduleGenerationTimeout(handle, ran, 20);
    expect(handle.timer).not.toBeNull();
    vi.advanceTimersByTime(20);
    expect(ran).toHaveBeenCalledOnce();
    expect(handle.timer).toBeNull();

    const cancelled = vi.fn();
    scheduleGenerationTimeout(handle, cancelled, 20);
    bumpGeneration(handle);
    vi.advanceTimersByTime(20);
    expect(cancelled).not.toHaveBeenCalled();
  });

  it('clearGenerationTimeout drops pending handle.timer', () => {
    vi.useFakeTimers();
    const handle = createGenerationTimeoutHandle();
    scheduleGenerationTimeout(handle, () => undefined, 50);
    expect(handle.timer).not.toBeNull();
    clearGenerationTimeout(handle);
    expect(handle.timer).toBeNull();
  });

  it('scheduleGenerationGated no-ops when generation drifts before fire', () => {
    vi.useFakeTimers();
    let timer: ReturnType<typeof setTimeout> | null = null;
    let generation = 0;
    const fn = vi.fn();
    scheduleGenerationGated(
      {
        clearTimer: () => {
          if (timer !== null) clearTimeout(timer);
          timer = null;
        },
        setTimer: (id) => {
          timer = id;
        },
        getGeneration: () => generation,
      },
      fn,
      15
    );
    expect(timer).not.toBeNull();
    generation = 1;
    vi.advanceTimersByTime(15);
    expect(fn).not.toHaveBeenCalled();
  });

  it('scheduleGenerationGated fires when generation stays stable', () => {
    vi.useFakeTimers();
    let timer: ReturnType<typeof setTimeout> | null = null;
    const generation = 7;
    const fn = vi.fn();
    scheduleGenerationGated(
      {
        clearTimer: () => {
          if (timer !== null) clearTimeout(timer);
          timer = null;
        },
        setTimer: (id) => {
          timer = id;
        },
        getGeneration: () => generation,
      },
      fn,
      15
    );
    vi.advanceTimersByTime(15);
    expect(fn).toHaveBeenCalledOnce();
    expect(timer).toBeNull();
  });
});
