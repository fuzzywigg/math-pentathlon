/**
 * burn-1008-mp-mutation-audit-ui — kill survivors in pwa/register.ts.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  registerPwa,
  resetPwaReloadGuardForTests,
} from '../../src/pwa/register';

describe('mutation-ui pwa register', () => {
  afterEach(() => {
    resetPwaReloadGuardForTests();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('resetPwaReloadGuardForTests clears reloadScheduled to false', () => {
    // Survivor: reloadScheduled = false → true in reset helper.
    const reload = vi.fn();
    let onNeedRefresh: (() => void) | undefined;
    registerPwa({
      enabled: true,
      reload,
      registerSW: (opts) => {
        onNeedRefresh = opts.onNeedRefresh;
        return vi.fn();
      },
    });
    onNeedRefresh?.();
    expect(reload).toHaveBeenCalledOnce();
    // Second refresh should be no-op until reset
    onNeedRefresh?.();
    expect(reload).toHaveBeenCalledOnce();
    resetPwaReloadGuardForTests();
    onNeedRefresh?.();
    expect(reload).toHaveBeenCalledTimes(2);
  });

  it('enabled default requires serviceWorker in navigator', () => {
    // Survivor: && → || in enabled default — `'serviceWorker' in navigator` must be false.
    const registerSW = vi.fn(() => vi.fn());
    const hadSw = Object.prototype.hasOwnProperty.call(navigator, 'serviceWorker');
    const original = hadSw
      ? Object.getOwnPropertyDescriptor(navigator, 'serviceWorker')
      : undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- delete for `in` check
    delete (navigator as any).serviceWorker;
    try {
      expect('serviceWorker' in navigator).toBe(false);
      const result = registerPwa({ registerSW });
      expect(result.update).toBeUndefined();
      expect(registerSW).not.toHaveBeenCalled();
    } finally {
      if (original) {
        Object.defineProperty(navigator, 'serviceWorker', original);
      }
    }
  });

  it('returns {} when enabled true but registerSW missing', () => {
    // Survivor: !enabled || !registerSW → &&
    const result = registerPwa({ enabled: true });
    expect(result).toEqual({});
  });

  it('returns {} when enabled false even with registerSW', () => {
    const registerSW = vi.fn(() => vi.fn());
    const result = registerPwa({ enabled: false, registerSW });
    expect(result).toEqual({});
    expect(registerSW).not.toHaveBeenCalled();
  });

  it('update interval is exactly 60*60*1000 ms', () => {
    // Survivors: 60 → 59 on either factor.
    vi.useFakeTimers();
    const update = vi.fn();
    const registration = { update } as unknown as ServiceWorkerRegistration;
    let onRegisteredSW:
      | ((_url: string, reg?: ServiceWorkerRegistration) => void)
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
    vi.advanceTimersByTime(60 * 60 * 1000 - 1);
    expect(update).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(update).toHaveBeenCalledOnce();
  });

  it('scheduleReload sets reloadScheduled true so duplicates are ignored', () => {
    const reload = vi.fn();
    let onNeedRefresh: (() => void) | undefined;
    registerPwa({
      enabled: true,
      reload,
      registerSW: (opts) => {
        onNeedRefresh = opts.onNeedRefresh;
        return vi.fn();
      },
    });
    onNeedRefresh?.();
    onNeedRefresh?.();
    onNeedRefresh?.();
    expect(reload).toHaveBeenCalledOnce();
  });

  it('hidden document defers reload until visibility visible', () => {
    // Survivor: && → || on document !== undefined && visibilityState === hidden
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
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => 'visible',
    });
    document.dispatchEvent(new Event('visibilitychange'));
    expect(reload).toHaveBeenCalledOnce();
  });

  it('registerSW throw is soft-caught', () => {
    const err = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const result = registerPwa({
      enabled: true,
      registerSW: () => {
        throw new Error('sw boom');
      },
    });
    expect(result).toEqual({});
    expect(err).toHaveBeenCalled();
  });
});
