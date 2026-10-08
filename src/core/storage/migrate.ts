/**
 * Progress-blob schema migrations and defensive defaults.
 *
 * Extracted from StorageManager so unit tests can exercise the migration hook
 * without remounting the singleton. CURRENT_DATA_VERSION is 1; v0→v1 is a
 * no-op stamp (schema fields are identical) plus sanitize/defaults.
 */

import {
  sanitizeAchievements,
  sanitizeGameStatsMap,
  sanitizeOwlState,
  sanitizeProfile,
  sanitizeSettings,
  sanitizeStreak,
} from './sanitize';
import { CURRENT_DATA_VERSION, type ProgressData } from './types';

/** True for non-null, non-array objects (the only valid progress root / maps). */
export function isPlainProgressObject(
  value: unknown
): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Ensure all required progress fields exist and are type-safe.
 * Throws for non-plain-object roots so importData can preserve the prior session.
 */
export function ensureProgressDefaults(data: ProgressData): ProgressData {
  // importData relies on a throw here for JSON null / non-objects so the
  // previous in-memory session is preserved (returns false).
  if (!isPlainProgressObject(data)) {
    throw new TypeError('Progress data must be a plain object');
  }

  // `version || CURRENT` preserves historical import behavior: version 0
  // (and other falsy numbers) is stamped up to CURRENT_DATA_VERSION.
  const version =
    typeof data.version === 'number' && Number.isFinite(data.version)
      ? data.version || CURRENT_DATA_VERSION
      : CURRENT_DATA_VERSION;

  return {
    version,
    profile: sanitizeProfile(data.profile),
    streak: sanitizeStreak(data.streak),
    achievements: sanitizeAchievements(data.achievements),
    gameStats: sanitizeGameStatsMap(data.gameStats),
    owlState: sanitizeOwlState(data.owlState),
    settings: sanitizeSettings(data.settings),
  };
}

/**
 * Apply schema migrations for progress blobs with version < CURRENT_DATA_VERSION.
 *
 * History (git `173e03d6`, Dec 2025): ProgressData shipped at version 1 with
 * profile/streak/achievements/gameStats/owlState/settings. The migrate hook was
 * a no-op stamp from day one. Future schema bumps add stepwise cases here.
 */
export function migrateProgressData(data: ProgressData): ProgressData {
  // Version migrations go here as needed.
  // v0 → v1: schema identical; stamp version then ensure defaults/sanitize.
  return ensureProgressDefaults({
    ...data,
    version: CURRENT_DATA_VERSION,
  });
}

/**
 * Load-path helper: migrate when version is a finite number below CURRENT,
 * otherwise ensure defaults (fills missing version / fields).
 */
export function normalizeLoadedProgress(data: ProgressData): ProgressData {
  if (
    typeof data.version === 'number' &&
    Number.isFinite(data.version) &&
    data.version < CURRENT_DATA_VERSION
  ) {
    return migrateProgressData(data);
  }
  return ensureProgressDefaults(data);
}
