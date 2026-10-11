/**
 * Pure helpers for scripts/runtime-perf.mjs (+ clickFirst for render-perf.mjs).
 * q-mp-1239 / q-mp-1244 / q-mp-1245 — hermetic unit tests import this module
 * (no Playwright / vite side effects).
 */

/**
 * Markdown H1 for the runtime-perf report (q-mp-1239).
 * Must use the same PERF_DATE stem as the output file names.
 *
 * @param {string} perfDate
 * @returns {string}
 */
export function runtimePerfMarkdownTitle(perfDate) {
  return `# Runtime perf — ${perfDate}`;
}

/**
 * Max long-task duration in ms, or null when none observed (q-mp-1245).
 * Matches empty-frame semantics (`frameMaxMs: null`).
 *
 * @param {ReadonlyArray<number | { duration: number }>} entries
 * @returns {number | null}
 */
export function maxLongTaskMs(entries) {
  if (!Array.isArray(entries) || entries.length === 0) return null;
  let max = 0;
  for (const e of entries) {
    const d = typeof e === 'number' ? e : e?.duration;
    if (typeof d === 'number' && Number.isFinite(d) && d > max) max = d;
  }
  return max;
}

/**
 * Click the first matching visible locator; return false on miss or click failure
 * (q-mp-1244 — never report success after a swallowed click rejection).
 *
 * @param {{ locator: (sel: string) => { first: () => {
 *   count: () => Promise<number>,
 *   isVisible: () => Promise<boolean>,
 *   click: (opts?: { force?: boolean }) => Promise<void>
 * } } }} page
 * @param {string} sel
 * @returns {Promise<boolean>}
 */
export async function clickFirst(page, sel) {
  const loc = page.locator(sel).first();
  if ((await loc.count()) === 0) return false;
  if (!(await loc.isVisible().catch(() => false))) return false;
  try {
    await loc.click({ force: true });
    return true;
  } catch {
    return false;
  }
}
