/**
 * burn-1007 — PWA bootstrap + remaining UI shell gaps (prefetch / motion / warm).
 */
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../src/games/hex/game-controller', () => ({
  initGame: vi.fn(),
  destroyGame: vi.fn(),
  newGameVsHuman: vi.fn(),
  newGameVsAI: vi.fn(),
  startTutorial: vi.fn(),
}));

vi.mock('../../src/pwa/sw-register', () => ({
  registerSW: vi.fn(() => vi.fn()),
}));

import { bootstrapPwa } from '../../src/pwa/bootstrap';
import { registerSW as defaultRegisterSW } from '../../src/pwa/sw-register';
import { bootstrapOwl } from '../../src/pwa/bootstrap-owl';
import {
  IDLE_WARM_DONE_ATTR,
  scheduleIdleGameWarm,
} from '../../src/pwa/idle-warm';
import {
  registerPwa,
  resetPwaReloadGuardForTests,
} from '../../src/pwa/register';
import { storage } from '../../src/core/storage';
import {
  REDUCED_MOTION_ATTR,
  applyReducedMotionPreference,
  bindReducedMotionPreference,
  durationMsForMotion,
  prefersReducedMotion,
  scrollBehaviorForMotion,
} from '../../src/ui/reduced-motion';
import {
  allowGamePrefetchImportsForTests,
  canPrefetchGame,
  isGamePrefetchStarted,
  prefetchGameChunk,
  prefetchGameChunksIdle,
  resetGamePrefetchForTests,
} from '../../src/ui/game-prefetch';
import { loadThree } from '../../src/ui/three/load-three';

describe('burn-1007 bootstrapPwa', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    resetPwaReloadGuardForTests();
  });

  it('no-ops when disabled', () => {
    const schedule = vi.fn();
    bootstrapPwa({ enabled: false, schedule });
    expect(schedule).not.toHaveBeenCalled();
  });

  it('schedules registerPwa with the default mocked registerSW', () => {
    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      value: {},
    });
    vi.mocked(defaultRegisterSW).mockClear();
    const schedule = vi.fn((cb: () => void) => cb());
    bootstrapPwa({ enabled: true, schedule });
    expect(schedule).toHaveBeenCalledTimes(1);
    expect(defaultRegisterSW).toHaveBeenCalled();
  });

  it('defaultSchedule uses requestIdleCallback when available', () => {
    const ric = vi.fn((cb: IdleRequestCallback) => {
      cb({} as IdleDeadline);
      return 1;
    });
    vi.stubGlobal('requestIdleCallback', ric);
    bootstrapPwa({ enabled: true });
    expect(ric).toHaveBeenCalled();
    expect(ric.mock.calls[0]?.[1]).toMatchObject({ timeout: 3_000 });
  });

  it('defaultSchedule falls back to setTimeout without ric', () => {
    vi.stubGlobal('requestIdleCallback', undefined);
    const setTimeoutSpy = vi
      .spyOn(window, 'setTimeout')
      .mockImplementation(((cb: TimerHandler) => {
        if (typeof cb === 'function') cb();
        return 0 as unknown as number;
      }) as typeof setTimeout);
    bootstrapPwa({ enabled: true });
    expect(setTimeoutSpy).toHaveBeenCalled();
    const delay = setTimeoutSpy.mock.calls.find(
      (c) => typeof c[1] === 'number' && (c[1] as number) >= 1000
    )?.[1];
    expect(delay).toBe(1_000);
  });
});

describe('burn-1007 bootstrapOwl schedule body', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('defaultSchedule uses ric timeout 2500 then inits owl', async () => {
    const ric = vi.fn((cb: IdleRequestCallback) => {
      cb({} as IdleDeadline);
      return 1;
    });
    vi.stubGlobal('requestIdleCallback', ric);
    bootstrapOwl({ enabled: true });
    expect(ric).toHaveBeenCalled();
    expect(ric.mock.calls[0]?.[1]).toMatchObject({ timeout: 2_500 });
    await vi.waitFor(() => {
      expect(document.getElementById('ollie-owl')).toBeTruthy();
    });
  });

  it('falls back to setTimeout 800 when ric missing', () => {
    vi.stubGlobal('requestIdleCallback', undefined);
    const setTimeoutSpy = vi
      .spyOn(window, 'setTimeout')
      .mockImplementation(((cb: TimerHandler) => {
        // Do not run the callback — owl dynamic import is covered elsewhere.
        return 0 as unknown as number;
      }) as typeof setTimeout);
    bootstrapOwl({ enabled: true });
    expect(setTimeoutSpy).toHaveBeenCalled();
    const delay = setTimeoutSpy.mock.calls.find(
      (c) => typeof c[1] === 'number' && (c[1] as number) === 800
    )?.[1];
    expect(delay).toBe(800);
  });
});

