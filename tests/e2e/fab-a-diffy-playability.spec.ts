/**
 * Fab-a-Diffy playability regression e2e (Chromium desktop + tablet).
 * Deep volume (10+ games × difficulty × viewport) lives in the playtest
 * runner / docs — these specs guard the fixes.
 */
import { test, expect, type Page } from '@playwright/test';

const DESKTOP = { width: 1280, height: 800 };
const TABLET = { width: 768, height: 1024 };

async function dismissOwlIfNeeded(page: Page) {
  const dismiss = page.locator(
    '#ollie-owl button[aria-label="Dismiss message"], #ollie-owl .owl-bubble-dismiss'
  );
  if (await dismiss.first().isVisible().catch(() => false)) {
    await dismiss.first().click({ force: true });
  }
  const minimize = page.locator('#ollie-owl .owl-minimize-btn');
  if (await minimize.isVisible().catch(() => false)) {
    await minimize.click({ force: true });
  }
  await page.evaluate(() => {
    const el = document.getElementById('ollie-owl');
    if (el) (el as HTMLElement).style.pointerEvents = 'none';
  });
}

async function waitForGameReady(page: Page) {
  await expect(page.getByTestId('game-loading')).toBeHidden({
    timeout: 15_000,
  });
  await expect(page.locator('#new-game-btn, h1').first()).toBeVisible({
    timeout: 15_000,
  });
}

async function gotoFab(page: Page) {
  await page.goto('/#/game/fab-a-diffy');
  await waitForGameReady(page);
  await dismissOwlIfNeeded(page);
}

async function startVsAi(
  page: Page,
  difficulty: 'easy' | 'medium' | 'hard'
) {
  await page.locator('#new-game-btn').click();
  const modal = page.locator('#new-game-modal');
  await expect(modal).toBeVisible({ timeout: 10_000 });
  await page.locator('.mode-option[data-mode="human-vs-ai"]').click();
  await page.locator(`.difficulty-btn.${difficulty}`).click();
  await page.locator('#start-game-btn').click();
  await expect(modal).toHaveClass(/hidden/);
  await dismissOwlIfNeeded(page);
  await expect(
    page.locator('.fab-bar-pool, .fab-answer-board').first()
  ).toBeVisible();
}

/** Complete one human claim (or pass). */
async function tryHumanClaim(page: Page): Promise<boolean> {
  const thinking = page.locator('.fab-status.status-ai-thinking');
  if (await thinking.isVisible().catch(() => false)) {
    await expect(thinking).toBeHidden({ timeout: 20_000 });
  }
  if (await page.locator('.fab-winner-banner').isVisible().catch(() => false)) {
    return false;
  }

  const passBtn = page.locator('.fab-btn-secondary', { hasText: 'Pass Turn' });
  if (await passBtn.isVisible().catch(() => false)) {
    await passBtn.click({ force: true });
    return true;
  }

  const clear = page.locator('.fab-btn-secondary', {
    hasText: 'Clear Selection',
  });
  const ids = await page.$$eval(
    '.fab-bar-wrapper:not(.fab-bar-disabled)',
    (els) =>
      els.map((e) => e.getAttribute('data-bar-id')).filter((id): id is string => !!id)
  );
  if (ids.length < 2) return false;

  for (let i = 0; i < Math.min(ids.length, 8); i++) {
    for (let j = 0; j < Math.min(ids.length, 8); j++) {
      if (i === j) continue;
      if (await clear.isVisible().catch(() => false)) {
        await clear.click({ force: true });
      }
      const b1 = page.locator(`[data-bar-id="${ids[i]}"]`);
      const b2 = page.locator(`[data-bar-id="${ids[j]}"]`);
      if ((await b1.count()) === 0 || (await b2.count()) === 0) continue;
      if (await b1.evaluate((el) => el.classList.contains('fab-bar-disabled'))) {
        continue;
      }
      await b1.click({ force: true });
      if (await b2.evaluate((el) => el.classList.contains('fab-bar-disabled'))) {
        if (await clear.isVisible().catch(() => false)) {
          await clear.click({ force: true });
        }
        continue;
      }
      await b2.click({ force: true });
      const validOp = page.locator('.fab-op-valid').first();
      if (!(await validOp.isVisible().catch(() => false))) {
        if (await clear.isVisible().catch(() => false)) {
          await clear.click({ force: true });
        }
        continue;
      }
      await validOp.click({ force: true });
      const match = page.locator('.fab-answer-matchable').first();
      await expect(match).toBeAttached({ timeout: 5_000 });
      await match.scrollIntoViewIfNeeded();
      await match.click({ force: true });
      return true;
    }
  }
  return false;
}

