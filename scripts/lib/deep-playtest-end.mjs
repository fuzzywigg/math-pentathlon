/**
 * Word-boundary end / draw detectors for deep-playtest harnesses (q-mp-1259)
 * and PAR55_QUICK enable parsing (q-mp-1260).
 *
 * Substring matchers like /tie|draw/i false-end on "patience" / "Drawing card".
 * Keep browser waitForFunction bodies in sync with END_RE_SOURCE (page callbacks
 * cannot import this module).
 *
 * This file is a library module. Direct CLI entry prints usage only.
 */

import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseHelpOnlyArgv } from './help-only-cli.mjs';

export const DEEP_PLAYTEST_END_USAGE = `Usage: node scripts/lib/deep-playtest-end.mjs [--help]

Library module — import from deep-playtest harness scripts.
Not a standalone CLI.

Options:
  -h, --help    Show this help and exit`;

/** Source body for page.waitForFunction (no flags; callers add `i`). */
export const END_RE_SOURCE = String.raw`\bwins\b|\btie\b|\bdraw\b`;
export const DRAW_RE_SOURCE = String.raw`\btie\b|\bdraw\b`;
export const TIE_RE_SOURCE = String.raw`\btie\b`;

const END_RE = new RegExp(END_RE_SOURCE, 'i');
const DRAW_RE = new RegExp(DRAW_RE_SOURCE, 'i');
const TIE_RE = new RegExp(TIE_RE_SOURCE, 'i');

/**
 * True when status looks like a terminal win / tie / draw banner.
 * @param {string | null | undefined} statusText
 */
export function isDeepPlaytestEndStatus(statusText) {
  return END_RE.test(statusText || '');
}

/**
 * True when status looks like a tie or draw (not a win).
 * @param {string | null | undefined} statusText
 */
export function isDeepPlaytestDrawStatus(statusText) {
  return DRAW_RE.test(statusText || '');
}

/**
 * True when status looks like a tie (word-boundary).
 * @param {string | null | undefined} statusText
 */
export function isDeepPlaytestTieStatus(statusText) {
  return TIE_RE.test(statusText || '');
}

/**
 * PAR55_QUICK enable: only clear truthy tokens (`1` / `true` / `yes`).
 * `'0'`, `'false'`, `''`, and unset fall through to PAR55_GAMES.
 * @param {string | undefined | null} raw
 */
export function isPar55QuickEnabled(raw) {
  if (raw === undefined || raw === null) return false;
  const v = String(raw).trim().toLowerCase();
  return v === '1' || v === 'true' || v === 'yes';
}

/**
 * @param {string[]} [argv]
 */
export function main(argv = process.argv.slice(2)) {
  const parsed = parseHelpOnlyArgv(argv);
  if (parsed.kind === 'error') {
    console.error(`Unknown flag: ${parsed.flag}`);
    console.error(DEEP_PLAYTEST_END_USAGE);
    process.exit(2);
  }
  console.log(DEEP_PLAYTEST_END_USAGE);
  process.exit(0);
}

const isMain =
  Boolean(process.argv[1]) &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href;

if (isMain) {
  main();
}
