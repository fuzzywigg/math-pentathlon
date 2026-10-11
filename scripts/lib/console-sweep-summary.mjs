/**
 * Pure summary helpers for console-sweep stderr / JSON (q-mp-1241).
 *
 * Separates load-phase console/pageerror counts (from load* snapshots) from
 * total/play counts after play. Kept free of Playwright so unit tests can
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
 * Total uses full `console` + `pageErrors` + `unhandledRejections` after play.
 * Play = total − load (unhandled rejections are attributed to play/total only,
 * since they are collected at the end).
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

  const totalErrors =
    countConsoleErrors(allConsole) + pageErrors.length + unhandled.length;
  const totalWarnings = countConsoleWarnings(allConsole);

  const playConsoleErrors = Math.max(
    0,
    countConsoleErrors(allConsole) - countConsoleErrors(loadConsole)
  );
  const playPageErrors = Math.max(0, pageErrors.length - loadPageErrors.length);
  const playErrors = playConsoleErrors + playPageErrors + unhandled.length;

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
 * is not confused with load-only counts.
 *
 * @param {ConsoleSweepResultLike & { loadOk?: boolean, playNote?: string | null }} r
 * @returns {string}
 */
export function formatConsoleSweepSummaryLine(r) {
  const s = summarizeConsoleSweepResult(r);
  return (
    `  loadOk=${r.loadOk} loadErrors=${s.loadErrors} ` +
    `playErrors=${s.playErrors} totalErrors=${s.totalErrors} ` +
    `warnings=${s.totalWarnings} play=${r.playNote || 'ok'}`
  );
}
