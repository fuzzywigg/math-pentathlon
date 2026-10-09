/**
 * Keyboard-only e2e (2D): Tab/Enter/Space/arrows play paths for ≥5 games.
 * Asserts polite live status regions and that a keyboard move advances turn/status.
 * No pointer clicks on board controls (shell Start may use click once to dismiss modal).
 */
import { test, expect, type Page } from '@playwright/test';
import {
  waitForGameReady,
  gotoGame,
  dismissOwl,
} from './helpers/page';

/** Start human mode using keyboard on the New Game modal when it is open. */
async function startHumanKeyboard(page: Page) {
  await waitForGameReady(page);
  const modal = page.locator('#new-game-modal');
  if (await modal.isVisible().catch(() => false)) {
    await expect(modal).toHaveAttribute('role', 'dialog');
    await expect(modal).toHaveAttribute('aria-modal', 'true');
    // Focus should already be inside after open; activate Start via keyboard.
    await page.locator('#start-game-btn').focus();
    await page.keyboard.press('Enter');
    await expect(modal).toHaveClass(/hidden/);
  }
  await dismissOwl(page);
}

async function liveStatusText(page: Page): Promise<string> {
  return page.evaluate(() => {
    const nodes = document.querySelectorAll('[role="status"][aria-live="polite"]');
    for (const n of nodes) {
      const t = (n.textContent ?? '').replace(/\s+/g, ' ').trim();
      if (t) return t;
    }
    return '';
  });
}

async function expectLiveStatus(page: Page) {
  const live = page.locator('[role="status"][aria-live="polite"]');
  await expect(live.first()).toBeAttached();
  const text = await liveStatusText(page);
  expect(text.length).toBeGreaterThan(0);
  return text;
}

test.describe('Keyboard-only playthrough (2D)', () => {
  test('New Game modal traps Tab focus', async ({ page }) => {
    await gotoGame(page, 'hex');
    await startHumanKeyboard(page);
    await dismissOwl(page);

    await page.locator('#new-game-btn').focus();
    await page.keyboard.press('Enter');
    const modal = page.locator('#new-game-modal');
    await expect(modal).toBeVisible();
    await expect(modal).toHaveAttribute('aria-modal', 'true');

    // Tab repeatedly — focus must stay inside the dialog.
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
      const inModal = await page.evaluate(() => {
        const m = document.getElementById('new-game-modal');
        return !!m && m.contains(document.activeElement);
      });
      expect(inModal).toBe(true);
    }

    await page.keyboard.press('Escape');
    await expect(modal).toHaveClass(/hidden/);
  });

  test('kings-quadraphages: arrow/Enter move + live status', async ({
    page,
  }) => {
    test.setTimeout(60_000);
    await gotoGame(page, 'kings-quadraphages');
    await startHumanKeyboard(page);
    const before = await expectLiveStatus(page);

    const king = page.locator('.cell[data-row="1"][data-col="5"]');
    await king.focus();
    await page.keyboard.press('Enter');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    // Place quadraphage on a free cell via keyboard.
    const place = page.locator('.cell[data-row="5"][data-col="5"]');
    await place.focus();
    await page.keyboard.press('Enter');

    await expect
      .poll(async () => liveStatusText(page), { timeout: 10_000 })
      .not.toBe(before);
    await expectLiveStatus(page);
  });

  test('hex: Enter places chip + live status advances', async ({ page }) => {
    test.setTimeout(60_000);
    await gotoGame(page, 'hex');
    await startHumanKeyboard(page);
    const before = await expectLiveStatus(page);

    const cell = page.locator(
      '.hex-cell-group[data-row="5"][data-col="5"]'
    );
    await cell.focus();
    await page.keyboard.press('Enter');

    await expect
      .poll(async () => liveStatusText(page), { timeout: 10_000 })
      .not.toBe(before);
    await expect(liveStatusText(page)).resolves.toMatch(/Red|turn|Move/i);
  });

  test('star-track: Enter draw + Enter chain', async ({ page }) => {
    test.setTimeout(60_000);
    await gotoGame(page, 'star-track');
    await startHumanKeyboard(page);
    const before = await expectLiveStatus(page);

    await page.locator('.star-track-draw-btn').focus();
    await page.keyboard.press('Enter');
    const chain = page.locator('.star-track-chain-btn').first();
    await expect(chain).toBeVisible({ timeout: 5000 });
    await chain.focus();
    await page.keyboard.press('Enter');

    await expect
      .poll(async () => liveStatusText(page), { timeout: 10_000 })
      .not.toBe(before);
  });

  test('contig-60: Enter roll + Enter place/pass', async ({ page }) => {
    test.setTimeout(60_000);
    await gotoGame(page, 'contig-60');
    await startHumanKeyboard(page);
    const before = await expectLiveStatus(page);

    await page.locator('.contig-roll-btn').focus();
    await page.keyboard.press('Enter');
    await expect
      .poll(async () => liveStatusText(page), { timeout: 5000 })
      .not.toBe(before);

    const valid = page.locator('.contig-cell-valid').first();
    const pass = page.locator('.contig-pass-btn');
    if ((await valid.count()) > 0) {
      await valid.focus();
      await page.keyboard.press('Enter');
    } else if (await pass.isVisible().catch(() => false)) {
      await pass.focus();
      await page.keyboard.press('Enter');
    }

    await expectLiveStatus(page);
  });

  test('frac-fact: Enter answer + Continue with labeled choices', async ({
    page,
  }) => {
    test.setTimeout(60_000);
    await gotoGame(page, 'frac-fact');
    await startHumanKeyboard(page);
    await expectLiveStatus(page);

    const choice = page.locator('.frac-choice-btn').first();
    await expect(choice).toHaveAttribute('aria-label', /Answer /);
    await choice.focus();
    await page.keyboard.press('Enter');

    const cont = page
      .locator('.frac-continue-btn, button:has-text("Continue")')
      .first();
    await expect(cont).toBeVisible({ timeout: 5000 });
    await cont.focus();
    await page.keyboard.press('Enter');
    await expectLiveStatus(page);
  });
});