test.describe('Fab-a-Diffy playability', () => {
  test('AI seat shows thinking and blocks human bar taps', async ({
    page,
  }) => {
    await page.setViewportSize(DESKTOP);
    await gotoFab(page);
    await startVsAi(page, 'easy');

    const claimed = await tryHumanClaim(page);
    expect(claimed).toBe(true);

    const thinking = page.locator('.fab-status.status-ai-thinking');
    await expect(thinking).toBeVisible({ timeout: 5_000 });
    await expect(thinking).toContainText(/Computer is thinking/i);
    await expect(
      page.locator('.fab-bar-wrapper:not(.fab-bar-disabled)')
    ).toHaveCount(0);

    await page.locator('.fab-bar-wrapper').first().click({ force: true });
    await expect(thinking).toBeVisible();
    await expect(thinking).toBeHidden({ timeout: 20_000 });
  });

  test('touch targets meet 44px floor (tablet + injected styles)', async ({
    page,
  }) => {
    await page.setViewportSize(TABLET);
    await gotoFab(page);
    await startVsAi(page, 'medium');

    const sizes = await page.evaluate(() => {
      const bar = document.querySelector('.fab-bar-wrapper') as HTMLElement;
      const css = document.getElementById('fab-styles')?.textContent || '';
      const rect = bar?.getBoundingClientRect();
      return {
        cssHas44: /min-height:\s*44px/.test(css),
        cssCoarse: /pointer:\s*coarse/.test(css),
        cssReduced: /prefers-reduced-motion:\s*reduce/.test(css),
        barH: rect?.height ?? 0,
        barW: rect?.width ?? 0,
      };
    });
    expect(sizes.cssHas44).toBe(true);
    expect(sizes.cssCoarse).toBe(true);
    expect(sizes.cssReduced).toBe(true);
    expect(sizes.barH).toBeGreaterThanOrEqual(44);
    expect(sizes.barW).toBeGreaterThanOrEqual(44);
  });

  test('human vs AI easy desktop completes claims without console AI errors', async ({
    page,
  }) => {
    test.setTimeout(120_000);
    await page.setViewportSize(DESKTOP);
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await gotoFab(page);
    await startVsAi(page, 'easy');

    for (let i = 0; i < 12; i++) {
      if (
        await page.locator('.fab-winner-banner').isVisible().catch(() => false)
      ) {
        break;
      }
      const moved = await tryHumanClaim(page);
      if (
        await page
          .locator('.fab-status.status-ai-thinking')
          .isVisible()
          .catch(() => false)
      ) {
        await expect(
          page.locator('.fab-status.status-ai-thinking')
        ).toBeHidden({ timeout: 20_000 });
      }
      if (!moved) break;
    }

    const historyCount = await page.locator('.fab-history-move').count();
    expect(historyCount).toBeGreaterThan(0);
    expect(consoleErrors.filter((e) => /AI:/i.test(e))).toEqual([]);
  });

  test('human vs AI hard tablet: AI think resolves (no stall)', async ({
    page,
  }) => {
    test.setTimeout(120_000);
    await page.setViewportSize(TABLET);
    await gotoFab(page);
    await startVsAi(page, 'hard');

    expect(await tryHumanClaim(page)).toBe(true);
    const thinking = page.locator('.fab-status.status-ai-thinking');
    await expect(thinking).toBeVisible({ timeout: 5_000 });
    await expect(thinking).toBeHidden({ timeout: 25_000 });
    // Human seat restored — some bars selectable again (or game over)
    const ended = await page
      .locator('.fab-winner-banner')
      .isVisible()
      .catch(() => false);
    if (!ended) {
      await expect(
        page.locator('.fab-bar-wrapper:not(.fab-bar-disabled)').first()
      ).toBeVisible();
    }
  });
});
