/**
 * Live UTC date stamp for playtest OUT dirs / result `date` fields (q-mp-1320).
 * Replaces hardcoded `2026-10-07` stems so re-runs do not clobber/mislabel
 * the Oct 7 artifact trees. Historical markdown under old paths may remain.
 *
 * Existing BASE / SEED env *names* are unchanged (no new date env required).
 *
 * This file is a library module. Direct CLI entry prints usage only:
 *   node scripts/lib/playtest-date.mjs [--help]
 * Unknown flags exit 2.
 */

import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseHelpOnlyArgv } from './help-only-cli.mjs';

export const PLAYTEST_DATE_USAGE = `Usage: node scripts/lib/playtest-date.mjs [--help]

Library module — import from deep-playtest / playtest harness scripts.
Not a standalone CLI.

Options:
  -h, --help    Show this help and exit`;

/**
 * Today's UTC calendar date as `YYYY-MM-DD` (ISO date portion).
 *
 * @param {Date} [now]
 * @returns {string}
 */
export function utcPlaytestDateStamp(now = new Date()) {
  return now.toISOString().slice(0, 10);
}

/**
 * CLI entry when this file is executed directly.
 * @param {string[]} [argv]
 */
export function main(argv = process.argv.slice(2)) {
  const parsed = parseHelpOnlyArgv(argv);
  if (parsed.kind === 'error') {
    console.error(`Unknown flag: ${parsed.flag}`);
    console.error(PLAYTEST_DATE_USAGE);
    process.exit(2);
  }
  console.log(PLAYTEST_DATE_USAGE);
  process.exit(0);
}

const isMain =
  Boolean(process.argv[1]) &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href;

if (isMain) {
  main();
}
