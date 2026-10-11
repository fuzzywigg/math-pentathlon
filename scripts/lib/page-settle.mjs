/**
 * Shared double-rAF paint settle for Playwright harness scripts under `scripts/`.
 *
 * Canonical behavior matches the former inline copies in `console-sweep.mjs`,
 * `mobile-audit.mjs`, `render-perf.mjs`, and `render-perf-mode.mjs`: wait for
 * two animation frames so layout/paint can flush without a fixed sleep.
 *
 * e2e specs should keep using `tests/e2e/helpers/page.ts` — this module is
 * for plain `.mjs` harnesses that cannot import that TypeScript helper.
 */

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
