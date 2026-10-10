/**
 * Shared nullable-timeout clear / generation-gated schedule helpers.
 * Pure timer glue — does not change AI search, scoring, difficulty, or delays.
 */

type TimeoutId = ReturnType<typeof setTimeout>;

/** Clear a pending timeout and return null (for `timer = clearNullableTimeout(timer)`). */
export function clearNullableTimeout(timer: TimeoutId | null): null {
  if (timer !== null) {
    clearTimeout(timer);
  }
  return null;
}

/**
 * Mutable handle for the common `aiTimer` + `aiGeneration` controller pattern.
 */
interface GenerationTimeoutHandle {
  timer: TimeoutId | null;
  generation: number;
}

export function createGenerationTimeoutHandle(): GenerationTimeoutHandle {
  return { timer: null, generation: 0 };
}

export function clearGenerationTimeout(handle: GenerationTimeoutHandle): void {
  handle.timer = clearNullableTimeout(handle.timer);
}

export function bumpGeneration(handle: GenerationTimeoutHandle): void {
  handle.generation += 1;
}

/**
 * Schedule work; no-ops if `bumpGeneration` ran after this schedule was queued.
 */
export function scheduleGenerationTimeout(
  handle: GenerationTimeoutHandle,
  fn: () => void,
  delayMs: number
): void {
  clearGenerationTimeout(handle);
  const gen = handle.generation;
  handle.timer = setTimeout(() => {
    handle.timer = null;
    if (gen !== handle.generation) {
      return;
    }
    fn();
  }, delayMs);
}

/**
 * Generation-gated schedule against separate module-level timer/generation bindings.
 * Prefer {@link scheduleGenerationTimeout} when adopting a handle object.
 */
export function scheduleGenerationGated(
  opts: {
    clearTimer: () => void;
    setTimer: (id: TimeoutId | null) => void;
    getGeneration: () => number;
  },
  fn: () => void,
  delayMs: number
): void {
  opts.clearTimer();
  const gen = opts.getGeneration();
  opts.setTimer(
    setTimeout(() => {
      opts.setTimer(null);
      if (gen !== opts.getGeneration()) {
        return;
      }
      fn();
    }, delayMs)
  );
}
