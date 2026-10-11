/**
 * Early CLI for browser harness scripts (q-mp-900).
 *
 * `--help` / `-h` must exit before Playwright launch / vite createServer.
 * Unknown flags exit non-zero. Default (no args) leaves harness behavior unchanged.
 * Kept free of Playwright so unit tests can import it hermetically.
 */

/**
 * @typedef {{ mode: 'run' } | { mode: 'help' } | { mode: 'error', message: string }} BrowserHarnessParse
 */

/**
 * @param {string[]} argv process.argv.slice(2)
 * @returns {BrowserHarnessParse}
 */
export function parseBrowserHarnessArgs(argv) {
  for (const a of argv) {
    if (a === '--help' || a === '-h') {
      return { mode: 'help' };
    }
    if (a.startsWith('-')) {
      return { mode: 'error', message: `Unknown flag: ${a}` };
    }
    return { mode: 'error', message: `Unexpected argument: ${a}` };
  }
  return { mode: 'run' };
}

/**
 * Print usage / errors and exit when argv is not a default run.
 * Call before any build, preview, or browser launch.
 *
 * @param {string[]} argv
 * @param {string} usage
 * @returns {void}
 */
export function applyBrowserHarnessCli(argv, usage) {
  const result = parseBrowserHarnessArgs(argv);
  if (result.mode === 'help') {
    console.log(usage);
    process.exit(0);
  }
  if (result.mode === 'error') {
    console.error(result.message);
    console.error(usage);
    process.exit(2);
  }
}
