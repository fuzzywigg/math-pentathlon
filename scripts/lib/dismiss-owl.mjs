/**
 * Shared Ollie Owl dismiss for Playwright harness scripts under `scripts/`.
 *
 * Canonical behavior matches the former `console-sweep.mjs` copy (richest
 * harness variant): click dismiss + minimize when visible, then set
 * `#ollie-owl` pointer-events to none so the mascot cannot block clicks.
 *
 * e2e specs should keep using `tests/e2e/helpers/page.ts` — this module is
 * for plain `.mjs` harnesses that cannot import that TypeScript helper.
 *
 * This file is a library module. Direct CLI entry prints usage only:
 *   node scripts/lib/dismiss-owl.mjs [--help]
 * Unknown flags exit 2. Import from harnesses (e.g. console-sweep, page-ready).
 */

import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseHelpOnlyArgv } from './help-only-cli.mjs';

export const DISMISS_OWL_USAGE = `Usage: node scripts/lib/dismiss-owl.mjs [--help]

Library module — import from harness scripts (e.g. scripts/console-sweep.mjs,
scripts/memory-leak-audit.mjs, scripts/lib/page-ready.mjs).
Not a standalone CLI.

Options:
  -h, --help    Show this help and exit`;

/**
 * @param {import('@playwright/test').Page} page
 * @param {{ minimize?: boolean, pointerEventsNone?: boolean }} [options]
 * @returns {Promise<void>}
 */
export async function dismissOwl(page, options = {}) {
  const minimize = options.minimize !== false;
  const pointerEventsNone = options.pointerEventsNone !== false;

  const dismiss = page.locator(
    '#ollie-owl button[aria-label="Dismiss message"], #ollie-owl .owl-bubble-dismiss'
  );
  if (
    await dismiss
      .first()
      .isVisible()
      .catch(() => false)
  ) {
    await dismiss.first().click({ force: true });
  }
  if (minimize) {
    const minBtn = page.locator('#ollie-owl .owl-minimize-btn');
    if (await minBtn.isVisible().catch(() => false)) {
      await minBtn.click({ force: true });
    }
  }
  if (pointerEventsNone) {
    await page.evaluate(() => {
      const el = document.getElementById('ollie-owl');
      if (el) el.style.pointerEvents = 'none';
    });
  }
}

/**
 * CLI entry when this file is executed directly (q-mp-958).
 * Import-as-library path is unchanged (no side effects on import).
 *
 * @param {string[]} [argv]
 */
export function main(argv = process.argv.slice(2)) {
  const parsed = parseHelpOnlyArgv(argv);
  if (parsed.kind === 'error') {
    console.error(`Unknown flag: ${parsed.flag}`);
    console.error(DISMISS_OWL_USAGE);
    process.exit(2);
  }
  // --help / -h, bare main, or stray positionals: usage only (not runnable).
  console.log(DISMISS_OWL_USAGE);
  process.exit(0);
}

const isMain =
  Boolean(process.argv[1]) &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href;

if (isMain) {
  main();
}
