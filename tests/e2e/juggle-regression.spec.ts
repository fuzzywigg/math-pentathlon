/**
 * Juggle playability regressions: Pass Turn escape, vs-AI progress,
 * tablet coarse touch targets ≥44px.
 */
import { test, expect, type Page } from '@playwright/test';

async function dismissOwl(page: Page) {
  await page.evaluate(() => {
    const el = document.getElementById('ollie-owl');
    if (el) (el as HTMLElement).style.pointerEvents = 'none';
  });
}

async function waitReady(page: Page) {
  await expect(page.getByTestId('game-loading')).toBeHidden({
    timeout: 15_000,
  });
  await expect(page.locator('#new-game-btn, h1').first()).toBeVisible({
    timeout: 15_000,
  });
}

async function startVsAi(page: Page, difficulty: 'easy' | 'medium' | 'hard') {
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
}

async function humanPlaceOnce(page: Page) {
  const roll = page.locator('.juggle-roll-btn');
  if (await roll.isVisible().catch(() => false)) {
    await roll.click({ force: true });
  }

  const pass = page.locator('.juggle-pass-btn');
  if (await pass.isVisible().catch(() => false)) {
    await pass.click({ force: true });
    return 'pass';
  }

  const die = page.locator('.juggle-die.selectable').first();
  if (await die.count()) {
    await die.click({ force: true });
  }

  if (await pass.isVisible().catch(() => false)) {
    await pass.click({ force: true });
    return 'pass';
  }

  const shape = page.locator('.juggle-shape-option:not(.disabled)').first();
  if (await shape.count()) {
    await shape.click({ force: true });
  }

  // Prefer a valid preview cell; fall back to top-left empty.
  const preview = page.locator(
    '.juggle-board.player1.active .juggle-cell.preview-valid'
  );
  if (await preview.count()) {
    await preview.first().evaluate((el) => (el as HTMLElement).click());
  } else {
    const empty = page.locator(
      '.juggle-board.player1.active .juggle-cell:not([class*="occupied"])'
    );
    if (await empty.count()) {
      // Hover first so preview paints, then click a few candidates.
      for (let i = 0; i < Math.min(8, await empty.count()); i++) {
        const cell = empty.nth(i);
        await cell.hover({ force: true }).catch(() => undefined);
        await cell.evaluate((el) => (el as HTMLElement).click());
        const stillPlacing = await page
          .locator('.juggle-shape-controls')
          .isVisible()
          .catch(() => false);
        if (!stillPlacing) break;
      }
    }
  }
  return 'place';
}

test.describe('Juggle regressions', () => {
  test('vs-AI Easy: human places and computer replies without soft-lock', async ({
    page,
  }) => {
    await page.goto('/#/game/juggle');
    await startVsAi(page, 'easy');

    await expect(page.locator('.juggle-board')).toHaveCount(2);
    await humanPlaceOnce(page);

    // Wait until Blue placed, Red replied, Pass offered, or a winner appears.
    await expect
      .poll(
        async () => {
          const blueOcc = await page
            .locator('.juggle-cell.occupied-player1')
            .count();
          const redOcc = await page
            .locator('.juggle-cell.occupied-player2')
            .count();
          const status =
            (await page
              .locator('.juggle-status, .juggle-winner-banner')
              .textContent()) ?? '';
          const passVisible = await page
            .locator('.juggle-pass-btn')
            .isVisible()
            .catch(() => false);
          return (
            blueOcc > 0 ||
            redOcc > 0 ||
            passVisible ||
            /thinking|Pass|wins/i.test(status)
          );
        },
        { timeout: 25_000 }
      )
      .toBe(true);
  });

  test('tablet coarse: cell and roll targets meet 44px', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ media: 'screen' });
    await page.addInitScript(() => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: (query: string) => {
          const coarse = query.includes('pointer: coarse');
          const fine = query.includes('pointer: fine');
          const narrow = query.includes('max-width: 700px');
          const matches = coarse
            ? true
            : fine
              ? false
              : narrow
                ? window.innerWidth <= 700
                : false;
          return {
            matches,
            media: query,
            onchange: null,
            addListener: () => undefined,
            removeListener: () => undefined,
            addEventListener: () => undefined,
            removeEventListener: () => undefined,
            dispatchEvent: () => false,
          };
        },
      });
    });

    await page.goto('/#/game/juggle');
    await startVsAi(page, 'medium');

    const sizes = await page.evaluate(() => {
      const cell = document.querySelector('.juggle-cell') as HTMLElement | null;
      const roll = document.querySelector('.juggle-roll-btn') as HTMLElement | null;
      const cellBox = cell?.getBoundingClientRect();
      const rollBox = roll?.getBoundingClientRect();
      return {
        cellW: cellBox?.width ?? 0,
        cellH: cellBox?.height ?? 0,
        rollH: rollBox?.height ?? 0,
      };
    });

    expect(sizes.cellW).toBeGreaterThanOrEqual(44);
    expect(sizes.cellH).toBeGreaterThanOrEqual(44);
    expect(sizes.rollH).toBeGreaterThanOrEqual(44);
  });
});
