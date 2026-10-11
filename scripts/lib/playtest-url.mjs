/**
 * Shared playtest BASE URL join for harnesses that bypass `gotoGame`
 * (q-mp-1305). Strips trailing slashes so `BASE/` does not become `//#/game/…`.
 *
 * Env var *names* for bases stay harness-local (PLAYTEST_BASE, etc.).
 *
 * This file is a library module. Direct CLI entry prints usage only:
 *   node scripts/lib/playtest-url.mjs [--help]
 * Unknown flags exit 2.
 */

import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseHelpOnlyArgv } from './help-only-cli.mjs';

export const PLAYTEST_URL_USAGE = `Usage: node scripts/lib/playtest-url.mjs [--help]

Library module — import from deep-playtest / playtest harness scripts.
Not a standalone CLI.

Options:
  -h, --help    Show this help and exit`;

/**
 * Join a playtest base URL to a game hash route without a double slash.
 *
 * @param {string | null | undefined} baseURL
 * @param {string} gameId
 * @returns {string}
 */
export function joinPlaytestGameUrl(baseURL, gameId) {
  const base = String(baseURL ?? '').replace(/\/+$/, '');
  return `${base}/#/game/${gameId}`;
}

/**
 * CLI entry when this file is executed directly.
 * @param {string[]} [argv]
 */
export function main(argv = process.argv.slice(2)) {
  const parsed = parseHelpOnlyArgv(argv);
  if (parsed.kind === 'error') {
    console.error(`Unknown flag: ${parsed.flag}`);
    console.error(PLAYTEST_URL_USAGE);
    process.exit(2);
  }
  console.log(PLAYTEST_URL_USAGE);
  process.exit(0);
}

const isMain =
  Boolean(process.argv[1]) &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href;

if (isMain) {
  main();
}
