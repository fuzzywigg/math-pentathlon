/**
 * Playwright: emulated prefers-reduced-motion shortens shell transitions.
 * Uses bare @playwright/test (no animation-kill fixture) so OS media is the signal.
 */
import { test, expect } from '@playwright/test';

test.describe('prefers-reduced-motion (emulated media)', () => {
  test('menu cards have zeroed transition duration under reduce', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await expect(page.locator('.game-selector')).toBeVisible({
      timeout: 15_000,
    });

    const card = page.locator('.game-card').first();
    await expect(card).toBeVisible();

    const transitionMs = await card.evaluate((el) => {
      const style = getComputedStyle(el);
      // transition-duration may be a list; take the first value in seconds/ms
      const raw = style.transitionDuration.split(',')[0]?.trim() ?? '';
      if (raw.endsWith('ms')) return parseFloat(raw);
      if (raw.endsWith('s')) return parseFloat(raw) * 1000;
      return Number.NaN;
    });

    // CSS zeros --transition-* to 0.01ms and menu block sets transition: none
    expect(transitionMs).toBeLessThan(20);

    const rootFast = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue(
        '--transition-fast'
      )
    );
    expect(rootFast.trim()).toMatch(/0\.01ms|0s|0ms/);
  });
});
