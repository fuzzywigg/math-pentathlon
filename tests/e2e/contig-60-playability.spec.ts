/**
 * Contig 60 playability e2e — tablet + desktop, Easy/Med/Hard regression
 * for New Game AI-timer race, touch targets, and a full vs-AI game each.
 * Chromium-only (matches deep playtest harness); other projects skip.
 */
import { test, expect, type Page } from '@playwright/test';
import {
  dismissOwl,
  startVsAiAt,
} from './helpers/page';

test.beforeEach(({ browserName }) => {
  test.skip(browserName !== 'chromium', 'Contig deep playtest is Chromium-only');
});

async function humanTurn(page: Page) {
  const roll = page.locator('.contig-roll-btn:not([disabled])');
  await expect(roll).toBeVisible({ timeout: 15_000 });
  await roll.click({ force: true });

  const pass = page.locator('.contig-pass-btn');
  const valid = page.locator('.contig-cell-valid');
  await page.waitForTimeout(100);
  if ((await valid.count()) > 0) {
    await valid.first().click({ force: true });
  } else if (await pass.isVisible().catch(() => false)) {
    await pass.click({ force: true });
  } else {
    const expr = page.locator('.contig-expr-option').first();
    if (await expr.count()) await expr.click({ force: true });
  }
}

async function waitForHumanOrEnd(page: Page) {
  await page.waitForFunction(
    () => {
      const winner = document.querySelector(
        '.contig-winner-banner, .game-winner-banner'
      );
      if (winner) return true;
      const roll = document.querySelector(
        '.contig-roll-btn:not([disabled])'
      ) as HTMLButtonElement | null;
      if (roll) return true;
      const thinking = document.querySelector('.status-ai-thinking');
      return !thinking;
    },
    { timeout: 20_000 }
  );
}

const difficulties = ['easy', 'medium', 'hard'] as const;

const profiles = [
  {
    name: 'tablet',
    viewport: { width: 768, height: 1024 },
    hasTouch: true,
    isMobile: true,
  },
  {
    name: 'desktop',
    viewport: { width: 1280, height: 800 },
    hasTouch: false,
    isMobile: false,
  },
] as const;

for (const profile of profiles) {
  test.describe(`Contig 60 playability (${profile.name})`, () => {
    test.use({
      viewport: profile.viewport,
      hasTouch: profile.hasTouch,
      isMobile: profile.isMobile,
    });

    for (const difficulty of difficulties) {
      test(`vs-AI ${difficulty}: full game ends without stall`, async ({
        page,
      }) => {
        test.setTimeout(180_000);
        const errors: string[] = [];
        page.on('console', (msg) => {
          if (msg.type() === 'error') errors.push(msg.text());
        });
        page.on('pageerror', (err) => errors.push(String(err)));

        await startVsAiAt(page, 'contig-60', difficulty);

        const touch = await page.evaluate(() => {
          const cell = document.querySelector('.contig-cell');
          const roll = document.querySelector('.contig-roll-btn');
          const cr = cell?.getBoundingClientRect();
          const rr = roll?.getBoundingClientRect();
          return {
            cellH: cr ? Math.round(cr.height) : 0,
            cellW: cr ? Math.round(cr.width) : 0,
            rollH: rr ? Math.round(rr.height) : 0,
          };
        });
        expect(touch.cellH).toBeGreaterThanOrEqual(44);
        expect(touch.cellW).toBeGreaterThanOrEqual(44);
        expect(touch.rollH).toBeGreaterThanOrEqual(44);

        let ended = false;
        for (let turn = 0; turn < 90; turn++) {
          if (
            (await page
              .locator('.contig-winner-banner, .game-winner-banner')
              .count()) > 0
          ) {
            ended = true;
            break;
          }
          await humanTurn(page);
          await waitForHumanOrEnd(page);
          if (
            (await page
              .locator('.contig-winner-banner, .game-winner-banner')
              .count()) > 0
          ) {
            ended = true;
            break;
          }
        }
        expect(ended).toBe(true);
        expect(errors).toEqual([]);
      });
    }

    test('New Game during AI pause does not auto-roll for Blue', async ({
      page,
    }) => {
      await startVsAiAt(page, 'contig-60', 'medium');
      await humanTurn(page);
      await page.locator('#new-game-btn').click();
      await page.locator('.mode-option[data-mode="human-vs-ai"]').click();
      await page.locator('.difficulty-btn.medium').click();
      await page.locator('#start-game-btn').click();
      await expect(page.locator('#new-game-modal')).toHaveClass(/hidden/);

      // Wait on the settled post-reset UI instead of a fixed 2s sleep (AI pause).
      await expect(page.locator('.contig-status')).toContainText("Blue's turn", {
        timeout: 5_000,
      });
      await expect(page.locator('.contig-status')).toContainText('Roll the dice');
      await expect(page.locator('.contig-roll-btn')).toBeVisible();
      await expect(page.locator('.contig-die')).toHaveCount(0);
      await expect(page.locator('.contig-cell-p1')).toHaveCount(0);
      await expect(page.locator('.contig-cell-p2')).toHaveCount(0);
    });
  });
}
