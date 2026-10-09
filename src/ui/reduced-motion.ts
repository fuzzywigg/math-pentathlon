/**
 * Reduced-motion preference for cheap tablets / accessibility.
 *
 * Combines OS `prefers-reduced-motion` with the stored user setting so kids
 * who enable reduced motion in-app get the same CSS + scroll behavior even
 * when the OS preference is unset.
 *
 * User setting comes from `settings-flags` (tiny core module) — not the full
 * progress store — so the menu never static-imports `core/storage`.
 */

import { getUserReducedMotionFlag } from '../core/settings-flags';

export const REDUCED_MOTION_ATTR = 'data-reduced-motion';

export type ReducedMotionOptions = {
  /** Injected for tests; defaults to stored settings.reducedMotion. */
  userPrefersReducedMotion?: boolean;
  /** Injected for tests; defaults to matchMedia('(prefers-reduced-motion: reduce)'). */
  osPrefersReducedMotion?: boolean;
};

/** True when OS and/or user settings ask for less motion. */
export function prefersReducedMotion(
  options: ReducedMotionOptions = {}
): boolean {
  const userPref =
    options.userPrefersReducedMotion ?? getUserReducedMotionFlag();
  if (userPref) return true;

  if (typeof options.osPrefersReducedMotion === 'boolean') {
    return options.osPrefersReducedMotion;
  }

  if (
    typeof window === 'undefined' ||
    typeof window.matchMedia !== 'function'
  ) {
    return false;
  }

  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

/**
 * Mirror the preference onto `<html>` so CSS can target
 * `html[data-reduced-motion="true"]` in addition to the media query.
 */
export function applyReducedMotionPreference(
  options: ReducedMotionOptions = {}
): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (prefersReducedMotion(options)) {
    root.setAttribute(REDUCED_MOTION_ATTR, 'true');
  } else {
    root.removeAttribute(REDUCED_MOTION_ATTR);
  }
}

/**
 * Keep the html attribute in sync when the OS preference flips.
 * Returns an unsubscribe function.
 */
export function bindReducedMotionPreference(): () => void {
  applyReducedMotionPreference();

  if (
    typeof window === 'undefined' ||
    typeof window.matchMedia !== 'function'
  ) {
    return () => undefined;
  }

  let mql: MediaQueryList;
  try {
    mql = window.matchMedia('(prefers-reduced-motion: reduce)');
  } catch {
    return () => undefined;
  }

  const onChange = (): void => {
    applyReducedMotionPreference();
  };

  if (typeof mql.addEventListener === 'function') {
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }

  // Safari < 14
  mql.addListener(onChange);
  return () => mql.removeListener(onChange);
}

/** Smooth scroll when motion is OK; instant jump when reduced. */
export function scrollBehaviorForMotion(): ScrollBehavior {
  return prefersReducedMotion() ? 'auto' : 'smooth';
}

/**
 * Duration helper for JS-driven animations / timeouts.
 * Returns `reducedMs` (default 0) when the user prefers less motion.
 */
export function durationMsForMotion(
  fullMs: number,
  reducedMs = 0,
  options: ReducedMotionOptions = {}
): number {
  return prefersReducedMotion(options) ? reducedMs : fullMs;
}
