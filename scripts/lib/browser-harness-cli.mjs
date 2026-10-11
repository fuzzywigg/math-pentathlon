/**
 * Early CLI for browser harness scripts (q-mp-900).
 *
 * `--help` / `-h` must exit before Playwright launch / vite createServer.
 * Unknown flags exit non-zero. Default (no args) leaves harness behavior unchanged.
 * Kept free of Playwright so unit tests can import it hermetically.
 *
 * This file is a library module. Direct CLI entry prints usage only:
 *   node scripts/lib/browser-harness-cli.mjs [--help]
 * Unknown flags exit 2. Import from harnesses (e.g. console-sweep, runtime-perf).
 */

import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseHelpOnlyArgv } from './help-only-cli.mjs';

export const BROWSER_HARNESS_CLI_USAGE = `Usage: node scripts/lib/browser-harness-cli.mjs [--help]

Library module — import from harness scripts (e.g. scripts/console-sweep.mjs,
scripts/runtime-perf.mjs, scripts/render-perf.mjs).
Not a standalone CLI.

Options:
  -h, --help    Show this help and exit`;

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
    console.error(BROWSER_HARNESS_CLI_USAGE);
    process.exit(2);
  }
  // --help / -h, bare main, or stray positionals: usage only (not runnable).
  console.log(BROWSER_HARNESS_CLI_USAGE);
  process.exit(0);
}

const isMain =
  Boolean(process.argv[1]) &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href;

if (isMain) {
  main();
}
