/**
 * Early CLI for deep-playtest harnesses (q-mp-910).
 *
 * `--help` / `-h` must exit before mkdir side effects or browser launch.
 * Unknown flags / unexpected positionals exit non-zero.
 * Default (no args) leaves playtest behavior unchanged.
 *
 * This file is a library module. Direct CLI entry prints usage only:
 *   node scripts/lib/deep-playtest-cli.mjs [--help]
 * Unknown flags exit 2. Import from harnesses (e.g. calla-deep-playtest).
 */

import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseHelpOnlyArgv } from './help-only-cli.mjs';

export const DEEP_PLAYTEST_CLI_USAGE = `Usage: node scripts/lib/deep-playtest-cli.mjs [--help]

Library module — import from harness scripts (e.g. scripts/calla-deep-playtest.mjs,
scripts/ramrod-deep-playtest.mjs, scripts/par-55-deep-playtest.mjs).
Not a standalone CLI.

Options:
  -h, --help    Show this help and exit`;

/**
 * @param {string[]} argv process.argv.slice(2)
 * @returns {{ mode: 'run' } | { mode: 'help' } | { mode: 'error', message: string }}
 */
export function parseDeepPlaytestArgs(argv) {
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
 * Call before any mkdir, build, or browser launch.
 *
 * @param {string[]} argv
 * @param {string} usage
 * @returns {void}
 */
export function applyDeepPlaytestCli(argv, usage) {
  const result = parseDeepPlaytestArgs(argv);
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
    console.error(DEEP_PLAYTEST_CLI_USAGE);
    process.exit(2);
  }
  // --help / -h, bare main, or stray positionals: usage only (not runnable).
  console.log(DEEP_PLAYTEST_CLI_USAGE);
  process.exit(0);
}

const isMain =
  Boolean(process.argv[1]) &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href;

if (isMain) {
  main();
}
