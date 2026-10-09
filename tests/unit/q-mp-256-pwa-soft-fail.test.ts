/**
 * q-mp-256 — PWA unit characterization (tests only).
 * Soft-fail / offline paths for register, idle-warm, and bootstrap helpers.
 * Injected registerSW / importers only — no network, no real SW update side effects.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  registerPwa,
  resetPwaReloadGuardForTests,
} from '../../src/pwa/register';
import {
  IDLE_WARM_DONE_ATTR,
  scheduleIdleGameWarm,
} from '../../src/pwa/idle-warm';
import { bootstrapPwa } from '../../src/pwa/bootstrap';
import { bootstrapOwl } from '../../src/pwa/bootstrap-owl';

describe('q-mp-256 registerPwa soft-fail / offline contract', () => {
  afterEach(() => {
    resetPwaReloadGuardForTests();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('wires immediate + onOfflineReady + onNeedRefresh + onRegisteredSW without network', () => {
    let captured: {
      immediate?: boolean;
      onOfflineReady?: () => void;
      onNeedRefresh?: () => void;
      onRegisteredSW?: (url: string, reg?: ServiceWorkerRegistration) => void;
    } = {};
    const registerSW = vi.fn((opts: typeof captured) => {
      captured = opts;
      return vi.fn();
    });

    const result = registerPwa({
      enabled: true,
      registerSW,
      reload: vi.fn(),
    });

    expect(registerSW).toHaveBeenCalledOnce();
    expect(captured.immediate).toBe(true);
    expect(typeof captured.onOfflineReady).toBe('function');
    expect(typeof captured.onNeedRefresh).toBe('function');
    expect(typeof captured.onRegisteredSW).toBe('function');
    expect(typeof result.update).toBe('function');

    // Precache-complete callback is intentionally a no-op (airplane-ready).
    expect(() => captured.onOfflineReady?.()).not.toThrow();
  });

  it('onRegisteredSW without registration skips the hourly update interval', () => {
    vi.useFakeTimers();
    const setIntervalSpy = vi.spyOn(window, 'setInterval');
    let onRegisteredSW:
      ((url: string, reg?: ServiceWorkerRegistration) => void) | undefined;
    registerPwa({
      enabled: true,
      reload: vi.fn(),
      registerSW: (opts) => {
        onRegisteredSW = opts.onRegisteredSW;
        return vi.fn();
      },
    });
    onRegisteredSW?.('/sw.js', undefined);
    expect(setIntervalSpy).not.toHaveBeenCalled();
  });

  it('soft-fails when registerSW throws so online play still gets {}', () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const result = registerPwa({
      enabled: true,
      registerSW: () => {
        throw new Error('offline / blocked registration');
      },
      reload: vi.fn(),
    });
    expect(result).toEqual({});
    expect(
      errSpy.mock.calls.some((c) =>
        String(c[0]).includes('[pwa] service worker registration failed')
      )
    ).toBe(true);
  });

  it('swallows update() rejection on the hourly tick (no unhandledrejection)', async () => {
    vi.useFakeTimers();
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const unhandled: unknown[] = [];
    const onUnhandled = (reason: unknown) => {
      unhandled.push(reason);
    };
    process.on('unhandledRejection', onUnhandled);

    const update = vi.fn(() => Promise.reject(new Error('school wifi flap')));
    const registration = { update } as unknown as ServiceWorkerRegistration;
    let onRegisteredSW:
      ((url: string, reg?: ServiceWorkerRegistration) => void) | undefined;
    registerPwa({
      enabled: true,
      reload: vi.fn(),
      registerSW: (opts) => {
        onRegisteredSW = opts.onRegisteredSW;
        return vi.fn();
      },
    });
    onRegisteredSW?.('/sw.js', registration);
    await vi.advanceTimersByTimeAsync(60 * 60 * 1000);
    await Promise.resolve();
    await Promise.resolve();

    expect(update).toHaveBeenCalledOnce();
    expect(
      errSpy.mock.calls.some((c) =>
        String(c[0]).includes('[pwa] service worker update check failed')
      )
    ).toBe(true);
    expect(unhandled).toHaveLength(0);

    process.off('unhandledRejection', onUnhandled);
  });
});

describe('q-mp-256 idle-warm soft-fail / offline paths', () => {
  beforeEach(() => {
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      get: () => false,
    });
    document.documentElement.removeAttribute(IDLE_WARM_DONE_ATTR);
    try {
      delete (navigator as Navigator & { connection?: unknown }).connection;
    } catch {
      /* ignore */
    }
  });

  afterEach(() => {
    vi.restoreAllMocks();
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
  });

  it('continues to next warm game when one import rejects (offline-ish chunk miss)', async () => {
    const importShell = vi.fn().mockResolvedValue({});
    const importGame = vi.fn().mockImplementation(async (gameId: string) => {
      if (gameId === 'hex') {
        throw new Error('hex chunk offline');
      }
      return {};
    });
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
  });

  it('skips remaining warm games when Save-Data flips on mid-loop and still marks done', async () => {
    let saveData = false;
    Object.defineProperty(navigator, 'connection', {
      configurable: true,
      get: () => ({ saveData }),
    });
    const importShell = vi.fn().mockResolvedValue({});
    const importGame = vi.fn().mockImplementation(async () => {
      saveData = true;
    });
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
    expect(importGame.mock.calls.length).toBeLessThanOrEqual(2);
    // After first game sets saveData, loop must not keep warming forever.
    expect(importGame.mock.calls.length).toBe(1);
  });

  it('skips game warm when document becomes hidden after shell and still marks done', async () => {
    let hidden = false;
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      get: () => hidden,
    });
    const importShell = vi.fn().mockImplementation(async () => {
      hidden = true;
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

  it('shell warm reject is best-effort — games still warm and done is marked', async () => {
    const importShell = vi.fn().mockRejectedValue(new Error('shell offline'));
    const importGame = vi.fn().mockResolvedValue({});
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
  });
});

