/**
 * Word-boundary end / draw detectors for deep-playtest harnesses (q-mp-1259)
 * and PAR55_QUICK enable parsing (q-mp-1260).
 *
 * Substring matchers like /tie|draw/i false-end on "patience" / "Drawing card".
 * q-mp-1403: reject star-track mid-game "Draw chains …" (title-case verb).
 * q-mp-1404: reject hyphenated forms (pre-tie / re-draw / pre-wins / tie-breaker)
 * via lookaround that treats `-` like a word char (plain `\b` does not).
 * q-mp-1476: reject non-banner phrases — interrogative who/what/which wins,
 * "No … yet", "Please draw …", "thinking about Draw" — while keeping real
 * banners ("Blue wins!", "It's a draw!", "Game Over! Tie!", "Draw!").
 * Keep browser waitForFunction bodies in sync with END_RE_SOURCE (page callbacks
 * cannot import this module).
 *
 * This file is a library module. Direct CLI entry prints usage only.
 */

import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseHelpOnlyArgv } from './help-only-cli.mjs';

export const DEEP_PLAYTEST_END_USAGE = `Usage: node scripts/lib/deep-playtest-end.mjs [--help]

Library module — import from harness scripts (e.g. scripts/par-55-deep-playtest.mjs,
scripts/stars-bars-deep-playtest.mjs).
Not a standalone CLI.

Options:
  -h, --help    Show this help and exit`;

/**
 * Token edges treat ASCII letters/digits/`_`/`-` as interior (q-mp-1404
 * lookaround; plain `\b` still matches after `-`). Draw arm rejects
 * star-track "Draw chains" (q-mp-1403). Wins / tie / draw arms reject
 * non-banner mid-game copy (q-mp-1476). Chromium waitForFunction supports
 * these lookarounds.
 */
/** Wins token: not who/what/which-wins, not "wins … yet", not "wins?". */
const WINS_RE_SOURCE = String.raw`(?<![A-Za-z0-9_-])(?<!who\s)(?<!what\s)(?<!which\s)wins(?![A-Za-z0-9_-])(?!\?)(?!\s+yet\b)`;
/** Tie token: not "tie … yet", not "tie?". */
export const TIE_RE_SOURCE = String.raw`(?<![A-Za-z0-9_-])tie(?![A-Za-z0-9_-])(?!\?)(?!\s+yet\b)`;
/**
 * Draw token: not "Draw chains", not "Please draw", not "about Draw",
 * not "draw … yet", not "draw?".
 */
const DRAW_TOKEN_RE_SOURCE = String.raw`(?<![A-Za-z0-9_-])(?<!please\s)(?<!about\s)draw(?![A-Za-z0-9_-])(?!\?)(?!\s+chains\b)(?!\s+yet\b)`;

/** Source body for page.waitForFunction (no flags; callers add `i`). */
export const END_RE_SOURCE = `${WINS_RE_SOURCE}|${TIE_RE_SOURCE}|${DRAW_TOKEN_RE_SOURCE}`;
/** Tie or draw (not win) — same token guards as END_RE_SOURCE arms. */
export const DRAW_RE_SOURCE = `${TIE_RE_SOURCE}|${DRAW_TOKEN_RE_SOURCE}`;

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
