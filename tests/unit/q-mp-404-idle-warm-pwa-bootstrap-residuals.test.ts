/**
 * q-mp-404 — Characterize idle-warm / PWA bootstrap soft-fail residuals.
 *
 * Tests only. Structural asserts (schedule wiring, done attr, call counts,
 * console diagnostic prefixes, idle timeouts). No player-facing copy pins.
 * Injected registerSW / importers only — no network, no real SW registration.
 *
 * Live tip re-measure (`cursor/mp-tip-post865` @ `3908809d`):
 * Prior suites already cover happy-path warm, Save-Data/hidden skip, mid-loop
 * abort, shell reject continue, ric timeouts 4000/3000/2500, and owl UI
 * soft-fail (`idle-warm-bootstrap-owl`, `q-mp-256`, mutation-ui2/3, burn-1007).
 * This file targets residuals named in the backlog: double-warm, mid-shell
 * abort, both-game reject, owl core import / initialize soft-fail, and
 * bootstrap setTimeout fallback delays.
 *
 * Narrowed vs open drafts:
 * - #765 q-mp-256 (tip-equivalent; file already on tip) — contained
 * - #877 owl void braces / #878 hex UI cov — disjoint hosts
 * - undrafted q-mp-242 PWA void code / q-mp-402 mutation w13 — leave alone
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  IDLE_WARM_DONE_ATTR,
  scheduleIdleGameWarm,
} from '../../src/pwa/idle-warm';
import { bootstrapPwa } from '../../src/pwa/bootstrap';
import { bootstrapOwl } from '../../src/pwa/bootstrap-owl';
import { resetPwaReloadGuardForTests } from '../../src/pwa/register';

function clearIdleWarmDom(): void {
  document.documentElement.removeAttribute(IDLE_WARM_DONE_ATTR);
  Object.defineProperty(document, 'hidden', {
    configurable: true,
    get: () => false,
  });
  try {
    delete (navigator as Navigator & { connection?: unknown }).connection;
  } catch {
    /* ignore */
  }
}

describe('q-mp-404 idle-warm — double-warm / schedule residuals', () => {
  beforeEach(() => {
    clearIdleWarmDom();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    clearIdleWarmDom();
  });

  it('double scheduleIdleGameWarm registers two independent schedules', () => {
    const schedules: Array<() => void> = [];
    const importShell = vi.fn().mockResolvedValue({});
    const importGame = vi.fn().mockResolvedValue({});

    scheduleIdleGameWarm({
      schedule: (cb) => {
        schedules.push(cb);
      },
      importShell,
      importGame,
    });
    scheduleIdleGameWarm({
      schedule: (cb) => {
        schedules.push(cb);
      },
      importShell,
      importGame,
    });

    expect(schedules).toHaveLength(2);
    expect(importShell).not.toHaveBeenCalled();
    expect(importGame).not.toHaveBeenCalled();
  });

  it('double-warm both callbacks complete and leave done attr set', async () => {
    const schedules: Array<() => void> = [];
    const importShell = vi.fn().mockResolvedValue({});
    const importGame = vi.fn().mockResolvedValue({});

    scheduleIdleGameWarm({
      schedule: (cb) => {
        schedules.push(cb);
      },
      importShell,
      importGame,
    });
    scheduleIdleGameWarm({
      schedule: (cb) => {
        schedules.push(cb);
      },
      importShell,
      importGame,
    });

    schedules[0]?.();
    schedules[1]?.();

    await vi.waitFor(() => {
      expect(importShell).toHaveBeenCalledTimes(2);
      expect(importGame).toHaveBeenCalledWith('hex');
      expect(importGame).toHaveBeenCalledWith('kings-quadraphages');
      expect(document.documentElement.getAttribute(IDLE_WARM_DONE_ATTR)).toBe(
        'done'
      );
    });
    // Two warms × two DEFAULT_WARM_GAMES.
    expect(importGame).toHaveBeenCalledTimes(4);
  });
});

describe('q-mp-404 idle-warm — mid-shell / both-reject abort residuals', () => {
  beforeEach(() => {
    clearIdleWarmDom();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    clearIdleWarmDom();
  });

  it('Save-Data flip during shell await aborts game warm and still marks done', async () => {
    let saveData = false;
    Object.defineProperty(navigator, 'connection', {
      configurable: true,
      get: () => ({ saveData }),
    });
    const importShell = vi.fn().mockImplementation(async () => {
      saveData = true;
    });
    const importGame = vi.fn().mockResolvedValue({});

    scheduleIdleGameWarm({
      schedule: (cb) => cb(),
      importShell,
      importGame,
    });

    await vi.waitFor(() => {
      expect(document.documentElement.getAttribute(IDLE_WARM_DONE_ATTR)).toBe(
        'done'
      );
    });
    expect(importShell).toHaveBeenCalledTimes(1);
    expect(importGame).not.toHaveBeenCalled();
  });

  it('both warm-game imports reject — still marks done (best-effort)', async () => {
    const importShell = vi.fn().mockResolvedValue({});
    const importGame = vi
      .fn()
      .mockRejectedValue(new Error('warm chunk offline'));

    scheduleIdleGameWarm({
      schedule: (cb) => cb(),
      importShell,
      importGame,
    });

    await vi.waitFor(() => {
      expect(importGame).toHaveBeenCalledWith('hex');
      expect(importGame).toHaveBeenCalledWith('kings-quadraphages');
      expect(document.documentElement.getAttribute(IDLE_WARM_DONE_ATTR)).toBe(
        'done'
      );
    });
    expect(importGame).toHaveBeenCalledTimes(2);
  });

  it('IDLE_WARM_DONE_ATTR marker is the structural e2e contract key', () => {
    expect(IDLE_WARM_DONE_ATTR).toBe('data-mp-idle-warm');
  });
});

