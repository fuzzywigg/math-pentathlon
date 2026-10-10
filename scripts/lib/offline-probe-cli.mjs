/**
 * Early CLI for offline probe scripts (q-mp-886).
 *
 * `--help` / `-h` must exit before build or browser launch.
 * Unknown flags exit non-zero. Default (no args) leaves probe behavior unchanged.
 */

/**
 * @param {string[]} argv process.argv.slice(2)
 * @returns {{ mode: 'run' } | { mode: 'help' } | { mode: 'error', message: string }}
 */
export function parseOfflineProbeArgs(argv) {
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
export function applyOfflineProbeCli(argv, usage) {
  const result = parseOfflineProbeArgs(argv);
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
