/**
 * Shared Vitest fake-timer lifecycle helpers.
 * Safe alongside `tests/unit/setup.ts`, which always restores real timers.
 */
import { vi } from 'vitest';

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
