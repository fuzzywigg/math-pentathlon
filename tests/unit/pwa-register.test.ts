import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  registerPwa,
  resetPwaReloadGuardForTests,
} from '../../src/pwa/register';

describe('registerPwa', () => {
  afterEach(() => {
    resetPwaReloadGuardForTests();
    vi.restoreAllMocks();
  });

  it('skips registration when service workers are unavailable', () => {
    const registerSW = vi.fn();
    const result = registerPwa({
      enabled: false,
      registerSW,
    });
    expect(registerSW).not.toHaveBeenCalled();
    expect(result.update).toBeUndefined();
  });

  it('registers with immediate update checks', () => {
    const update = vi.fn();
    const registerSW = vi.fn(() => update);
    const result = registerPwa({
      enabled: true,
      registerSW,
      reload: vi.fn(),
    });

    expect(registerSW).toHaveBeenCalledOnce();
    expect(registerSW.mock.calls[0]?.[0]).toMatchObject({ immediate: true });
    expect(result.update).toBe(update);
  });

  it('reloads once when a new service worker is waiting', () => {
    const reload = vi.fn();
    let onNeedRefresh: (() => void) | undefined;

    const registerSW = vi.fn((opts: { onNeedRefresh?: () => void }) => {
      onNeedRefresh = opts.onNeedRefresh;
      return vi.fn();
    });

    registerPwa({ enabled: true, registerSW, reload });
    onNeedRefresh?.();
    onNeedRefresh?.();

    expect(reload).toHaveBeenCalledOnce();
  });

  it('swallows registration.update() rejection without unhandledrejection', async () => {
    vi.useFakeTimers();
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const unhandled: unknown[] = [];
    const onUnhandled = (reason: unknown) => {
      unhandled.push(reason);
    };
    process.on('unhandledRejection', onUnhandled);

    const update = vi.fn(() => Promise.reject(new Error('offline update')));
    const registration = { update } as unknown as ServiceWorkerRegistration;
    let onRegisteredSW:
      | ((_url: string, reg?: ServiceWorkerRegistration) => void)
      | undefined;
    const registerSW = vi.fn(
      (opts: {
        onRegisteredSW?: (
          url: string,
          reg?: ServiceWorkerRegistration
        ) => void;
      }) => {
        onRegisteredSW = opts.onRegisteredSW;
        return vi.fn();
      }
    );

    registerPwa({ enabled: true, registerSW, reload: vi.fn() });
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
    errSpy.mockRestore();
    vi.useRealTimers();
  });
});
