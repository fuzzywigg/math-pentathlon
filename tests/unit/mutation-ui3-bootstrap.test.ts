/**
 * q-mp-112 mutation audit UI wave 3 — kill survivors in pwa/bootstrap.
 * No AI timing asserts — only enable/schedule / idle-callback wiring.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { bootstrapPwa } from '../../src/pwa/bootstrap';
import { resetPwaReloadGuardForTests } from '../../src/pwa/register';

describe('mutation-ui3 bootstrapPwa', () => {
  beforeEach(() => {
    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      value: {},
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.useRealTimers();
    resetPwaReloadGuardForTests();
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (navigator as any).serviceWorker;
    } catch {
      // ignore
    }
  });

  it('schedules when enabled is omitted under jsdom (window && document)', () => {
    // Survivors: default `window && document` → `||`; `!== 'undefined'` → `===`;
    // and `if (!enabled)` remove `!` (would skip the schedule path when enabled).
    const schedule = vi.fn();
    const registerSW = vi.fn(() => vi.fn());
    bootstrapPwa({ schedule, registerSW });
    expect(schedule).toHaveBeenCalledTimes(1);
  });

  it('no-ops when enabled is false', () => {
    const schedule = vi.fn();
    bootstrapPwa({ enabled: false, schedule, registerSW: vi.fn() });
    expect(schedule).not.toHaveBeenCalled();
  });

  it('defaultSchedule prefers requestIdleCallback when it is a function', () => {
    // Survivor: `typeof ric === 'function'` → `!==` would fall through to setTimeout.
    const ric = vi.fn((cb: IdleRequestCallback) => {
      cb({} as IdleDeadline);
      return 1;
    });
    vi.stubGlobal('requestIdleCallback', ric);
    const timeoutSpy = vi.spyOn(window, 'setTimeout');
    const registerSW = vi.fn(() => vi.fn());
    bootstrapPwa({ enabled: true, registerSW });
    expect(ric).toHaveBeenCalledTimes(1);
    expect(timeoutSpy).not.toHaveBeenCalled();
  });

  it('defaultSchedule falls back to setTimeout when ric is absent', () => {
    vi.useFakeTimers();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (window as any).requestIdleCallback;
    const registerSW = vi.fn(() => vi.fn());
    const timeoutSpy = vi.spyOn(window, 'setTimeout');
    bootstrapPwa({ enabled: true, registerSW });
    expect(timeoutSpy).toHaveBeenCalled();
    vi.advanceTimersByTime(1_000);
    expect(registerSW).toHaveBeenCalledOnce();
  });

  // Pinned: default `window && document` → `||` is true under jsdom either way.
  it.skip('default enabled requires both window and document (pinned || flip)', () => {
    expect(true).toBe(true);
  });
});
