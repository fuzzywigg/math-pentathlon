/**
 * Shared Vitest fake-timer lifecycle helpers.
 * Safe alongside `tests/unit/setup.ts`, which always restores real timers.
 */
import { afterEach, beforeEach, vi } from 'vitest';

export function useFakeTimers(
  config?: Parameters<typeof vi.useFakeTimers>[0]
): void {
  if (config === undefined) {
    vi.useFakeTimers();
  } else {
    vi.useFakeTimers(config);
  }
}

export function useRealTimers(): void {
  try {
    vi.clearAllTimers();
  } catch {
    // ignore when timers are already real
  }
  vi.useRealTimers();
}

export type FakeTimerHooksOptions = {
  /** Clear pending timers before restoring real timers (default true). */
  clearOnTeardown?: boolean;
  config?: Parameters<typeof vi.useFakeTimers>[0];
};

/**
 * beforeEach → fake timers; afterEach → clear + real timers.
 * Restored for tip fold #658 (q-mp-063) after q-mp-119 demoted the unused export;
 * `existing-games-controllers.test.ts` imports it again.
 */
export function installFakeTimerHooks(
  options: FakeTimerHooksOptions = {}
): void {
  const { clearOnTeardown = true, config } = options;
  beforeEach(() => {
    useFakeTimers(config);
  });
  afterEach(() => {
    if (clearOnTeardown) {
      try {
        vi.clearAllTimers();
      } catch {
        // ignore
      }
    }
    vi.useRealTimers();
  });
}
