/**
 * Live UTC date stamp for ai-calibration OUT / title (q-mp-1352).
 * Replaces hardcoded `2026-10-07` so re-runs do not overwrite the Oct 7
 * markdown twin. Historical docs under old paths may remain.
 *
 * Env: CALIBRATION_DATE (optional YYYY-MM-DD override).
 */

/**
 * Stamp for docs/ai-calibration-DATE.md and the markdown H1 date.
 * Env override wins when non-empty after trim; whitespace-only / empty /
 * unset → UTC YYYY-MM-DD via toISOString (q-mp-1409).
 *
 * @param {string|undefined|null} envDate process.env.CALIBRATION_DATE
 * @param {Date} [now]
 * @returns {string}
 */
export function resolveCalibrationDate(envDate, now = new Date()) {
  if (envDate != null) {
    const trimmed = String(envDate).trim();
    if (trimmed) return trimmed;
  }
  return now.toISOString().slice(0, 10);
}
