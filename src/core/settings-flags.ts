/**
 * Tiny menu-safe settings peeks.
 *
 * Kept outside `core/storage` so the landing page can read one boolean without
 * pulling the progress store into the menu critical path. Storage updates the
 * in-memory flag when settings change; until then we peek localStorage once.
 */

import { safeGetItem, safeParseJson } from './safe-web-storage';

/** Must match `STORAGE_KEY` in `src/core/storage/storage.ts`. */
const PROGRESS_STORAGE_KEY = 'math-pentathlon-progress';

/** null = not yet synced from storage module or localStorage. */
let userReducedMotion: boolean | null = null;

function peekReducedMotionFromLocalStorage(): boolean {
  const raw = safeGetItem(PROGRESS_STORAGE_KEY);
  if (!raw) {
    return false;
  }
  const parsedResult = safeParseJson(raw);
  if (!parsedResult.ok) {
    return false;
  }
  const parsed = parsedResult.value;
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    return false;
  }
  const settings = (parsed as { settings?: unknown }).settings;
  if (
    typeof settings !== 'object' ||
    settings === null ||
    Array.isArray(settings)
  ) {
    return false;
  }
  return (settings as { reducedMotion?: unknown }).reducedMotion === true;
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
