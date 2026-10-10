/**
 * q-mp-478 mutation audit UI wave 16 — kill survivors in pwa/register.ts.
 * Structural / timing-structure pins only (interval ms, reload guard).
 *
 * Uses vi.resetModules + dynamic import so module-level `reloadScheduled`
 * init is observable (static imports elsewhere load first under isolate:false).
 */
import { afterEach, describe, expect, it, vi } from 'vitest';

async function loadPwa(): Promise<typeof import('../../src/pwa/register')> {
  vi.resetModules();
  return import('../../src/pwa/register');
}

describe('mutation-ui16 pwa register', () => {
  afterEach(async () => {
    try {
      const mod = await import('../../src/pwa/register');
      mod.resetPwaReloadGuardForTests();
    } catch {
      // Module may already be invalidated between tests.
    }
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('fresh module: first onNeedRefresh reloads (kills L29 false→true init)', async () => {
    // Survivor: `let reloadScheduled = false` → true at module scope.
    const { registerPwa } = await loadPwa();
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
  });

  it('reset clears update interval so the hour timer stops (kills L35 !==→===)', async () => {
    // Survivor: `if (updateCheckInterval !== null)` → `===` skips clearInterval
    // when an interval is live, leaving the timer armed after reset.
    vi.useFakeTimers();
    const { registerPwa, resetPwaReloadGuardForTests } = await loadPwa();
    const update = vi.fn();
    const registration = { update } as unknown as ServiceWorkerRegistration;
    let onRegisteredSW:
      ((_url: string, reg?: ServiceWorkerRegistration) => void) | undefined;
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

  it('enabled default requires serviceWorker in navigator (kills L49 &&→||)', async () => {
    const { registerPwa } = await loadPwa();
    const registerSW = vi.fn(() => vi.fn());
    const hadSw = Object.prototype.hasOwnProperty.call(
      navigator,
      'serviceWorker'
    );
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

  it('update interval is exactly 60*60*1000 ms (kills L75 60±1 / *→/)', async () => {
    vi.useFakeTimers();
    const { registerPwa } = await loadPwa();
    const update = vi.fn();
    const registration = { update } as unknown as ServiceWorkerRegistration;
    let onRegisteredSW:
      ((_url: string, reg?: ServiceWorkerRegistration) => void) | undefined;
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

  it('hidden document defers reload until visibility visible', async () => {
    const { registerPwa } = await loadPwa();
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
});
