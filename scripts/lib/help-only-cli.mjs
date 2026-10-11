/**
 * Argv parse for scripts that accept only `--help` / `-h` (q-mp-885).
 * No process.exit / I/O — hermetic for unit tests.
 *
 * This file is a library module. Direct CLI entry prints usage only:
 *   node scripts/lib/help-only-cli.mjs [--help]
 * Unknown flags exit 2. Import from harnesses (e.g. check-workflows).
 */

import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export const HELP_ONLY_CLI_USAGE = `Usage: node scripts/lib/help-only-cli.mjs [--help]

Library module — import from harness scripts (e.g. scripts/check-workflows.mjs,
scripts/check-boundaries.mjs, scripts/check-perf.mjs).
Not a standalone CLI.

Options:
  -h, --help    Show this help and exit`;

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

/**
 * CLI entry when this file is executed directly (q-mp-980).
 * Import-as-library path is unchanged (no side effects on import).
 *
 * @param {string[]} [argv]
 */
export function main(argv = process.argv.slice(2)) {
  const parsed = parseHelpOnlyArgv(argv);
  if (parsed.kind === 'error') {
    console.error(`Unknown flag: ${parsed.flag}`);
    console.error(HELP_ONLY_CLI_USAGE);
    process.exit(2);
  }
  // --help / -h, bare main, or stray positionals: usage only (not runnable).
  console.log(HELP_ONLY_CLI_USAGE);
  process.exit(0);
}

const isMain =
  Boolean(process.argv[1]) &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href;

if (isMain) {
  main();
}