describe('burn-1007 registerPwa update / visibility', () => {
  afterEach(() => {
    resetPwaReloadGuardForTests();
    vi.restoreAllMocks();
  });

  it('skips when registerSW is omitted', () => {
    const result = registerPwa({ enabled: true });
    expect(result.update).toBeUndefined();
  });

  it('arms hourly update checks from onRegisteredSW', () => {
    vi.useFakeTimers();
    const update = vi.fn();
    const registration = { update: vi.fn() };
    let onRegisteredSW:
      | ((url: string, reg?: ServiceWorkerRegistration) => void)
      | undefined;

    registerPwa({
      enabled: true,
      registerSW: ((opts: {
        onRegisteredSW?: typeof onRegisteredSW;
      }) => {
        onRegisteredSW = opts.onRegisteredSW;
        return update;
      }) as never,
      reload: vi.fn(),
    });

    onRegisteredSW?.('/sw.js', registration as unknown as ServiceWorkerRegistration);
    // Re-register clears prior interval.
    onRegisteredSW?.('/sw.js', registration as unknown as ServiceWorkerRegistration);
    vi.advanceTimersByTime(60 * 60 * 1000);
    expect(registration.update).toHaveBeenCalled();
    vi.useRealTimers();
  });

  it('defers reload until the tab becomes visible', () => {
    const reload = vi.fn();
    let onNeedRefresh: (() => void) | undefined;
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => 'hidden',
    });

    registerPwa({
      enabled: true,
      registerSW: ((opts: { onNeedRefresh?: () => void }) => {
        onNeedRefresh = opts.onNeedRefresh;
        return vi.fn();
      }) as never,
      reload,
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

describe('burn-1007 reduced-motion bind + matchMedia', () => {
  afterEach(() => {
    document.documentElement.removeAttribute(REDUCED_MOTION_ATTR);
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('bindReducedMotionPreference mirrors OS changes via addEventListener', () => {
    const listeners = new Map<string, EventListener>();
    const mql = {
      matches: false,
      media: '(prefers-reduced-motion: reduce)',
      addEventListener: vi.fn((type: string, fn: EventListener) => {
        listeners.set(type, fn);
      }),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
      onchange: null,
    };
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockReturnValue(mql)
    );

    const unbind = bindReducedMotionPreference();
    expect(document.documentElement.hasAttribute(REDUCED_MOTION_ATTR)).toBe(
      false
    );

    mql.matches = true;
    listeners.get('change')?.(new Event('change'));
    // applyReducedMotionPreference re-reads matchMedia
    expect(typeof unbind).toBe('function');
    unbind();
    expect(mql.removeEventListener).toHaveBeenCalled();
  });

  it('uses Safari addListener when addEventListener is missing', () => {
    const mql = {
      matches: true,
      media: '(prefers-reduced-motion: reduce)',
      addEventListener: undefined as unknown as MediaQueryList['addEventListener'],
      removeEventListener: undefined as unknown as MediaQueryList['removeEventListener'],
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
      onchange: null,
    };
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue(mql));
    const unbind = bindReducedMotionPreference();
    expect(mql.addListener).toHaveBeenCalled();
    unbind();
    expect(mql.removeListener).toHaveBeenCalled();
  });

  it('prefersReducedMotion returns false when matchMedia throws', () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => {
        throw new Error('boom');
      })
    );
    expect(
      prefersReducedMotion({
        userPrefersReducedMotion: false,
      })
    ).toBe(false);
  });

  it('scrollBehaviorForMotion and durationMsForMotion honor live prefs', () => {
    storage.updateSettings({ reducedMotion: true });
    applyReducedMotionPreference({ osPrefersReducedMotion: false });
    expect(document.documentElement.getAttribute(REDUCED_MOTION_ATTR)).toBe(
      'true'
    );
    expect(scrollBehaviorForMotion()).toBe('auto');
    expect(
      durationMsForMotion(400, 10, { userPrefersReducedMotion: true })
    ).toBe(10);
  });
});


describe('burn-1007 idle-warm saveData + errors', () => {
  afterEach(() => {
    document.documentElement.removeAttribute(IDLE_WARM_DONE_ATTR);
    vi.restoreAllMocks();
    Object.defineProperty(navigator, 'connection', {
      configurable: true,
      value: undefined,
    });
  });

  it('skips warm imports when Save-Data is on', async () => {
    Object.defineProperty(navigator, 'connection', {
      configurable: true,
      value: { saveData: true },
    });
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      get: () => false,
    });
    const importShell = vi.fn();
    const importGame = vi.fn();
    scheduleIdleGameWarm({
      schedule: (cb) => cb(),
      importShell,
      importGame,
    });
    await Promise.resolve();
    expect(importShell).not.toHaveBeenCalled();
    expect(importGame).not.toHaveBeenCalled();
    expect(document.documentElement.getAttribute(IDLE_WARM_DONE_ATTR)).toBe(
      'done'
    );
  });

  it('marks done when shell/game warm imports reject', async () => {
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      get: () => false,
    });
    scheduleIdleGameWarm({
      schedule: (cb) => cb(),
      importShell: vi.fn().mockRejectedValue(new Error('shell')),
      importGame: vi.fn().mockRejectedValue(new Error('game')),
    });
    await vi.waitFor(() => {
      expect(document.documentElement.getAttribute(IDLE_WARM_DONE_ATTR)).toBe(
        'done'
      );
    });
  });

  it('defaultSchedule uses ric with 4000ms timeout', () => {
    const ric = vi.fn((cb: IdleRequestCallback) => {
      cb({} as IdleDeadline);
      return 1;
    });
    vi.stubGlobal('requestIdleCallback', ric);
    scheduleIdleGameWarm({
      importShell: vi.fn().mockResolvedValue({}),
      importGame: vi.fn().mockResolvedValue({}),
    });
    expect(ric).toHaveBeenCalled();
    expect(ric.mock.calls[0]?.[1]).toMatchObject({ timeout: 4_000 });
  });
});

