/**
 * Shared double-rAF paint settle for Playwright harness scripts under `scripts/`.
 *
 * Canonical behavior matches the former inline copies in `console-sweep.mjs`,
 * `mobile-audit.mjs`, `render-perf.mjs`, and `render-perf-mode.mjs`: wait for
 * two animation frames so layout/paint can flush without a fixed sleep.
 *
 * e2e specs should keep using `tests/e2e/helpers/page.ts` — this module is
 * for plain `.mjs` harnesses that cannot import that TypeScript helper.
 *
 * This file is a library module. Direct CLI entry prints usage only:
 *   node scripts/lib/page-settle.mjs [--help]
 * Unknown flags exit 2. Import from harnesses (e.g. console-sweep, mobile-audit).
 */

import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseHelpOnlyArgv } from './help-only-cli.mjs';

export const PAGE_SETTLE_USAGE = `Usage: node scripts/lib/page-settle.mjs [--help]

Library module — import from harness scripts (e.g. scripts/console-sweep.mjs,
scripts/mobile-audit.mjs, scripts/render-perf.mjs).
Not a standalone CLI.

Options:
  -h, --help    Show this help and exit`;

/**
 * Wait two `requestAnimationFrame` ticks via `page.evaluate` (paint settle).
 *
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<void>}
 */
export async function waitDoubleRaf(page) {
  await page.evaluate(
    () =>
      new Promise((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      })
  );
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
    console.error(PAGE_SETTLE_USAGE);
    process.exit(2);
  }
  // --help / -h, bare main, or stray positionals: usage only (not runnable).
  console.log(PAGE_SETTLE_USAGE);
  process.exit(0);
}

const isMain =
  Boolean(process.argv[1]) &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href;

if (isMain) {
  main();
}
