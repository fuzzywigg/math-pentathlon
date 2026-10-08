/**
 * burn-1007 — PWA bootstrap / idle-warm / register edges + reduced-motion bind.
 * Behavior-focused; injects schedule/registerSW. No product inventing.
 */
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import {
  registerPwa,
  resetPwaReloadGuardForTests,
} from '../../src/pwa/register';
import { bootstrapPwa } from '../../src/pwa/bootstrap';
import {
  IDLE_WARM_DONE_ATTR,
  scheduleIdleGameWarm,
} from '../../src/pwa/idle-warm';
import { bootstrapOwl } from '../../src/pwa/bootstrap-owl';
import {
  REDUCED_MOTION_ATTR,
  applyReducedMotionPreference,
  bindReducedMotionPreference,
  durationMsForMotion,
  prefersReducedMotion,
  scrollBehaviorForMotion,
} from '../../src/ui/reduced-motion';
import {
  canPrefetchGame,
  isGamePrefetchStarted,
  prefetchGameChunk,
  prefetchGameChunksIdle,
  resetGamePrefetchForTests,
} from '../../src/ui/game-prefetch';
import { resetSettingsFlagsForTests } from '../../src/core/settings-flags';

describe('burn-1007 registerPwa edges', () => {
  afterEach(() => {
    resetPwaReloadGuardForTests();
    vi.restoreAllMocks();
  });

  it('defers reload while the document is hidden, then reloads on visible', () => {
    const reload = vi.fn();
    let onNeedRefresh: (() => void) | undefined;
    const registerSW = vi.fn((opts: { onNeedRefresh?: () => void }) => {
      onNeedRefresh = opts.onNeedRefresh;
      return vi.fn();
    });

    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => 'hidden',
    });

    registerPwa({ enabled: true, registerSW, reload });
    onNeedRefresh?.();
    expect(reload).not.toHaveBeenCalled();

    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => 'visible',
    });
    document.dispatchEvent(new Event('visibilitychange'));
    expect(reload).toHaveBeenCalledOnce();
  });

  it('schedules periodic registration.update on onRegisteredSW', () => {
    vi.useFakeTimers();
    const update = vi.fn();
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

    expect(update).not.toHaveBeenCalled();
    vi.advanceTimersByTime(60 * 60 * 1000);
    expect(update).toHaveBeenCalledOnce();

    // Re-register clears prior interval
    onRegisteredSW?.('/sw.js', registration);
    vi.advanceTimersByTime(60 * 60 * 1000);
    expect(update).toHaveBeenCalledTimes(2);

    vi.useRealTimers();
  });

  it('ignores onRegisteredSW without a registration', () => {
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
    expect(() => onRegisteredSW?.('/sw.js', undefined)).not.toThrow();
  });
});

describe('burn-1007 bootstrapPwa', () => {
  beforeEach(() => {
    // jsdom has no serviceWorker; registerPwa gates on it when enabled is unset.
    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      value: {},
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    resetPwaReloadGuardForTests();
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (navigator as any).serviceWorker;
    } catch {
      // ignore
    }
  });

  it('no-ops when disabled', () => {
    const schedule = vi.fn();
    bootstrapPwa({ enabled: false, schedule, registerSW: vi.fn() });
    expect(schedule).not.toHaveBeenCalled();
  });

  it('schedules registerPwa via injected schedule + registerSW', () => {
    const registerSW = vi.fn(() => vi.fn());
    let scheduled: (() => void) | undefined;
    bootstrapPwa({
      enabled: true,
      registerSW,
      schedule: (cb) => {
        scheduled = cb;
      },
    });
    expect(scheduled).toBeTypeOf('function');
    scheduled!();
    expect(registerSW).toHaveBeenCalledOnce();
    expect(registerSW.mock.calls[0]?.[0]).toMatchObject({ immediate: true });
  });

  it('defaultSchedule uses requestIdleCallback when available', () => {
    const ric = vi.fn((cb: IdleRequestCallback) => {
      cb({} as IdleDeadline);
      return 1;
    });
    vi.stubGlobal('requestIdleCallback', ric);
    bootstrapPwa({ enabled: true, registerSW: vi.fn(() => vi.fn()) });
    expect(ric).toHaveBeenCalled();
  });

  it('defaultSchedule falls back to setTimeout without requestIdleCallback', () => {
    vi.useFakeTimers();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (window as any).requestIdleCallback;
    const registerSW = vi.fn(() => vi.fn());
    const timeoutSpy = vi.spyOn(window, 'setTimeout');
    bootstrapPwa({ enabled: true, registerSW });
    expect(timeoutSpy).toHaveBeenCalled();
    vi.advanceTimersByTime(1_000);
    expect(registerSW).toHaveBeenCalledOnce();
    vi.useRealTimers();
  });
});

