/**
 * Argv parse for scripts that accept only `--help` / `-h` (q-mp-885).
 * No process.exit / I/O — hermetic for unit tests.
 */

/**
 * @param {string[]} argv process.argv.slice(2) (or equivalent)
 * @returns {{ kind: 'run' } | { kind: 'help' } | { kind: 'error', flag: string }}
 */
export function parseHelpOnlyArgv(argv) {
  for (const a of argv) {
    if (a === '--help' || a === '-h') return { kind: 'help' };
    if (a.startsWith('-')) return { kind: 'error', flag: a };
  }
  return { kind: 'run' };
}

/**
 * @param {string} scriptRel e.g. `scripts/check-workflows.mjs`
 */
export function helpOnlyUsage(scriptRel) {
  return `Usage: node ${scriptRel} [--help]`;
}