describe('q-mp-404 bootstrapPwa — schedule fallback residuals', () => {
  afterEach(() => {
    resetPwaReloadGuardForTests();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.useRealTimers();
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (navigator as any).serviceWorker;
    } catch {
      /* ignore */
    }
  });

  it('deferred schedule does not call registerSW until callback fires', () => {
    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      value: {},
    });
    const registerSW = vi.fn(() => vi.fn());
    let scheduled: (() => void) | undefined;
    bootstrapPwa({
      enabled: true,
      registerSW,
      schedule: (cb) => {
        scheduled = cb;
      },
    });
    expect(registerSW).not.toHaveBeenCalled();
    expect(typeof scheduled).toBe('function');
    scheduled?.();
    expect(registerSW).toHaveBeenCalledOnce();
  });

  it('defaultSchedule setTimeout fallback delay is exactly 1000ms', () => {
    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      value: {},
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (window as any).requestIdleCallback;
    const setTimeoutSpy = vi
      .spyOn(window, 'setTimeout')
      .mockImplementation(((cb: TimerHandler) => {
        if (typeof cb === 'function') {
          cb();
        }
        return 1 as unknown as number;
      }) as typeof setTimeout);
    const registerSW = vi.fn(() => vi.fn());
    bootstrapPwa({ enabled: true, registerSW });
    const delay = setTimeoutSpy.mock.calls.find(
      (c) => typeof c[0] === 'function'
    )?.[1];
    expect(delay).toBe(1_000);
    expect(registerSW).toHaveBeenCalledOnce();
  });
});

describe('q-mp-404 bootstrapOwl — soft-fail / schedule residuals', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('soft-fails when owl core chunk import rejects (no unhandledrejection)', async () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const unhandled: unknown[] = [];
    const onUnhandled = (reason: unknown) => {
      unhandled.push(reason);
    };
    process.on('unhandledRejection', onUnhandled);

    bootstrapOwl({
      enabled: true,
      schedule: (cb) => cb(),
      importOwl: async () => {
        throw new Error('owl core chunk offline');
      },
      importOwlUi: async () =>
        ({ owlComponent: { init: vi.fn() } }) as never,
    });

    await vi.waitFor(() => {
      expect(
        errSpy.mock.calls.some((c) =>
          String(c[0]).includes('[bootstrap-owl] init failed')
        )
      ).toBe(true);
    });
    await Promise.resolve();
    await Promise.resolve();
    expect(unhandled).toHaveLength(0);

    process.off('unhandledRejection', onUnhandled);
  });

  it('soft-fails when owlSystem.initialize throws (no unhandledrejection)', async () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const unhandled: unknown[] = [];
    const onUnhandled = (reason: unknown) => {
      unhandled.push(reason);
    };
    process.on('unhandledRejection', onUnhandled);

    const init = vi.fn();
    bootstrapOwl({
      enabled: true,
      schedule: (cb) => cb(),
      importOwl: async () =>
        ({
          owlSystem: {
            initialize: () => {
              throw new Error('owl system init boom');
            },
          },
        }) as never,
      importOwlUi: async () =>
        ({ owlComponent: { init } }) as never,
    });

    await vi.waitFor(() => {
      expect(init).toHaveBeenCalledTimes(1);
      expect(
        errSpy.mock.calls.some((c) =>
          String(c[0]).includes('[bootstrap-owl] init failed')
        )
      ).toBe(true);
    });
    await Promise.resolve();
    await Promise.resolve();
    expect(unhandled).toHaveLength(0);

    process.off('unhandledRejection', onUnhandled);
  });

  it('happy path calls owlComponent.init then owlSystem.initialize', async () => {
    const order: string[] = [];
    bootstrapOwl({
      enabled: true,
      schedule: (cb) => cb(),
      importOwl: async () =>
        ({
          owlSystem: {
            initialize: () => {
              order.push('initialize');
            },
          },
        }) as never,
      importOwlUi: async () =>
        ({
          owlComponent: {
            init: () => {
              order.push('init');
            },
          },
        }) as never,
    });

    await vi.waitFor(() => {
      expect(order).toEqual(['init', 'initialize']);
    });
  });

  it('defaultSchedule setTimeout fallback delay is exactly 800ms', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (window as any).requestIdleCallback;
    const setTimeoutSpy = vi
      .spyOn(window, 'setTimeout')
      .mockImplementation(((cb: TimerHandler) => {
        if (typeof cb === 'function') {
          cb();
        }
        return 1 as unknown as number;
      }) as typeof setTimeout);
    bootstrapOwl({
      enabled: true,
      importOwl: async () =>
        ({ owlSystem: { initialize: vi.fn() } }) as never,
      importOwlUi: async () =>
        ({ owlComponent: { init: vi.fn() } }) as never,
    });
    const delay = setTimeoutSpy.mock.calls.find(
      (c) => typeof c[0] === 'function'
    )?.[1];
    expect(delay).toBe(800);
  });
});
