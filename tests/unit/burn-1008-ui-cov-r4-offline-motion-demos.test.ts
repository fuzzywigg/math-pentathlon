/**
 * burn-1008-mp-ui-coverage-round-4 — offline / reduced-motion residual edges +
 * demo residual mounts (fraction / polyomino). Tests-only; no copy asserts.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  bindOfflineDocumentFlag,
  gameLoadErrorHint,
  isBrowserOffline,
} from '../../src/ui/offline';
import {
  applyReducedMotionPreference,
  bindReducedMotionPreference,
  prefersReducedMotion,
  REDUCED_MOTION_ATTR,
} from '../../src/ui/reduced-motion';
import { bootstrapPwa } from '../../src/pwa/bootstrap';
import { resetPwaReloadGuardForTests } from '../../src/pwa/register';
import { installDomHooks } from './helpers/dom';

installDomHooks();

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  document.documentElement.removeAttribute('data-offline');
  document.documentElement.removeAttribute(REDUCED_MOTION_ATTR);
  try {
    resetPwaReloadGuardForTests();
  } catch {
    // ignore
  }
});

describe('burn-1008 ui-cov-r4 offline residuals', () => {
  it('isBrowserOffline false when navigator is undefined', () => {
    const original = globalThis.navigator;
    // @ts-expect-error intentional delete for non-browser branch
    delete globalThis.navigator;
    expect(isBrowserOffline()).toBe(false);
    Object.defineProperty(globalThis, 'navigator', {
      configurable: true,
      value: original,
    });
  });

  it('gameLoadErrorHint offline branch returns distinct length from online', () => {
    const offline = gameLoadErrorHint(true);
    const online = gameLoadErrorHint(false);
    expect(offline.length).toBeGreaterThan(0);
    expect(online.length).toBeGreaterThan(0);
    expect(offline).not.toBe(online);
  });

  it('bindOfflineDocumentFlag is idempotent unsubscribe', () => {
    const unbind = bindOfflineDocumentFlag();
    expect(typeof unbind).toBe('function');
    unbind();
    unbind();
  });
});

describe('burn-1008 ui-cov-r4 reduced-motion residuals', () => {
  it('prefersReducedMotion false when matchMedia throws', () => {
    vi.stubGlobal('matchMedia', () => {
      throw new Error('matchMedia boom');
    });
    expect(
      prefersReducedMotion({ userPrefersReducedMotion: false })
    ).toBe(false);
  });

  it('bindReducedMotionPreference uses Safari addListener fallback', () => {
    const addListener = vi.fn();
    const removeListener = vi.fn();
    vi.stubGlobal('matchMedia', () => ({
      matches: false,
      addListener,
      removeListener,
      // no addEventListener → Safari < 14 path
    }));
    const unbind = bindReducedMotionPreference();
    expect(addListener).toHaveBeenCalled();
    unbind();
    expect(removeListener).toHaveBeenCalled();
  });

  it('bindReducedMotionPreference returns noop when matchMedia throws', () => {
    vi.stubGlobal('matchMedia', () => {
      throw new Error('no mql');
    });
    const unbind = bindReducedMotionPreference();
    expect(() => unbind()).not.toThrow();
  });

  it('applyReducedMotionPreference toggles html attr from options', () => {
    applyReducedMotionPreference({ userPrefersReducedMotion: true });
    expect(document.documentElement.getAttribute(REDUCED_MOTION_ATTR)).toBe(
      'true'
    );
    applyReducedMotionPreference({
      userPrefersReducedMotion: false,
      osPrefersReducedMotion: false,
    });
    expect(
      document.documentElement.hasAttribute(REDUCED_MOTION_ATTR)
    ).toBe(false);
  });
});

describe('burn-1008 ui-cov-r4 pwa bootstrap defaultSchedule', () => {
  it('uses requestIdleCallback timeout option when present', () => {
    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      value: {},
    });
    const ric = vi.fn((cb: IdleRequestCallback, _opts?: IdleRequestOptions) => {
      cb({ didTimeout: false, timeRemaining: () => 0 } as IdleDeadline);
      return 1;
    });
    vi.stubGlobal('requestIdleCallback', ric);
    const registerSW = vi.fn(() => vi.fn());
    bootstrapPwa({ enabled: true, registerSW });
    expect(ric).toHaveBeenCalled();
    expect(ric.mock.calls[0]?.[1]).toMatchObject({ timeout: 3_000 });
    expect(registerSW).toHaveBeenCalled();
  });
});

describe('burn-1008 ui-cov-r4 demo residual mounts', () => {
  it('fraction-demo and polyomino-demo mount without throwing', async () => {
    const fracRoot = document.createElement('div');
    const polyRoot = document.createElement('div');
    document.body.append(fracRoot, polyRoot);

    const { renderFractionDemo } = await import('../../src/demos/fraction-demo');
    const { renderPolyominoDemo } = await import(
      '../../src/demos/polyomino-demo'
    );

    expect(() => renderFractionDemo(fracRoot)).not.toThrow();
    expect(fracRoot.childElementCount).toBeGreaterThan(0);
    expect(() => renderPolyominoDemo(polyRoot)).not.toThrow();
    expect(polyRoot.childElementCount).toBeGreaterThan(0);
  });
});