describe('q-mp-256 bootstrap helpers soft-fail / schedule contract', () => {
  afterEach(() => {
    resetPwaReloadGuardForTests();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('bootstrapPwa defaultSchedule uses requestIdleCallback timeout 3000', () => {
    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      value: {},
    });
    const ric = vi.fn((cb: IdleRequestCallback) => {
      cb({ didTimeout: false, timeRemaining: () => 0 } as IdleDeadline);
      return 1;
    });
    vi.stubGlobal('requestIdleCallback', ric);
    const registerSW = vi.fn(() => vi.fn());
    bootstrapPwa({ enabled: true, registerSW });
    expect(ric).toHaveBeenCalledTimes(1);
    const opts = ric.mock.calls[0]?.[1] as IdleRequestOptions | undefined;
    expect(opts?.timeout).toBe(3_000);
    expect(registerSW).toHaveBeenCalledOnce();
  });

  it('bootstrapOwl soft-fails when owl UI init throws (no unhandledrejection)', async () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const unhandled: unknown[] = [];
    const onUnhandled = (reason: unknown) => {
      unhandled.push(reason);
    };
    process.on('unhandledRejection', onUnhandled);

    bootstrapOwl({
      enabled: true,
      schedule: (cb) => cb(),
      importOwl: async () => ({ owlSystem: { initialize: vi.fn() } }) as never,
      importOwlUi: async () =>
        ({
          owlComponent: {
            init: () => {
              throw new Error('owl ui init boom');
            },
          },
        }) as never,
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

  it('bootstrapOwl soft-fails when owl UI chunk import rejects', async () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const unhandled: unknown[] = [];
    const onUnhandled = (reason: unknown) => {
      unhandled.push(reason);
    };
    process.on('unhandledRejection', onUnhandled);

    bootstrapOwl({
      enabled: true,
      schedule: (cb) => cb(),
      importOwl: async () => ({ owlSystem: { initialize: vi.fn() } }) as never,
      importOwlUi: async () => {
        throw new Error('owl ui chunk missing offline');
      },
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

  it('bootstrapOwl defaultSchedule uses requestIdleCallback timeout 2500', () => {
    const ric = vi.fn((cb: IdleRequestCallback) => {
      cb({} as IdleDeadline);
      return 1;
    });
    vi.stubGlobal('requestIdleCallback', ric);
    bootstrapOwl({
      enabled: true,
      importOwl: async () => ({ owlSystem: { initialize: vi.fn() } }) as never,
      importOwlUi: async () => ({ owlComponent: { init: vi.fn() } }) as never,
    });
    expect(ric).toHaveBeenCalledTimes(1);
    const opts = ric.mock.calls[0]?.[1] as IdleRequestOptions | undefined;
    expect(opts?.timeout).toBe(2_500);
  });
});