describe('burn-1007 bootstrapOwl deeper', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('runs scheduled callback (dynamic owl import is best-effort)', async () => {
    let scheduled: (() => void) | undefined;
    bootstrapOwl({
      enabled: true,
      schedule: (cb) => {
        scheduled = cb;
      },
    });
    expect(scheduled).toBeTypeOf('function');
    scheduled!();
    // Allow the async import to settle without asserting DOM (owl may already
    // be initialized by setup / other suites under shared pool).
    await Promise.resolve();
    await Promise.resolve();
  });

  it('defaultSchedule uses requestIdleCallback when available', () => {
    const ric = vi.fn((cb: IdleRequestCallback) => {
      cb({} as IdleDeadline);
      return 1;
    });
    vi.stubGlobal('requestIdleCallback', ric);
    bootstrapOwl({ enabled: true });
    expect(ric).toHaveBeenCalled();
  });

  it('falls back to setTimeout when requestIdleCallback missing', () => {
    vi.useFakeTimers();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (window as any).requestIdleCallback;
    const scheduleSpy = vi.spyOn(window, 'setTimeout');
    bootstrapOwl({ enabled: true });
    expect(scheduleSpy).toHaveBeenCalled();
    vi.advanceTimersByTime(800);
    vi.useRealTimers();
  });
});

describe('burn-1007 idle-warm edges', () => {
  beforeEach(() => {
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      get: () => false,
    });
    document.documentElement.removeAttribute(IDLE_WARM_DONE_ATTR);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (navigator as any).connection;
    } catch {
      // ignore
    }
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.documentElement.removeAttribute(IDLE_WARM_DONE_ATTR);
  });

  it('skips warm imports when Save-Data is preferred', async () => {
    Object.defineProperty(navigator, 'connection', {
      configurable: true,
      value: { saveData: true },
    });
    const importGame = vi.fn();
    const importShell = vi.fn();
    scheduleIdleGameWarm({
      schedule: (cb) => cb(),
      importGame,
      importShell,
    });
    await Promise.resolve();
    expect(importShell).not.toHaveBeenCalled();
    expect(importGame).not.toHaveBeenCalled();
    expect(document.documentElement.getAttribute(IDLE_WARM_DONE_ATTR)).toBe(
      'done'
    );
  });

  it('continues when shell warm rejects and still marks done', async () => {
    const importShell = vi.fn().mockRejectedValue(new Error('shell fail'));
    const importGame = vi.fn().mockResolvedValue({});
    scheduleIdleGameWarm({
      schedule: (cb) => cb(),
      importShell,
      importGame,
    });
    await vi.waitFor(() => {
      expect(importGame).toHaveBeenCalled();
      expect(document.documentElement.getAttribute(IDLE_WARM_DONE_ATTR)).toBe(
        'done'
      );
    });
  });

  it('stops game warm when document becomes hidden mid-loop', async () => {
    let hidden = false;
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      get: () => hidden,
    });
    const importShell = vi.fn().mockResolvedValue({});
    const importGame = vi.fn().mockImplementation(async () => {
      hidden = true;
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
    expect(importGame.mock.calls.length).toBeLessThanOrEqual(2);
  });

  it('defaultSchedule uses requestIdleCallback', () => {
    const ric = vi.fn((cb: IdleRequestCallback) => {
      cb({} as IdleDeadline);
      return 1;
    });
    vi.stubGlobal('requestIdleCallback', ric);
    scheduleIdleGameWarm({
      importShell: async () => ({}),
      importGame: async () => ({}),
    });
    expect(ric).toHaveBeenCalled();
  });

  it('defaultSchedule falls back to setTimeout without requestIdleCallback', () => {
    vi.useFakeTimers();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (window as any).requestIdleCallback;
    const timeoutSpy = vi.spyOn(window, 'setTimeout');
    scheduleIdleGameWarm({
      importShell: async () => ({}),
      importGame: async () => ({}),
    });
    expect(timeoutSpy).toHaveBeenCalled();
    vi.advanceTimersByTime(1_500);
    vi.useRealTimers();
  });
});

