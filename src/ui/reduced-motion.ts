/**
 * Reduced-motion preference for cheap tablets / accessibility.
 *
 * Combines OS `prefers-reduced-motion` with the stored user setting so kids
 * who enable reduced motion in-app get the same CSS + scroll behavior even
 * when the OS preference is unset.
 *
 * Intentionally does **not** import `core/storage` — that pulls the full
 * progress store onto the menu critical path. Menu only needs one boolean.
 */

export const REDUCED_MOTION_ATTR = 'data-reduced-motion';

/**
 * Must match `STORAGE_KEY` in `src/core/storage/storage.ts`.
 * Duplicated so the menu never static-imports the storage module.
 */
const PROGRESS_STORAGE_KEY = 'math-pentathlon-progress';

export type ReducedMotionOptions = {
  /** Injected for tests; defaults to stored settings.reducedMotion. */
  userPrefersReducedMotion?: boolean;
  /** Injected for tests; defaults to matchMedia('(prefers-reduced-motion: reduce)'). */
  osPrefersReducedMotion?: boolean;
};

/** Peek only `settings.reducedMotion` without loading the storage module. */
function readUserReducedMotionSetting(): boolean {
  if (typeof localStorage === 'undefined') return false;
  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as {
      settings?: { reducedMotion?: boolean };
    };
    return parsed?.settings?.reducedMotion === true;
  } catch {
    return false;
  }
}

/** True when OS and/or user settings ask for less motion. */
export function prefersReducedMotion(
  options: ReducedMotionOptions = {}
): boolean {
  const userPref =
    options.userPrefersReducedMotion ?? readUserReducedMotionSetting();
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
