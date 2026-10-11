/**
 * Pure helpers for scripts/render-perf.mjs (q-mp-1238 / q-mp-1242).
 *
 * Observers write window.__mpRenderPerf; readers must snapshot numeric
 * counters from that bag (not the never-set __mpRenderStats). Hover probe
 * cell limit is a single constant for slice + method docs.
 */

/** Max cells / synthetic mouseenter events in the hover probe. */
export const HOVER_PROBE_CELL_LIMIT = 16;

/**
 * Snapshot countable fields from an __mpRenderPerf bag.
 * Arrays contribute lengths; non-finite numbers are treated as 0.
 *
 * @param {unknown} bag
 * @returns {{ layoutReads: number, longTaskCount: number, moveCostCount: number }}
 */
export function snapshotRenderPerfCounters(bag) {
  if (bag == null || typeof bag !== 'object') {
    return { layoutReads: 0, longTaskCount: 0, moveCostCount: 0 };
  }
  const o = /** @type {Record<string, unknown>} */ (bag);
  const layoutRaw = o.layoutReads;
  const layoutReads =
    typeof layoutRaw === 'number' && Number.isFinite(layoutRaw) ? layoutRaw : 0;
  return {
    layoutReads,
    longTaskCount: Array.isArray(o.longTasks) ? o.longTasks.length : 0,
    moveCostCount: Array.isArray(o.moveCosts) ? o.moveCosts.length : 0,
  };
}

/**
 * Numeric deltas between two counter snapshots.
 *
 * @param {Record<string, number>} before
 * @param {Record<string, number>} after
 * @returns {Record<string, number>}
 */
export function deltaRenderPerfCounters(before, after) {
  const keys = new Set([
    ...Object.keys(before ?? {}),
    ...Object.keys(after ?? {}),
  ]);
  /** @type {Record<string, number>} */
  const delta = {};
  for (const k of keys) {
    delta[k] = (after?.[k] || 0) - (before?.[k] || 0);
  }
  return delta;
}

/**
 * Method-section bullet for the combined markdown report.
 *
 * @param {number} [limit]
 * @returns {string}
 */
export function hoverProbeMethodBullet(limit = HOVER_PROBE_CELL_LIMIT) {
  return `- Hover probe (juggle, pent-em-in): ${limit} synthetic \`mouseenter\` events during place phase when cells exist`;
}