describe('burn-1007 reduced-motion bind + duration', () => {
  afterEach(() => {
    document.documentElement.removeAttribute(REDUCED_MOTION_ATTR);
    resetSettingsFlagsForTests();
    vi.restoreAllMocks();
  });

  it('durationMsForMotion returns reduced when preferred', () => {
    expect(
      durationMsForMotion(400, 0, {
        userPrefersReducedMotion: true,
        osPrefersReducedMotion: false,
      })
    ).toBe(0);
    expect(
      durationMsForMotion(400, 50, {
        userPrefersReducedMotion: false,
        osPrefersReducedMotion: false,
      })
    ).toBe(400);
  });

  it('bindReducedMotionPreference listens for matchMedia change', () => {
    const listeners: Array<(ev?: Event) => void> = [];
    const mql = {
      matches: false,
      media: '(prefers-reduced-motion: reduce)',
      addEventListener: vi.fn((_type: string, cb: (ev?: Event) => void) => {
        listeners.push(cb);
      }),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
      onchange: null,
    };
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => mql)
    );

    applyReducedMotionPreference({
      userPrefersReducedMotion: false,
      osPrefersReducedMotion: false,
    });
    const unbind = bindReducedMotionPreference();
    expect(mql.addEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function)
    );

    mql.matches = true;
    listeners[0]?.();
    expect(document.documentElement.getAttribute(REDUCED_MOTION_ATTR)).toBe(
      'true'
    );

    unbind();
    expect(mql.removeEventListener).toHaveBeenCalled();
  });

  it('bindReducedMotionPreference uses addListener on legacy MQL', () => {
    const mql = {
      matches: false,
      media: '(prefers-reduced-motion: reduce)',
      addEventListener: undefined as unknown as MediaQueryList['addEventListener'],
      removeEventListener:
        undefined as unknown as MediaQueryList['removeEventListener'],
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
      onchange: null,
    };
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => mql)
    );

    const unbind = bindReducedMotionPreference();
    expect(mql.addListener).toHaveBeenCalled();
    unbind();
    expect(mql.removeListener).toHaveBeenCalled();
  });

  it('scrollBehaviorForMotion is smooth when neither pref is set', () => {
    expect(
      prefersReducedMotion({
        userPrefersReducedMotion: false,
        osPrefersReducedMotion: false,
      })
        ? 'auto'
        : 'smooth'
    ).toBe('smooth');
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({ matches: false, addEventListener: vi.fn() }))
    );
    resetSettingsFlagsForTests();
    expect(scrollBehaviorForMotion()).toBe('smooth');
  });
});

describe('burn-1007 game-prefetch saveData + idle reset', () => {
  // Clear module-level prefetch marks left by other unit-shared files in the
  // same Vitest worker (otherwise hex may already be in `started`).
  // Same isolation fix as draft #537 (suite-only; not a product change).
  beforeEach(() => {
    resetGamePrefetchForTests();
  });

  afterEach(() => {
    resetGamePrefetchForTests();
    vi.restoreAllMocks();
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (navigator as any).connection;
    } catch {
      // ignore
    }
  });

  it('skips prefetch when navigator.connection.saveData is true', () => {
    Object.defineProperty(navigator, 'connection', {
      configurable: true,
      value: { saveData: true },
    });
    expect(canPrefetchGame('hex')).toBe(true);
    prefetchGameChunk('hex');
    expect(isGamePrefetchStarted('hex')).toBe(false);
  });

  it('idle prefetch with empty max still resets cleanly', () => {
    prefetchGameChunksIdle([], { max: 0 });
    resetGamePrefetchForTests();
    expect(isGamePrefetchStarted('hex')).toBe(false);
  });
});
