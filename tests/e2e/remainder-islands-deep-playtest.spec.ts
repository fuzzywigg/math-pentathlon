/**
 * Deep playtest e2e — Remainder Islands human vs AI.
 * Chromium only: desktop + tablet viewports, full matches, console-error guard.
 */
import { test, expect, type Page, devices } from '@playwright/test';
import path from 'node:path';
import fs from 'node:fs';

const ARTIFACT_DIR = '/opt/cursor/artifacts/remainder-islands-playtest';
const DOC_SHOT_DIR = path.join(
  process.cwd(),
  'docs/playtest/screenshots/remainder-islands-deep-2026-10-07'
);

const DIFFICULTIES = ['easy', 'medium', 'hard'] as const;
type Difficulty = (typeof DIFFICULTIES)[number];

const GAMES_PER_DIFFICULTY = 10;

test.describe.configure({ mode: 'serial', timeout: 180_000 });

async function dismissOwl(page: Page) {
  await page.evaluate(() => {
    const el = document.getElementById('ollie-owl');
    if (el) (el as HTMLElement).style.pointerEvents = 'none';
  });
}

async function waitReady(page: Page) {
  await expect(page.getByTestId('game-loading')).toBeHidden({ timeout: 15_000 });
  await expect(page.locator('#new-game-btn').first()).toBeVisible({
    timeout: 15_000,
  });
}

async function startVsAi(page: Page, difficulty: Difficulty) {
  await waitReady(page);
  await dismissOwl(page);
  await page.locator('#new-game-btn').click();
  const modal = page.locator('#new-game-modal');
  await expect(modal).toBeVisible({ timeout: 10_000 });
  await page.locator('.mode-option[data-mode="human-vs-ai"]').click();
  await page.locator(`.difficulty-btn.${difficulty}`).click();
  await page.locator('#start-game-btn').click();
  await expect(modal).toHaveClass(/hidden/);
  await dismissOwl(page);
  await expect(page.locator('.remainder-board')).toBeVisible();
}

async function pickBestIsland(page: Page): Promise<boolean> {
  return page.evaluate(() => {
    const groups = Array.from(
      document.querySelectorAll('.island.valid[data-island-id]')
    );
    if (groups.length === 0) return false;
    let best: Element | null = null;
    let bestRem = -1;
    for (const g of groups) {
      const hint =
        g.querySelector('.island-r-hint')?.textContent ??
        g.querySelector('.island-r-preview')?.textContent ??
        '';
      const m = /R=(\d+)/.exec(hint);
      const rem = m ? Number(m[1]) : 0;
      if (rem > bestRem) {
        bestRem = rem;
        best = g;
      }
    }
    const target = best ?? groups[0];
    const hit =
      target.querySelector('polygon:last-of-type') ?? target;
    hit.dispatchEvent(
      new MouseEvent('click', { bubbles: true, cancelable: true, view: window })
    );
    return true;
  });
}

async function playFullGame(page: Page, maxSteps = 80): Promise<{
  winnerText: string;
  consoleErrors: string[];
}> {
  const consoleErrors: string[] = [];
  const onError = (msg: { type: () => string; text: () => string }) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  };
  page.on('console', onError);

  try {
    for (let step = 0; step < maxSteps; step += 1) {
      if (await page.locator('.remainder-game-over').isVisible().catch(() => false)) {
        break;
      }

      const roll = page.locator('.remainder-btn-roll');
      if (await roll.isVisible().catch(() => false)) {
        await roll.click({ force: true });
        // Selection or skip+AI may follow.
        await page.waitForTimeout(200);
      }

      if (await page.locator('.remainder-game-over').isVisible().catch(() => false)) {
        break;
      }

      if (await page.locator('.island.valid').first().isVisible().catch(() => false)) {
        const status = await page.locator('.remainder-status').textContent();
        if (status && /computer/i.test(status)) {
          await page
            .waitForFunction(
              () =>
                !!document.querySelector('.remainder-game-over') ||
                !!document.querySelector('.remainder-btn-roll') ||
                (!!document.querySelector('.island.valid') &&
                  !/computer/i.test(
                    document.querySelector('.remainder-status')?.textContent ?? ''
                  )),
              null,
              { timeout: 15_000 }
            )
            .catch(() => undefined);
          continue;
        }
        await pickBestIsland(page);
        await page
          .waitForFunction(
            () =>
              !!document.querySelector('.remainder-game-over') ||
              !!document.querySelector('.remainder-btn-roll') ||
              /computer/i.test(
                document.querySelector('.remainder-status')?.textContent ?? ''
              ),
            null,
            { timeout: 15_000 }
          )
          .catch(() => undefined);
        continue;
      }

      // Waiting on AI think / skip notice
      await page.waitForTimeout(300);
    }

    await expect(page.locator('.remainder-game-over')).toBeVisible({
      timeout: 20_000,
    });
    const winnerText =
      (await page.locator('.remainder-winner-banner').textContent()) ?? '';
    return { winnerText, consoleErrors };
  } finally {
    page.off('console', onError);
  }
}

