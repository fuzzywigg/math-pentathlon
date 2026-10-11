/**
 * Pure small-tap-target shaping for scripts/mobile-audit.mjs (q-mp-1240).
 * Dedupe + list cap live here so `smallTapTargetCount` always matches the
 * listed `smallTapTargets` (hermetic unit tests; no Playwright).
 */

/** Max unique small-tap rows kept in the audit report (unchanged). */
export const SMALL_TAP_TARGET_LIST_CAP = 40;

/**
 * Dedupe raw small-tap metrics by tag+class+size and cap the listed sample.
 * Count equals the listed array length (not the raw pre-dedupe length).
 *
 * @param {Array<{ tag: string, class: string, w: number, h: number }>} smallTargets
 * @param {number} [cap]
 * @returns {{ smallTapTargets: typeof smallTargets, smallTapTargetCount: number }}
 */
export function shapeSmallTapTargets(
  smallTargets,
  cap = SMALL_TAP_TARGET_LIST_CAP
) {
  const seen = new Set();
  const uniqueSmall = [];
  for (const t of smallTargets) {
    const key = `${t.tag}|${t.class}|${t.w}x${t.h}`;
    if (seen.has(key)) continue;
    seen.add(key);
    uniqueSmall.push(t);
    if (uniqueSmall.length >= cap) break;
  }
  return {
    smallTapTargets: uniqueSmall,
    smallTapTargetCount: uniqueSmall.length,
  };
}
