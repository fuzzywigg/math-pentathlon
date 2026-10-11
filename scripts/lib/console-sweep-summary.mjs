/**
 * Pure summary helpers for console-sweep stderr / JSON (q-mp-1241 / q-mp-1332).
 *
 * Separates load-phase console/pageerror counts (from load* snapshots) from
 * play/total counts after play. Kept free of Playwright so unit tests can
 * import hermetically.
 */

/**
 * @param {{ type?: string }[]} [messages]
 * @returns {number}
 */
export function countConsoleErrors(messages = []) {
  return messages.filter((m) => m?.type === 'error').length;
}

/**
 * @param {{ type?: string }[]} [messages]
 * @returns {number}
 */
export function countConsoleWarnings(messages = []) {
  return messages.filter((m) => m?.type === 'warning').length;
}

/**
 * @typedef {{
 *   loadConsole?: { type?: string }[],
 *   loadPageErrors?: unknown[],
 *   console?: { type?: string }[],
 *   pageErrors?: unknown[],
 *   unhandledRejections?: unknown[],
 * }} ConsoleSweepResultLike
 */

/**
 * @typedef {{
 *   loadErrors: number,
 *   loadWarnings: number,
 *   playErrors: number,
 *   totalErrors: number,
 *   totalWarnings: number,
 * }} ConsoleSweepErrorSummary
 */

/**
 * Count load-only vs play vs total errors for one sweep result.
 *
 * Load uses `loadConsole` / `loadPageErrors` snapshots taken after ready.
 * Play attributes console/pageerror growth beyond the load snapshot (plus
 * unhandled rejections, which are collected only at the end).
 * Totals always include the load snapshot (`total = load + play`) so
 * load ≤ total even when the post-play `console` array is a later snapshot
 * that no longer contains the load-phase messages (q-mp-1332).
 *
 * @param {ConsoleSweepResultLike} r
 * @returns {ConsoleSweepErrorSummary}
 */
export function summarizeConsoleSweepResult(r) {
  const loadConsole = Array.isArray(r?.loadConsole) ? r.loadConsole : [];
  const loadPageErrors = Array.isArray(r?.loadPageErrors)
    ? r.loadPageErrors
    : [];
  const allConsole = Array.isArray(r?.console) ? r.console : [];
  const pageErrors = Array.isArray(r?.pageErrors) ? r.pageErrors : [];
  const unhandled = Array.isArray(r?.unhandledRejections)
    ? r.unhandledRejections
    : [];

  const loadErrors = countConsoleErrors(loadConsole) + loadPageErrors.length;
  const loadWarnings = countConsoleWarnings(loadConsole);

  const playConsoleErrors = Math.max(
    0,
    countConsoleErrors(allConsole) - countConsoleErrors(loadConsole)
  );
  const playPageErrors = Math.max(0, pageErrors.length - loadPageErrors.length);
  const playErrors = playConsoleErrors + playPageErrors + unhandled.length;
  const playWarnings = Math.max(
    0,
    countConsoleWarnings(allConsole) - loadWarnings
  );

  const totalErrors = loadErrors + playErrors;
  const totalWarnings = loadWarnings + playWarnings;

  return {
    loadErrors,
    loadWarnings,
    playErrors,
    totalErrors,
    totalWarnings,
  };
}

/**
 * Stderr one-liner for a sweep result. Labels totalErrors explicitly so it
 * is not confused with load-only counts, and surfaces loadWarnings so
 * load-only warnings are not hidden behind a zero `warnings=` total.
 *
 * @param {ConsoleSweepResultLike & { loadOk?: boolean, playNote?: string | null }} r
 * @returns {string}
 */
export function formatConsoleSweepSummaryLine(r) {
  const s = summarizeConsoleSweepResult(r);
  return (
    `  loadOk=${r.loadOk} loadErrors=${s.loadErrors} ` +
    `loadWarnings=${s.loadWarnings} ` +
    `playErrors=${s.playErrors} totalErrors=${s.totalErrors} ` +
    `warnings=${s.totalWarnings} play=${r.playNote || 'ok'}`
  );
}