async function ensureDirs() {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
  fs.mkdirSync(DOC_SHOT_DIR, { recursive: true });
}

for (const viewport of [
  { name: 'desktop', ...devices['Desktop Chrome'] },
  { name: 'tablet', ...devices['iPad Mini'] },
]) {
  test.describe(`Remainder Islands deep (${viewport.name})`, () => {
    test.skip(({ browserName }) => browserName !== 'chromium', 'chromium-only');

    test.use({
      ...viewport,
      // devices['iPad Mini'] already sets viewport; Desktop Chrome too.
    });

    test(`plays ${GAMES_PER_DIFFICULTY} full games per Easy/Medium/Hard`, async ({
      page,
    }) => {
      await ensureDirs();
      const summary: Record<
        Difficulty,
        { wins: number; losses: number; draws: number; errors: string[] }
      > = {
        easy: { wins: 0, losses: 0, draws: 0, errors: [] },
        medium: { wins: 0, losses: 0, draws: 0, errors: [] },
        hard: { wins: 0, losses: 0, draws: 0, errors: [] },
      };

      for (const difficulty of DIFFICULTIES) {
        for (let g = 1; g <= GAMES_PER_DIFFICULTY; g += 1) {
          await page.goto('/#/game/remainder-islands');
          await startVsAi(page, difficulty);

          if (g === 1) {
            // Capture mid-select UX (roll once, screenshot hints).
            const roll = page.locator('.remainder-btn-roll');
            if (await roll.isVisible()) {
              await roll.click({ force: true });
              await page.waitForTimeout(250);
              if (await page.locator('.island-r-hint').first().isVisible().catch(() => false)) {
                const shot = `select-${viewport.name}-${difficulty}.png`;
                await page.screenshot({
                  path: path.join(ARTIFACT_DIR, shot),
                  fullPage: true,
                });
                await page.screenshot({
                  path: path.join(DOC_SHOT_DIR, shot),
                  fullPage: true,
                });
              }
            }
            // Restart clean for a full match after the UX shot.
            await page.goto('/#/game/remainder-islands');
            await startVsAi(page, difficulty);
          }

          const { winnerText, consoleErrors } = await playFullGame(page);
          expect(consoleErrors, `console errors ${viewport.name} ${difficulty}#${g}`).toEqual(
            []
          );
          if (/Blue Wins/i.test(winnerText)) summary[difficulty].wins += 1;
          else if (/Red Wins/i.test(winnerText)) summary[difficulty].losses += 1;
          else summary[difficulty].draws += 1;

          if (g === 1 || g === GAMES_PER_DIFFICULTY) {
            const shot = `gameover-${viewport.name}-${difficulty}-g${g}.png`;
            await page.screenshot({
              path: path.join(ARTIFACT_DIR, shot),
              fullPage: true,
            });
            await page.screenshot({
              path: path.join(DOC_SHOT_DIR, shot),
              fullPage: true,
            });
          }
        }
      }

      const reportPath = path.join(
        ARTIFACT_DIR,
        `summary-${viewport.name}.json`
      );
      fs.writeFileSync(reportPath, JSON.stringify(summary, null, 2));

      // Sanity: every difficulty completed the full batch.
      for (const d of DIFFICULTIES) {
        const t =
          summary[d].wins + summary[d].losses + summary[d].draws;
        expect(t).toBe(GAMES_PER_DIFFICULTY);
      }
    });
  });
}
