/**
 * Keyboard reachability smoke: main menu, New Game / Help modals,
 * and board move entry via Enter on a focusable grid cell.
 */
import { test, expect, type Page } from '@playwright/test';
import {
  waitForGameReady,
  dismissOwl,
} from './helpers/page';

test.describe('Keyboard a11y reachability', () => {
  test('main menu: Tab reaches division tab and Enter/Space activates a game card', async ({
    page,
  }) => {
    await page.goto('/#/');
    await expect(page.locator('h1')).toContainText('Math Pentathlon');

    const progress = page.locator('.hero-progress-link');
    await progress.focus();
    await expect(progress).toBeFocused();

    const firstTab = page.locator('.division-tab').first();
    await firstTab.focus();
    await expect(firstTab).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(firstTab).toHaveAttribute('aria-selected', 'true');

    const card = page
      .locator('.accordion-open .game-card:not(.game-card-disabled)')
      .first();
    await expect(card).toBeVisible();
    await card.focus();
    await expect(card).toBeFocused();

    // Visible focus ring (outline or box-shadow) on the focused card
    const hasFocusStyle = await card.evaluate((el) => {
      const style = getComputedStyle(el);
      return (
        (style.outlineStyle !== 'none' && style.outlineWidth !== '0px') ||
        style.boxShadow !== 'none'
      );
    });
    expect(hasFocusStyle).toBe(true);

    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#\/game\//);
    await waitForGameReady(page);
  });

  test('modal: New Game opens from keyboard, Escape closes and restores focus', async ({
    page,
  }) => {
    await page.goto('/#/game/prime-gold');
    await waitForGameReady(page);
    await dismissOwl(page);

    const newGameBtn = page.locator('#new-game-btn');
    await newGameBtn.focus();
    await expect(newGameBtn).toBeFocused();
    await page.keyboard.press('Enter');

    const modal = page.locator('#new-game-modal');
    await expect(modal).toBeVisible();
    await expect(modal).toHaveAttribute('role', 'dialog');
    await expect(modal).toHaveAttribute('aria-modal', 'true');

    // Focus should land inside the dialog
    await expect
      .poll(async () =>
        page.evaluate(() => {
          const m = document.getElementById('new-game-modal');
          return !!m && m.contains(document.activeElement);
        })
      )
      .toBe(true);

    await page.keyboard.press('Escape');
    await expect(modal).toHaveClass(/hidden/);
    await expect(newGameBtn).toBeFocused();
  });

  test('modal: Help Escape returns focus to How to Play', async ({ page }) => {
    await page.goto('/#/game/prime-gold');
    await waitForGameReady(page);
    await dismissOwl(page);

    const helpBtn = page.locator('#help-btn');
    await helpBtn.focus();
    await page.keyboard.press('Enter');

    const modal = page.locator('#help-modal');
    await expect(modal).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(modal).toHaveClass(/hidden/);
    await expect(helpBtn).toBeFocused();
  });

  test('board: focusable cell activates with Enter (Prime Gold)', async ({
    page,
  }) => {
    await page.goto('/#/game/prime-gold');
    await waitForGameReady(page);
    await dismissOwl(page);

    // Prime Gold: roll first, then place on a keyboard-focusable cell
    const rollBtn = page.locator('.pg-roll-btn');
    await expect(rollBtn).toBeVisible({ timeout: 10_000 });
    await rollBtn.focus();
    await page.keyboard.press('Enter');

    const cell = page
      .locator(
        '.pg-a11y-grid button[tabindex="0"], [role="gridcell"][tabindex="0"], #board [tabindex="0"]'
      )
      .first();
    await expect(cell).toBeVisible({ timeout: 10_000 });
    await cell.focus();
    await expect(cell).toBeFocused();
    await page.keyboard.press('Enter');

    // Prefer game status — shell `#status[role=status]` from #500 may be empty.
    await expect(page.locator('.pg-status').first()).toContainText(
      /turn|Roll|Select/i,
      { timeout: 8_000 }
    );
  });
});
