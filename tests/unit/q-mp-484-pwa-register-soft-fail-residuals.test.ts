/**
 * q-mp-484 — Characterize `pwa/register` soft-fail residuals (tests-only).
 *
 * Structural asserts only (callback counts, interval clear, console.error
 * tags, unhandledRejection length, visibilityState). No player-facing copy
 * pins. No `src/` product edits. No network / real SW registration.
 *
 * Live tip re-measure (`cursor/mp-tip-post914` @ `753052a6`):
 * - `src/pwa/register.ts` **118** LOC
 * - Prior suites: `pwa-register` (4), `mutation-ui-pwa-register` (8),
 *   `q-mp-256` register block (4), burn-1008 ui-cov-r5 register residuals (3)
 * - Combined coverage: statements **100%**; sole residual branch at L108
 *   (`visibilitychange` while still `hidden` — else path not taken)
 *
 * This file owns soft-fail residuals not claimed by mutation wave 16
 * (`q-mp-478` → `mutation-ui16-*`) or idle-warm/bootstrap char (`#884`/`404`).
 * Disjoint hosts from `q-mp-476` bootstrap.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  registerPwa,
  resetPwaReloadGuardForTests,
} from '../../src/pwa/register';

afterEach(() => {
  resetPwaReloadGuardForTests();
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  Object.defineProperty(document, 'visibilityState', {
    configurable: true,
    get: () => 'visible',
  });
});

describe('q-mp-484 register — visibility soft-fail residuals', () => {
  it('visibilitychange while still hidden does not reload', () => {
    const reload = vi.fn();
    let onNeedRefresh: (() => void) | undefined;
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => 'hidden',
    });
    registerPwa({
      enabled: true,
      reload,
      registerSW: (opts) => {
        onNeedRefresh = opts.onNeedRefresh;
        return vi.fn();
      },
    });
    onNeedRefresh?.();
    expect(reload).not.toHaveBeenCalled();

    // Still hidden — else arm of visibilityState === 'visible' must no-op.
    document.dispatchEvent(new Event('visibilitychange'));
    expect(reload).not.toHaveBeenCalled();
  });

  it('visibility listener tears down after first visible reload', () => {
    const reload = vi.fn();
    let onNeedRefresh: (() => void) | undefined;
    let visibility: DocumentVisibilityState = 'hidden';
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => visibility,
    });
    registerPwa({
      enabled: true,
      reload,
      registerSW: (opts) => {
        onNeedRefresh = opts.onNeedRefresh;
        return vi.fn();
      },
    });
    onNeedRefresh?.();
    expect(reload).not.toHaveBeenCalled();

    visibility = 'visible';
    document.dispatchEvent(new Event('visibilitychange'));
    expect(reload).toHaveBeenCalledOnce();

    // Listener removed — further visible events must not double-reload.
    document.dispatchEvent(new Event('visibilitychange'));
    expect(reload).toHaveBeenCalledOnce();
  });
});

describe('q-mp-484 register — hourly update soft-fail residuals', () => {
  it('resolved update() tick does not log or raise unhandledrejection', async () => {
    vi.useFakeTimers();
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const unhandled: unknown[] = [];
    const onUnhandled = (reason: unknown) => {
      unhandled.push(reason);
    };
    process.on('unhandledRejection', onUnhandled);

    const update = vi.fn(() => Promise.resolve());
    const registration = { update } as unknown as ServiceWorkerRegistration;
    let onRegisteredSW:
      | ((url: string, reg?: ServiceWorkerRegistration) => void)
      | undefined;
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
    ).toBe(false);
    expect(unhandled).toHaveLength(0);

    process.off('unhandledRejection', onUnhandled);
  });

  it('void update() return is Promise.resolve-wrapped without error', async () => {
    vi.useFakeTimers();
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const update = vi.fn(() => undefined);
    const registration = { update } as unknown as ServiceWorkerRegistration;
    let onRegisteredSW:
      | ((url: string, reg?: ServiceWorkerRegistration) => void)
      | undefined;
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

    expect(update).toHaveBeenCalledOnce();
    expect(
      errSpy.mock.calls.some((c) =>
        String(c[0]).includes('[pwa] service worker update check failed')
      )
    ).toBe(false);
  });

  it('re-register clears prior hourly interval before stacking a new one', () => {
    vi.useFakeTimers();
    const clearSpy = vi.spyOn(window, 'clearInterval');
    const updateA = vi.fn(() => Promise.resolve());
    const updateB = vi.fn(() => Promise.resolve());
    const regA = { update: updateA } as unknown as ServiceWorkerRegistration;
    const regB = { update: updateB } as unknown as ServiceWorkerRegistration;
    let onRegisteredSW:
      | ((url: string, reg?: ServiceWorkerRegistration) => void)
      | undefined;
    registerPwa({
      enabled: true,
      reload: vi.fn(),
      registerSW: (opts) => {
        onRegisteredSW = opts.onRegisteredSW;
        return vi.fn();
      },
    });
    onRegisteredSW?.('/sw.js', regA);
    const clearsBefore = clearSpy.mock.calls.length;
    onRegisteredSW?.('/sw.js', regB);
    expect(clearSpy.mock.calls.length).toBeGreaterThan(clearsBefore);

    vi.advanceTimersByTime(60 * 60 * 1000);
    expect(updateA).not.toHaveBeenCalled();
    expect(updateB).toHaveBeenCalledOnce();
  });

  it('resetPwaReloadGuardForTests clears stacked interval so ticks stop', () => {
    vi.useFakeTimers();
    const update = vi.fn(() => Promise.resolve());
    const registration = { update } as unknown as ServiceWorkerRegistration;
    let onRegisteredSW:
      | ((url: string, reg?: ServiceWorkerRegistration) => void)
      | undefined;
    registerPwa({
      enabled: true,
      reload: vi.fn(),
      registerSW: (opts) => {
        onRegisteredSW = opts.onRegisteredSW;
        return vi.fn();
      },
    });
    onRegisteredSW?.('/sw.js', registration);
    resetPwaReloadGuardForTests();
    vi.advanceTimersByTime(60 * 60 * 1000);
    expect(update).not.toHaveBeenCalled();
  });
});

describe('q-mp-484 register — registration soft-fail residuals', () => {
  it('enabled default true when serviceWorker is present', () => {
    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      value: {},
    });
    const registerSW = vi.fn(() => vi.fn());
    const result = registerPwa({ registerSW, reload: vi.fn() });
    expect(registerSW).toHaveBeenCalledOnce();
    expect(typeof result.update).toBe('function');
  });

  it('registerSW throw leaves online play with empty result and tagged error', () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const boom = new Error('blocked by school policy');
    const result = registerPwa({
      enabled: true,
      reload: vi.fn(),
      registerSW: () => {
        throw boom;
      },
    });
    expect(result).toEqual({});
    expect(errSpy).toHaveBeenCalledOnce();
    expect(String(errSpy.mock.calls[0]?.[0])).toBe(
      '[pwa] service worker registration failed'
    );
    expect(errSpy.mock.calls[0]?.[1]).toBe(boom);
  });

  it('onOfflineReady no-op is safe to invoke after soft registration', () => {
    let onOfflineReady: (() => void) | undefined;
    registerPwa({
      enabled: true,
      reload: vi.fn(),
      registerSW: (opts) => {
        onOfflineReady = opts.onOfflineReady;
        return vi.fn();
      },
    });
    expect(typeof onOfflineReady).toBe('function');
    expect(() => onOfflineReady?.()).not.toThrow();
  });
});
