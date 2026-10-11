/**
 * Env parse helpers for fab-a-diffy deep playtest (q-mp-1276 / 1277 / 1278).
 * Kept free of Playwright so unit tests can import hermetically.
 */

/** Known viewport keys for PLAYTEST_ONLY_VP. */
export const FAB_VIEWPORT_KEYS = Object.freeze(['desktop', 'tablet']);

/** Known difficulty keys for PLAYTEST_ONLY_DIFF. */
export const FAB_DIFFICULTY_KEYS = Object.freeze(['easy', 'medium', 'hard']);

/**
 * PLAYTEST_SKIP_EXTRA_SHOTS enable: only clear truthy tokens (`1` / `true` / `yes`).
 * `'0'`, `'false'`, `''`, and unset do not skip (q-mp-1277; same tokens as PAR55_QUICK).
 *
 * @param {string | undefined | null} raw
 * @returns {boolean}
 */
export function isSkipExtraShotsEnabled(raw) {
  if (raw === undefined || raw === null) return false;
  const v = String(raw).trim().toLowerCase();
  return v === '1' || v === 'true' || v === 'yes';
}

/**
 * Resolve PLAYTEST_ONLY_VP against known viewport keys (q-mp-1278).
 * Unset / empty → full defaults. Unknown keys → usage error shape.
 *
 * @param {string | undefined} onlyVp
 * @param {Record<string, unknown>} allViewports
 * @returns {{ ok: true, viewports: Record<string, unknown>, onlyVp: string | undefined } | { ok: false, message: string }}
 */
export function resolveFabViewports(onlyVp, allViewports) {
  if (onlyVp === undefined || onlyVp === '') {
    return { ok: true, viewports: allViewports, onlyVp: undefined };
  }
  if (!Object.prototype.hasOwnProperty.call(allViewports, onlyVp)) {
    const known = Object.keys(allViewports).join(', ');
    return {
      ok: false,
      message: `Invalid PLAYTEST_ONLY_VP=${JSON.stringify(String(onlyVp))} (expected one of: ${known}).`,
    };
  }
  return {
    ok: true,
    viewports: { [onlyVp]: allViewports[onlyVp] },
    onlyVp,
  };
}

/**
 * Resolve PLAYTEST_ONLY_DIFF against known difficulties (q-mp-1278).
 * Unset / empty → full defaults. Unknown keys → usage error shape.
 *
 * @param {string | undefined} onlyDiff
 * @param {readonly string[]} [allDiffs]
 * @returns {{ ok: true, difficulties: string[], onlyDiff: string | undefined } | { ok: false, message: string }}
 */
export function resolveFabDifficulties(
  onlyDiff,
  allDiffs = FAB_DIFFICULTY_KEYS
) {
  const diffs = [...allDiffs];
  if (onlyDiff === undefined || onlyDiff === '') {
    return { ok: true, difficulties: diffs, onlyDiff: undefined };
  }
  if (!diffs.includes(onlyDiff)) {
    return {
      ok: false,
      message: `Invalid PLAYTEST_ONLY_DIFF=${JSON.stringify(String(onlyDiff))} (expected one of: ${diffs.join(', ')}).`,
    };
  }
  return { ok: true, difficulties: [onlyDiff], onlyDiff };
}
