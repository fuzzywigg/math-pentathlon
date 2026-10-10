/**
 * Shared Ollie Owl dismiss for Playwright harness scripts under `scripts/`.
 *
 * Canonical behavior matches the former `console-sweep.mjs` copy (richest
 * harness variant): click dismiss + minimize when visible, then set
 * `#ollie-owl` pointer-events to none so the mascot cannot block clicks.
 *
 * e2e specs should keep using `tests/e2e/helpers/page.ts` — this module is
 * for plain `.mjs` harnesses that cannot import that TypeScript helper.
 */

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
  if (await dismiss.first().isVisible().catch(() => false)) {
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
