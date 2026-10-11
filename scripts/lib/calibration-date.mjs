/**
 * Live UTC date stamp for ai-calibration OUT / title (q-mp-1352).
 * Replaces hardcoded `2026-10-07` so re-runs do not overwrite the Oct 7
 * markdown twin. Historical docs under old paths may remain.
 *
 * Env: CALIBRATION_DATE (optional YYYY-MM-DD override).
 */

/**
 * Stamp for docs/ai-calibration-DATE.md and the markdown H1 date.
 * Env override wins when non-empty; else UTC YYYY-MM-DD via toISOString.
 *
 * @param {string|undefined|null} envDate process.env.CALIBRATION_DATE
 * @param {Date} [now]
 * @returns {string}
 */
export function resolveCalibrationDate(envDate, now = new Date()) {
  if (envDate) return String(envDate);
  return now.toISOString().slice(0, 10);
}