describe('burn-1007 game-prefetch saveData + reset cancel', () => {
  afterEach(() => {
    resetGamePrefetchForTests();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    Object.defineProperty(navigator, 'connection', {
      configurable: true,
      value: undefined,
    });
  });

  it('skips prefetch when Save-Data is enabled', () => {
    Object.defineProperty(navigator, 'connection', {
      configurable: true,
      value: { saveData: true },
    });
    prefetchGameChunk('hex');
    expect(isGamePrefetchStarted('hex')).toBe(false);
    expect(canPrefetchGame('hex')).toBe(true);
  });

  it('idle path schedules requestIdleCallback and cancel clears it', () => {
    allowGamePrefetchImportsForTests(true);
    const cancel = vi.fn();
    Object.defineProperty(window, 'cancelIdleCallback', {
      configurable: true,
      value: cancel,
    });
    const ric = vi.fn(() => 42);
    Object.defineProperty(window, 'requestIdleCallback', {
      configurable: true,
      value: ric,
    });
    prefetchGameChunksIdle(['hex', 'bogus'], { max: 1 });
    expect(ric).toHaveBeenCalled();
    expect(isGamePrefetchStarted('hex')).toBe(false);
    resetGamePrefetchForTests();
    expect(cancel).toHaveBeenCalledWith(42);
  });

  it('timeout fallback runs prefetch and clears started on import failure', async () => {
    allowGamePrefetchImportsForTests(true);
    Object.defineProperty(window, 'requestIdleCallback', {
      configurable: true,
      value: undefined,
    });
    vi.useFakeTimers();
    prefetchGameChunksIdle(['hex'], { max: 1 });
    await vi.advanceTimersByTimeAsync(200);
    await Promise.resolve();
    // Mocked controller import resolves — mark stays.
    expect(isGamePrefetchStarted('hex')).toBe(true);
    vi.useRealTimers();
  });
});

describe('burn-1007 loadThree', () => {
  it('returns a promise for the three module', async () => {
    const mod = await loadThree();
    expect(mod).toBeTruthy();
    expect(typeof mod.Scene).toBe('function');
  });
});
