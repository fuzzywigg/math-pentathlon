/**
 * Shared Playwright paint-settle helper — two animation frames after layout
 * changes. Condition wait only; no fixed sleeps and no product timing edits.
 */
import type { Page } from '@playwright/test';

/** Resolve after two `requestAnimationFrame` ticks (layout + paint). */
export async function waitDoubleRaf(page: Page): Promise<void> {
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      })
  );
}
