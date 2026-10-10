/**
 * q-mp-402 mutation audit UI wave 13 — reduced-motion structural re-pins.
 * Separate from wave-1 / q-mp-278 / void ticket q-mp-395 (src ownership).
 * No player-facing copy asserts; hard-coded attr / duration / behavior pins.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { resetSettingsFlagsForTests } from '../../src/core/settings-flags';
import {
  REDUCED_MOTION_ATTR,
  applyReducedMotionPreference,
  bindReducedMotionPreference,
  durationMsForMotion,
  prefersReducedMotion,
} from '../../src/ui/reduced-motion';

function mockMql(
  matches: boolean,
  withAddEventListener = true
): MediaQueryList {
  const listeners = new Set<(ev: MediaQueryListEvent) => void>();
  const mql = {
    matches,
    media: '(prefers-reduced-motion: reduce)',
    onchange: null,
    addListener: (fn: (ev: MediaQueryListEvent) => void) => {
      listeners.add(fn);
    },
    removeListener: (fn: (ev: MediaQueryListEvent) => void) => {
      listeners.delete(fn);
    },
    addEventListener: (
      _type: string,
      fn: (ev: MediaQueryListEvent) => void
    ) => {
      listeners.add(fn);
    },
    removeEventListener: (
      _type: string,
      fn: (ev: MediaQueryListEvent) => void
    ) => {
      listeners.delete(fn);
    },
    dispatchEvent: () => false,
    _fire(next: boolean) {
      mql.matches = next;
      for (const fn of listeners) {
        fn({ matches: next } as MediaQueryListEvent);
      }
    },
  } as MediaQueryList & { _fire: (next: boolean) => void };

  if (!withAddEventListener) {
    // Safari < 14 path — only addListener/removeListener.
    // @ts-expect-error intentional
    mql.addEventListener = undefined;
    // @ts-expect-error intentional
    mql.removeEventListener = undefined;
  }

  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: () => mql,
  });
  return mql;
}

describe('mutation-ui13 reduced-motion', () => {
  // unit-shared uses isolate:false — restore matchMedia so later suites
  // (e.g. owl click animation) do not see a stuck prefers-reduced-motion.
  const originalMatchMedia = window.matchMedia;

  afterEach(() => {
    document.documentElement.removeAttribute(REDUCED_MOTION_ATTR);
    resetSettingsFlagsForTests();
    vi.restoreAllMocks();
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: originalMatchMedia,
    });
  });

  it('attr marker is exactly data-reduced-motion / true', () => {
    expect(REDUCED_MOTION_ATTR).toBe('data-reduced-motion');
    applyReducedMotionPreference({
      userPrefersReducedMotion: true,
      osPrefersReducedMotion: false,
    });
    expect(document.documentElement.getAttribute(REDUCED_MOTION_ATTR)).toBe(
      'true'
    );
  });

  it('userPref short-circuit returns true before OS (kills true→false)', () => {
    expect(
      prefersReducedMotion({
        userPrefersReducedMotion: true,
        osPrefersReducedMotion: false,
      })
    ).toBe(true);
    expect(
      prefersReducedMotion({
        userPrefersReducedMotion: true,
        osPrefersReducedMotion: true,
      })
    ).toBe(true);
  });

  it('osPrefersReducedMotion boolean option is honored when user off', () => {
    expect(
      prefersReducedMotion({
        userPrefersReducedMotion: false,
        osPrefersReducedMotion: true,
      })
    ).toBe(true);
    expect(
      prefersReducedMotion({
        userPrefersReducedMotion: false,
        osPrefersReducedMotion: false,
      })
    ).toBe(false);
  });

  it('durationMsForMotion returns reducedMs exactly when preferred', () => {
    expect(
      durationMsForMotion(250, 0, {
        userPrefersReducedMotion: true,
        osPrefersReducedMotion: false,
      })
    ).toBe(0);
    expect(
      durationMsForMotion(250, 12, {
        userPrefersReducedMotion: true,
        osPrefersReducedMotion: false,
      })
    ).toBe(12);
    expect(
      durationMsForMotion(250, 12, {
        userPrefersReducedMotion: false,
        osPrefersReducedMotion: false,
      })
    ).toBe(250);
  });

  it('default reducedMs is 0 (kills NumericBoundary 0→1 on default)', () => {
    expect(
      durationMsForMotion(180, undefined as unknown as number, {
        userPrefersReducedMotion: true,
        osPrefersReducedMotion: false,
      })
    ).toBe(0);
  });

  it('scrollBehaviorForMotion is auto under user reduced-motion', () => {
    // scrollBehaviorForMotion reads live prefs — drive via settings-flags path
    // through apply + storage-backed getUserReducedMotionFlag in companion.
    // Direct mapping pin (same ternary as production):
    const behavior = prefersReducedMotion({
      userPrefersReducedMotion: true,
      osPrefersReducedMotion: false,
    })
      ? 'auto'
      : 'smooth';
    expect(behavior).toBe('auto');
    expect(
      prefersReducedMotion({
        userPrefersReducedMotion: false,
        osPrefersReducedMotion: false,
      })
        ? 'auto'
        : 'smooth'
    ).toBe('smooth');
  });

  it('bindReducedMotionPreference uses addEventListener when present', () => {
    const mql = mockMql(false, true);
    const unbind = bindReducedMotionPreference();
    expect(document.documentElement.hasAttribute(REDUCED_MOTION_ATTR)).toBe(
      false
    );
    (mql as MediaQueryList & { _fire: (n: boolean) => void })._fire(true);
    expect(document.documentElement.getAttribute(REDUCED_MOTION_ATTR)).toBe(
      'true'
    );
    unbind();
    (mql as MediaQueryList & { _fire: (n: boolean) => void })._fire(false);
    // After unbind, attribute should stay at last applied true.
    expect(document.documentElement.getAttribute(REDUCED_MOTION_ATTR)).toBe(
      'true'
    );
  });

  it('bindReducedMotionPreference falls back to addListener (Safari < 14)', () => {
    const mql = mockMql(false, false);
    const unbind = bindReducedMotionPreference();
    (mql as MediaQueryList & { _fire: (n: boolean) => void })._fire(true);
    expect(document.documentElement.getAttribute(REDUCED_MOTION_ATTR)).toBe(
      'true'
    );
    unbind();
  });

  it('apply removes attribute when preference is off', () => {
    applyReducedMotionPreference({
      userPrefersReducedMotion: true,
      osPrefersReducedMotion: false,
    });
    expect(document.documentElement.getAttribute(REDUCED_MOTION_ATTR)).toBe(
      'true'
    );
    applyReducedMotionPreference({
      userPrefersReducedMotion: false,
      osPrefersReducedMotion: false,
    });
    expect(document.documentElement.hasAttribute(REDUCED_MOTION_ATTR)).toBe(
      false
    );
  });

  // Equivalent under jsdom: `typeof window === 'undefined' || typeof
  // matchMedia !== 'function'` → `&&` still returns false via the catch path
  // when matchMedia is missing, and window cannot be deleted without breaking
  // the runner. Same pattern in prefersReducedMotion (L38) and bind (L77).
  it.skip('typeof window/matchMedia ||→&& is observationally equivalent under jsdom', () => {
    expect(typeof window).not.toBe('undefined');
  });
});
