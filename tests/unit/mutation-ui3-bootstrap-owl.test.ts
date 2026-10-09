/**
 * q-mp-112 mutation audit UI wave 3 — kill survivors in pwa/bootstrap-owl.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { bootstrapOwl } from '../../src/pwa/bootstrap-owl';

describe('mutation-ui3 bootstrapOwl', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('schedules when enabled is omitted under jsdom (window && document)', () => {
    // Survivors: default `&&` / `!== 'undefined'` flips and `if (!enabled)` remove `!`.
    const schedule = vi.fn();
    bootstrapOwl({ schedule });
    expect(schedule).toHaveBeenCalledTimes(1);
  });

  it('no-ops when enabled is false', () => {
    const schedule = vi.fn();
    bootstrapOwl({ enabled: false, schedule });
    expect(schedule).not.toHaveBeenCalled();
  });

  it('defaultSchedule prefers requestIdleCallback when it is a function', () => {
    // Survivor: `typeof ric === 'function'` → `!==`
    const ric = vi.fn((cb: IdleRequestCallback) => {
      cb({} as IdleDeadline);
      return 1;
    });
    vi.stubGlobal('requestIdleCallback', ric);
    const timeoutSpy = vi.spyOn(window, 'setTimeout');
    bootstrapOwl({
      enabled: true,
      importOwl: async () =>
        ({ owlSystem: { initialize: vi.fn() } }) as never,
      importOwlUi: async () =>
        ({ owlComponent: { init: vi.fn() } }) as never,
    });
    expect(ric).toHaveBeenCalledTimes(1);
    expect(timeoutSpy).not.toHaveBeenCalled();
  });

  it('defaultSchedule falls back to setTimeout when ric is absent', async () => {
    vi.useFakeTimers();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (window as any).requestIdleCallback;
    const init = vi.fn();
    const initialize = vi.fn();
    const timeoutSpy = vi.spyOn(window, 'setTimeout');
    bootstrapOwl({
      enabled: true,
      importOwl: async () => ({ owlSystem: { initialize } }) as never,
      importOwlUi: async () => ({ owlComponent: { init } }) as never,
    });
    expect(timeoutSpy).toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(800);
    await Promise.resolve();
    expect(init).toHaveBeenCalled();
    expect(initialize).toHaveBeenCalled();
  });

  // Pinned: default `window && document` → `||` is true under jsdom either way.
  it.skip('default enabled requires both window and document (pinned || flip)', () => {
    expect(true).toBe(true);
  });
});
