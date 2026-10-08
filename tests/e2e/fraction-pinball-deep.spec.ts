/**
 * E2E regression for Fraction Pinball deep playtest fixes.
 * Desktop + tablet Chromium: full vs-AI games, touch targets, AI seat lock.
 */
import { test, expect, type Page } from '@playwright/test';
import {
  dismissOwl,
  startVsAiAt,
} from './helpers/page';

// Deep playtest regression targets Chromium (desktop + tablet viewports).
test.skip(({ browserName }) => browserName !== 'chromium');

async function playToEnd(page: Page, maxMs = 90_000) {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  const deadline = Date.now() + maxMs;
  while (Date.now() < deadline) {
    if (await page.locator('.pinball-game-over').isVisible().catch(() => false)) {
      break;
    }
    if (await page.locator('.status-ai-thinking').isVisible().catch(() => false)) {
      await page
        .locator('.status-ai-thinking')
        .waitFor({ state: 'hidden', timeout: 5_000 })
        .catch(() => {});
      continue;
    }
    const cont = page.locator('.pinball-continue-btn');
    if (await cont.isVisible().catch(() => false)) {
      await cont.click();
      continue;
    }
    const choice = page.locator('.pinball-choice-btn:not([disabled])').first();
    if (await choice.isVisible().catch(() => false)) {
      await choice.click();
      continue;
    }
    await page.waitForTimeout(100);
  }

  await expect(page.locator('.pinball-game-over')).toBeVisible({
    timeout: 5_000,
  });
  expect(errors, errors.join('\n')).toEqual([]);
}

const profiles = [
  { name: 'desktop', viewport: { width: 1280, height: 800 }, hasTouch: false },
  {
    name: 'tablet',
    viewport: { width: 768, height: 1024 },
    hasTouch: true,
    isMobile: true,
  },
] as const;

for (const profile of profiles) {
  test.describe(`Fraction Pinball deep (${profile.name})`, () => {
    test.use({
      viewport: profile.viewport,
      hasTouch: profile.hasTouch,
      isMobile: 'isMobile' in profile ? profile.isMobile : undefined,
    });

    for (const difficulty of ['easy', 'medium', 'hard'] as const) {
      test(`vs AI ${difficulty} reaches game over without console errors`, async ({
        page,
      }) => {
        test.setTimeout(120_000);
        await startVsAiAt(page, 'fraction-pinball', difficulty);
        await expect(page.locator('.pinball-status')).toContainText(/Your turn/i);
        await expect(
          page.locator('.pinball-player-score.player1 .pinball-player-name')
        ).toHaveText('You');

        const choiceBox = await page
          .locator('.pinball-choice-btn')
          .first()
          .boundingBox();
        expect(choiceBox).toBeTruthy();
        expect(choiceBox!.height).toBeGreaterThanOrEqual(44);
        expect(choiceBox!.width).toBeGreaterThanOrEqual(44);

        // AI seat lock: while thinking, choices disabled
        const correctOrFirst = page.locator('.pinball-choice-btn').first();
        await correctOrFirst.click();
        if (await page.locator('.pinball-continue-btn').isVisible()) {
          await page.locator('.pinball-continue-btn').click();
        }
        await expect(page.locator('.status-ai-thinking')).toBeVisible({
          timeout: 3_000,
        });
        const disabled = page.locator('.pinball-choice-btn[disabled]');
        await expect(disabled.first()).toBeVisible();

        await playToEnd(page);

        const banner = page.locator('.pinball-winner-banner');
        await expect(banner).toBeVisible();
        await expect(banner).toHaveText(
          /You win!|Computer wins!|It's a Draw!/
        );
      });
    }
  });
}
