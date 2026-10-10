/**
 * q-mp-658 — Close pwa/register residual gaps under the *register* verify glob.
 *
 * Tests only; 0 src. Mock registerSW / location.reload only — no network.
 * Targets uncovered stmt/branch lines named in backlog-2026-10-10w: ~58, 73
 * (default window.location.reload; onRegisteredSW early return without reg).
 *
 * Open-PR check (post1023 drafts scanned): none own closing register residual
 * coverage under tests/unit/*register*. Leave #999/544 (void braces) and
 * #945/484 (soft-fail characterization) contained — no void ceiling write.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  registerPwa,
  resetPwaReloadGuardForTests,
} from '../../src/pwa/register';

afterEach(() => {
  resetPwaReloadGuardForTests();
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  Object.defineProperty(document, 'visibilityState', {
    configurable: true,
    get: () => 'visible',
  });
});

describe('q-mp-658 register — default reload residual (L58)', () => {
  it('omitted reload option uses window.location.reload on need-refresh', () => {
    // Exercises src/pwa/register.ts ~56–58 under the *register* glob
    // (burn-1008 already covers this path but does not match that glob).
    const reload = vi.fn();
    vi.stubGlobal('location', { ...window.location, reload });
    let onNeedRefresh: (() => void) | undefined;
    registerPwa({
      enabled: true,
      registerSW: (opts) => {
        onNeedRefresh = opts.onNeedRefresh;
        return vi.fn();
      },
    });
    onNeedRefresh?.();
    expect(reload).toHaveBeenCalledOnce();
  });
});

describe('q-mp-658 register — onRegisteredSW missing-reg residual (L73)', () => {
  it('onRegisteredSW with undefined registration is a no-op (no interval)', () => {
    // Exercises src/pwa/register.ts ~72–73 early return under *register* glob.
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
    const intervalsBefore = setIntervalSpy.mock.calls.length;
    onRegisteredSW?.('/sw.js', undefined);
    expect(setIntervalSpy.mock.calls.length).toBe(intervalsBefore);
    vi.advanceTimersByTime(60 * 60 * 1000);
  });

  it('onRegisteredSW undefined then real reg still arms a single hourly tick', async () => {
    vi.useFakeTimers();
    const update = vi.fn(() => Promise.resolve());
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
    onRegisteredSW?.('/sw.js', undefined);
    onRegisteredSW?.('/sw.js', registration);
    await vi.advanceTimersByTimeAsync(60 * 60 * 1000);
    await Promise.resolve();
    expect(update).toHaveBeenCalledOnce();
  });
});
