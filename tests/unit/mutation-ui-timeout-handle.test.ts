/**
 * burn-1008-mp-mutation-audit-ui — kill survivors in timeout-handle.
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

describe('mutation-ui timeout-handle', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('clearNullableTimeout clears only when timer !== null', () => {
    vi.useFakeTimers();
    const id = setTimeout(() => undefined, 1000);
    expect(clearNullableTimeout(id)).toBeNull();
    expect(clearNullableTimeout(null)).toBeNull();
  });

  it('createGenerationTimeoutHandle starts at generation 0', () => {
    // Survivor: generation: 0 → 1
    const handle = createGenerationTimeoutHandle();
    expect(handle.generation).toBe(0);
    expect(handle.timer).toBeNull();
  });

  it('bumpGeneration increments by exactly 1', () => {
    // Survivor: generation += 1 → += 2
    const handle = createGenerationTimeoutHandle();
    bumpGeneration(handle);
    expect(handle.generation).toBe(1);
    bumpGeneration(handle);
    expect(handle.generation).toBe(2);
  });

  it('scheduleGenerationTimeout no-ops after bumpGeneration', () => {
    vi.useFakeTimers();
    const handle = createGenerationTimeoutHandle();
    const fn = vi.fn();
    scheduleGenerationTimeout(handle, fn, 50);
    bumpGeneration(handle);
    vi.advanceTimersByTime(50);
    expect(fn).not.toHaveBeenCalled();
  });

  it('scheduleGenerationTimeout runs when generation unchanged', () => {
    vi.useFakeTimers();
    const handle = createGenerationTimeoutHandle();
    const fn = vi.fn();
    scheduleGenerationTimeout(handle, fn, 25);
    vi.advanceTimersByTime(25);
    expect(fn).toHaveBeenCalledOnce();
    expect(handle.timer).toBeNull();
  });

  it('clearGenerationTimeout clears pending timer', () => {
    vi.useFakeTimers();
    const handle = createGenerationTimeoutHandle();
    scheduleGenerationTimeout(handle, () => undefined, 100);
    expect(handle.timer).not.toBeNull();
    clearGenerationTimeout(handle);
    expect(handle.timer).toBeNull();
  });

  it('scheduleGenerationGated respects generation drift', () => {
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
      40
    );
    generation = 1;
    vi.advanceTimersByTime(40);
    expect(fn).not.toHaveBeenCalled();
  });
});
