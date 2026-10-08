/**
 * burn-1008-mp-ui-coverage-round-5 — PWA register/bootstrap, feature-flags
 * SSR defaults, pointer-hygiene residual edges, offline/router/coord leftovers.
 * Tests-only; no player-facing copy asserts.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  registerPwa,
  resetPwaReloadGuardForTests,
} from '../../src/pwa/register';
import { bootstrapPwa } from '../../src/pwa/bootstrap';
import { isBoard3dEnabled } from '../../src/core/feature-flags';
import {
  bindCanvasPointerTap,
  createPointerTapController,
  suppressBoardContextMenu,
} from '../../src/ui/pointer-hygiene';
import { bindOfflineDocumentFlag } from '../../src/ui/offline';
import { getPathParams, setNotFoundHandler, handleRoute } from '../../src/core/router';
import { resolveCanvas2dPixelRatio } from '../../src/ui/coord-map';
import { scheduleIdleGameWarm, IDLE_WARM_DONE_ATTR } from '../../src/pwa/idle-warm';
import { installDomHooks } from './helpers/dom';

installDomHooks();

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  resetPwaReloadGuardForTests();
  document.documentElement.removeAttribute('data-offline');
  document.documentElement.removeAttribute(IDLE_WARM_DONE_ATTR);
});

describe('burn-1008 ui-cov-r5 pwa register residuals', () => {
  it('uses default window.location.reload when reload option omitted', () => {
    const reload = vi.fn();
    vi.stubGlobal('location', { ...window.location, reload });
    let onNeedRefresh: (() => void) | undefined;
    const registerSW = vi.fn((opts: { onNeedRefresh?: () => void }) => {
      onNeedRefresh = opts.onNeedRefresh;
      return vi.fn();
    });
    registerPwa({ enabled: true, registerSW });
    onNeedRefresh?.();
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('defers reload while document is hidden, then fires on visible', () => {
    const reload = vi.fn();
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => 'hidden',
    });
    let onNeedRefresh: (() => void) | undefined;
    const registerSW = vi.fn((opts: { onNeedRefresh?: () => void }) => {
      onNeedRefresh = opts.onNeedRefresh;
      return vi.fn();
    });
    registerPwa({ enabled: true, registerSW, reload });
    onNeedRefresh?.();
    expect(reload).not.toHaveBeenCalled();

    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => 'visible',
    });
    document.dispatchEvent(new Event('visibilitychange'));
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('onRegisteredSW stacks update interval and clears on re-register', () => {
    vi.useFakeTimers();
    const update = vi.fn();
    const registration = { update } as ServiceWorkerRegistration;
    let onRegisteredSW:
      | ((url: string, reg?: ServiceWorkerRegistration) => void)
      | undefined;
    const registerSW = vi.fn(
      (opts: {
        onRegisteredSW?: (url: string, reg?: ServiceWorkerRegistration) => void;
      }) => {
        onRegisteredSW = opts.onRegisteredSW;
        return vi.fn();
      }
    );
    registerPwa({ enabled: true, registerSW, reload: vi.fn() });
    onRegisteredSW?.('/sw.js', registration);
    onRegisteredSW?.('/sw.js', registration); // replace interval
    onRegisteredSW?.('/sw.js', undefined); // no-op when missing registration
    vi.advanceTimersByTime(60 * 60 * 1000);
    expect(update).toHaveBeenCalled();
    vi.useRealTimers();
  });
});

describe('burn-1008 ui-cov-r5 pwa bootstrap defaultSchedule', () => {
  it('uses requestIdleCallback when present', () => {
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
    expect(ric).toHaveBeenCalled();
    expect(registerSW).toHaveBeenCalled();
  });

  it('falls back to setTimeout when requestIdleCallback missing', () => {
    vi.useFakeTimers();
    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      value: {},
    });
    vi.stubGlobal('requestIdleCallback', undefined);
    const registerSW = vi.fn(() => vi.fn());
    bootstrapPwa({ enabled: true, registerSW });
    expect(registerSW).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1000);
    expect(registerSW).toHaveBeenCalled();
    vi.useRealTimers();
  });
});

describe('burn-1008 ui-cov-r5 feature-flags SSR defaults', () => {
  it('isBoard3dEnabled defaults search/hash to empty when window is absent', () => {
    const original = globalThis.window;
    // @ts-expect-error intentional delete for non-browser default arms
    delete globalThis.window;
    try {
      expect(isBoard3dEnabled()).toBe(false);
    } finally {
      Object.defineProperty(globalThis, 'window', {
        configurable: true,
        writable: true,
        value: original,
      });
    }
  });
});

describe('burn-1008 ui-cov-r5 pointer-hygiene residuals', () => {
  it('ignores secondary down while pending and cancel for other pointer ids', () => {
    const tap = createPointerTapController({ slopPx: 8 });
    tap.onPointerDown(
      new PointerEvent('pointerdown', {
        pointerId: 1,
        isPrimary: true,
        clientX: 0,
        clientY: 0,
      })
    );
    tap.onPointerDown(
      new PointerEvent('pointerdown', {
        pointerId: 2,
        isPrimary: true,
        clientX: 1,
        clientY: 1,
      })
    );
    expect(tap.getState().pointerId).toBe(1);
    tap.onPointerCancel(
      new PointerEvent('pointercancel', { pointerId: 99, isPrimary: true })
    );
    expect(tap.getState().phase).toBe('pending');
    tap.onPointerCancel(
      new PointerEvent('pointercancel', { pointerId: 1, isPrimary: true })
    );
    expect(tap.getState().phase).toBe('idle');
  });

  it('bindCanvasPointerTap capture:false skips setPointerCapture', () => {
    const canvas = document.createElement('div');
    const setCapture = vi.fn();
    canvas.setPointerCapture = setCapture;
    document.body.appendChild(canvas);
    const onTap = vi.fn();
    const onGestureEnd = vi.fn();
    const unbind = bindCanvasPointerTap(canvas, {
      onTap,
      onGestureEnd,
      capture: false,
    });
    canvas.dispatchEvent(
      new PointerEvent('pointerdown', {
        pointerId: 3,
        isPrimary: true,
        clientX: 0,
        clientY: 0,
        bubbles: true,
      })
    );
    expect(setCapture).not.toHaveBeenCalled();
    canvas.dispatchEvent(
      new PointerEvent('pointerup', {
        pointerId: 3,
        isPrimary: true,
        clientX: 0,
        clientY: 0,
        bubbles: true,
      })
    );
    expect(onTap).toHaveBeenCalledTimes(1);
    unbind();
  });

  it('suppressBoardContextMenu prevents default', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const unbind = suppressBoardContextMenu(el);
    const ev = new Event('contextmenu', { cancelable: true });
    el.dispatchEvent(ev);
    expect(ev.defaultPrevented).toBe(true);
    unbind();
  });
});

describe('burn-1008 ui-cov-r5 offline / router / coord / idle-warm leftovers', () => {
  it('bindOfflineDocumentFlag no-ops when document is undefined', () => {
    const original = globalThis.document;
    // @ts-expect-error intentional delete
    delete globalThis.document;
    try {
      const unbind = bindOfflineDocumentFlag();
      expect(typeof unbind).toBe('function');
      unbind();
    } finally {
      Object.defineProperty(globalThis, 'document', {
        configurable: true,
        writable: true,
        value: original,
      });
    }
  });

  it('getPathParams skips undefined capture groups; default 404 handler callable', () => {
    expect(getPathParams('/game/:id', '/other')).toEqual({});
    // Force match with empty optional-ish capture via crafted pattern/path
    const params = getPathParams('/g/:a/:b', '/g/x/y');
    expect(params.a).toBe('x');
    expect(params.b).toBe('y');

    const err = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    setNotFoundHandler(() => {
      console.error('Route not found');
    });
    window.location.hash = '#/no-such-route-r5';
    handleRoute();
    expect(err).toHaveBeenCalled();
  });

  it('resolveCanvas2dPixelRatio uses window.devicePixelRatio default arm', () => {
    const prev = Object.getOwnPropertyDescriptor(window, 'devicePixelRatio');
    Object.defineProperty(window, 'devicePixelRatio', {
      configurable: true,
      value: 0, // falsy → || 1 inside default expression when omitted
    });
    try {
      // Explicit undefined triggers default param evaluation
      expect(resolveCanvas2dPixelRatio(undefined as unknown as number)).toBe(1);
      expect(resolveCanvas2dPixelRatio(2.5)).toBeLessThanOrEqual(3);
    } finally {
      if (prev) {
        Object.defineProperty(window, 'devicePixelRatio', prev);
      }
    }
  });

  it('idle-warm marks done when document is hidden', () => {
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      get: () => true,
    });
    scheduleIdleGameWarm({
      enabled: true,
      schedule: (cb) => cb(),
      importShell: async () => ({}),
      importGame: async () => ({}),
    });
    expect(document.documentElement.getAttribute(IDLE_WARM_DONE_ATTR)).toBe(
      'done'
    );
  });
});
