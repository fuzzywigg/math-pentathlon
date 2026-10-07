/**
 * Tiny menu-safe settings peeks.
 *
 * Kept outside `core/storage` so the landing page can read one boolean without
 * pulling the progress store into the menu critical path. Storage updates the
 * in-memory flag when settings change; until then we peek localStorage once.
 */

/** Must match `STORAGE_KEY` in `src/core/storage/storage.ts`. */
const PROGRESS_STORAGE_KEY = 'math-pentathlon-progress';

/** null = not yet synced from storage module or localStorage. */
let userReducedMotion: boolean | null = null;

function peekReducedMotionFromLocalStorage(): boolean {
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

/** Read user reduced-motion preference (menu-safe). */
export function getUserReducedMotionFlag(): boolean {
  if (userReducedMotion === null) {
    userReducedMotion = peekReducedMotionFromLocalStorage();
  }
  return userReducedMotion;
}

/** Called by the storage module when settings load or change. */
export function setUserReducedMotionFlag(value: boolean): void {
  userReducedMotion = value;
}

/** Test helper — clear the in-memory cache. */
export function resetSettingsFlagsForTests(): void {
  userReducedMotion = null;
}
