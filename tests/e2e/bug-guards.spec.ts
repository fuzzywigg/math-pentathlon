/**
 * Compact UI bug-guards that unit tests do not cover (illegal click no-ops,
 * selection integrity). Kept after the e2e smoke prune.
 */
import { test } from './fixtures';
import { expect } from '@playwright/test';
import { gotoGame, startHuman } from './helpers/page';

test.describe('Bug guards', () => {
  test('Kings: illegal far click keeps selection; legal turn flips seat', async ({
    page,
  }) => {
    await gotoGame(page, 'kings-quadraphages');
    await startHuman(page);

    await page
      .locator('.cell[data-row="1"][data-col="5"]')
      .click({ force: true });
    await expect(page.locator('.cell-selected')).toBeVisible();
    await expect(page.locator('.cell-valid-move')).toHaveCount(5);

    await page
      .locator('.cell[data-row="5"][data-col="5"]')
      .click({ force: true });
    await expect(page.locator('.status-turn')).toContainText('green square');

    await page
      .locator('.cell[data-row="2"][data-col="5"]')
      .click({ force: true });
    await expect(page.locator('.status-turn')).toContainText('Quadraphage');
    await page
      .locator('.cell[data-row="5"][data-col="5"]')
      .click({ force: true });

    await expect(page.locator('.status-turn')).toContainText('Player 2');
    await expect(page.locator('.supply-p1')).toContainText('29');
  });

  test('Hex: occupied re-click is a no-op', async ({ page }) => {
    await gotoGame(page, 'hex');
    await startHuman(page);

    const status = page.locator('.status-turn');
    await page.locator('.hex-cell-group[data-row="5"][data-col="5"]').click({
      force: true,
    });
    const afterP1 = await status.textContent();

    await page.locator('.hex-cell-group[data-row="5"][data-col="5"]').click({
      force: true,
    });
    await expect(status).toHaveText(afterP1 ?? '');
  });

  test('Fab-a-Diffy: disabled bar click does not clear selection', async ({
    page,
  }) => {
    await gotoGame(page, 'fab-a-diffy');
    await startHuman(page);

    await page
      .locator('.fab-bar-wrapper:not(.fab-bar-disabled)')
      .first()
      .click({ force: true });
    await expect(page.locator('.fab-bar-selected')).toBeVisible();

    const disabled = page.locator('.fab-bar-wrapper.fab-bar-disabled');
    if ((await disabled.count()) > 0) {
      await disabled.first().click({ force: true });
      await expect(page.locator('.fab-bar-selected')).toBeVisible();
    }
  });

  test('Stars & Bars: invalid cell click keeps card selection', async ({
    page,
  }) => {
    await gotoGame(page, 'stars-bars');
    await startHuman(page);

    await page.locator('.stars-card:not(.disabled)').first().click({
      force: true,
    });
    await expect(page.locator('.stars-card.selected')).toBeVisible();

    const invalid = page.locator('.stars-cell:not(.valid)');
    if ((await invalid.count()) > 0) {
      await invalid.first().click({ force: true });
      await expect(page.locator('.stars-card.selected')).toBeVisible();
    }
  });
});
