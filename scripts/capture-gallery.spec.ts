/**
 * Capture representative tablet screenshots (start + mid-game) for every
 * available game into docs/gallery/.
 *
 * Run (does not run in CI):
 *   npx playwright test -c playwright.gallery.config.ts
 *
 * Viewport: 1024×768 tablet landscape. Filenames: {game-id}-start.png,
 * {game-id}-mid.png. Mid-game = human-vs-human after one completed human turn.
 */
import { test, expect, type Page, type Locator } from '@playwright/test';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { GAMES, type GameInfo } from '../src/core/game-registry';

const AVAILABLE_GAMES = GAMES.filter((g) => g.available);
const OUT_DIR = path.resolve('docs/gallery');
const TABLET = { width: 1024, height: 768 } as const;

/** Primary board / play surface that proves the game mounted. */
const MOUNT: Record<string, string> = {
  'kings-quadraphages': '#board .board .cell, .cell-king',
  hex: '.hex-board',
  'star-track': '.star-track-board',
  'hex-a-gone': '.hex-a-gone-board',
  calla: '.calla-wrapper, .calla-pit',
  'sum-dominoes': '.sd-board',
  'par-55': '.par55-board',
  ramrod: '.ramrod-board',
  'kwatro-sinko': '.kwa-board',
  fiar: '.fiar-board-container',
  juggle: '.juggle-board',
  'contig-60': '.contig-board',
  'stars-bars': '.stars-board',
  'fab-a-diffy': '.fab-bar-pool, .fab-answer-board',
  'queens-guards': '.qg-board-container',
  'prime-gold': '.pg-board, .prime-board',
  'remainder-islands': '.remainder-board',
  'pent-em-in': '.pent-board',
  'frac-fact': '.frac-problem, .frac-choice-btn',
  'fraction-pinball':
    '.pinball-board, .pinball-challenge, .pinball-game-container, .pinball-choice-btn',
};

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
    if (el) {
      (el as HTMLElement).style.pointerEvents = 'none';
    }
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

async function gotoGame(page: Page, gameId: string) {
  await page.setViewportSize(TABLET);
  await page.goto(`/#/game/${gameId}`);
  await waitForGameReady(page);
}

async function startHuman(page: Page) {
  await waitForGameReady(page);
  const modal = page.locator('#new-game-modal');
  if (await modal.isVisible().catch(() => false)) {
    const human = page.locator('.mode-option[data-mode="human-vs-human"]');
    if (await human.isVisible().catch(() => false)) {
      await human.click();
    }
    await page.locator('#start-game-btn').click();
    await expect(modal).toHaveClass(/hidden/);
  }
  await dismissOwlIfNeeded(page);
}

function mountLocator(page: Page, gameId: string): Locator {
  const sel = MOUNT[gameId] ?? '#board, #game-container, main';
  return page.locator(sel).first();
}

async function settle(page: Page, ms = 400) {
  await page.waitForTimeout(ms);
}

/**
 * One human turn path (mirrors tests/e2e/smoke.spec.ts) without waiting for AI.
 * Enough board change for a representative mid-game frame.
 */
async function playOneHumanTurn(page: Page, gameId: string) {
  switch (gameId) {
    case 'kings-quadraphages': {
      await page
        .locator('.cell[data-row="1"][data-col="5"]')
        .click({ force: true });
      await page.locator('.cell[data-row="2"][data-col="5"]').click({
        force: true,
      });
      await page.locator('.cell[data-row="5"][data-col="5"]').click({
        force: true,
      });
      break;
    }
    case 'hex': {
      await page
        .locator('.hex-cell-group[data-row="5"][data-col="5"]')
        .click({ force: true });
      break;
    }
    case 'star-track': {
      await page.locator('.star-track-draw-btn').click({ force: true });
      const chain = page.locator('.star-track-chain-btn');
      await expect(chain.first()).toBeVisible({ timeout: 5000 });
      await chain.first().click({ force: true });
      break;
    }
    case 'hex-a-gone': {
      const bank = page.locator('.hex-a-gone-block-btn:not(.empty)').first();
      await bank.click({ force: true });
      const confirm = page.locator('.hex-a-gone-confirm-btn');
      if (await confirm.isVisible().catch(() => false)) {
        await confirm.click({ force: true });
      }
      const cell = page
        .locator('.hex-a-gone-board [data-q], .hex-a-gone-cell')
        .first();
      if (await cell.count()) {
        await cell.click({ force: true });
      }
      break;
    }
    case 'calla': {
      const pit = page.locator('.calla-pit-valid').first();
      if (await pit.count()) {
        await pit.click({ force: true });
      } else {
        await page.locator('.calla-pit').first().click({ force: true });
      }
      break;
    }
    case 'sum-dominoes': {
      await page.locator('.sd-roll-btn').click({ force: true });
      const playable = page.locator('.sd-hand-domino-playable');
      const pass = page.locator('.sd-pass-btn');
      if ((await playable.count()) > 0) {
        await playable.first().click({ force: true });
        const valid = page.locator('.sd-cell-valid');
        if ((await valid.count()) > 0) {
          await valid.first().click({ force: true });
        }
      } else if (await pass.isVisible().catch(() => false)) {
        await pass.click({ force: true });
      }
      break;
    }
    case 'par-55': {
      const block = page.locator('.par55-hand-block.clickable').first();
      await expect(block).toBeVisible({ timeout: 5000 });
      await block.click({ force: true });
      const base = page.locator('.par55-valid-base').first();
      if (await base.count()) {
        await base.click({ force: true });
      }
      break;
    }
    case 'ramrod': {
      const rod = page.locator('.ramrod-rod-wrapper.selectable').first();
      if (await rod.count()) {
        await rod.evaluate((el) => (el as HTMLElement).click());
        const slot = page.locator('.ramrod-slot.valid').first();
        if (await slot.count()) {
          await slot.click({ force: true });
        }
      }
      break;
    }
    case 'kwatro-sinko': {
      const chip = page.locator('.kwa-selectable-chip').first();
      await expect(chip).toBeVisible({ timeout: 5000 });
      await chip.click({ force: true });
      const dest = page.locator('.kwa-valid-node').first();
      if (await dest.count()) {
        await dest.click({ force: true });
      }
      break;
    }
    case 'fiar': {
      const node = page
        .locator(
          '[data-node-id]:has(.pulse-highlight), .fiar-board-container [data-node-id]'
        )
        .first();
      await node.click({ force: true });
      break;
    }
    case 'juggle': {
      await dismissOwlIfNeeded(page);
      await page.locator('.juggle-roll-btn').click({ force: true });
      const die = page.locator('.juggle-die.selectable').first();
      if (await die.count()) {
        await die.click({ force: true });
      }
      const shape = page.locator('.juggle-shape-option').first();
      if (await shape.count()) {
        await shape.click({ force: true });
      }
      const cell = page.locator(
        '.juggle-board.player1 .juggle-cell[data-row="0"][data-col="0"]'
      );
      await expect(cell).toBeVisible({ timeout: 5000 });
      await cell.evaluate((el) => (el as HTMLElement).click());
      break;
    }
    case 'contig-60': {
      await page.locator('.contig-roll-btn').click({ force: true });
      const valid = page.locator('.contig-cell-valid');
      const pass = page.locator('.contig-pass-btn');
      if ((await valid.count()) > 0) {
        await valid.first().click({ force: true });
      } else if (await pass.isVisible().catch(() => false)) {
        await pass.click({ force: true });
      }
      break;
    }
    case 'stars-bars': {
      const card = page.locator('.stars-card:not(.disabled)').first();
      await card.click({ force: true });
      const cell = page.locator('.stars-cell.valid').first();
      if (await cell.count()) {
        await cell.click({ force: true });
      }
      break;
    }
    case 'fab-a-diffy': {
      const bar = page
        .locator('.fab-bar-wrapper:not(.fab-bar-disabled)')
        .first();
      await bar.click({ force: true });
      const op = page
        .locator('.fab-op-valid, .fab-op-btn:not(.fab-op-disabled)')
        .first();
      if (await op.count()) {
        await op.click({ force: true });
      }
      break;
    }
    case 'queens-guards': {
      await page.locator('[data-cell-key="5-7"]').click({ force: true });
      const dest = page
        .locator('[data-cell-key][aria-label*="valid move"]')
        .first();
      if (await dest.count()) {
        await dest.click({ force: true });
      }
      break;
    }
    case 'prime-gold': {
      await page.locator('.pg-roll-btn, .prime-roll-btn').first().click({
        force: true,
      });
      const valid = page.locator('.pg-cell.valid, .prime-cell.valid').first();
      const pass = page.locator(
        '.pg-btn-secondary, .pg-pass-btn, button:has-text("Pass")'
      );
      if (await valid.count()) {
        await valid.click({ force: true });
      } else if (await pass.first().isVisible().catch(() => false)) {
        await pass.first().click({ force: true });
      }
      break;
    }
    case 'remainder-islands': {
      await dismissOwlIfNeeded(page);
      const roll = page
        .locator('.remainder-btn-roll, button:has-text("Roll")')
        .first();
      await roll.click({ force: true });
      const island = page.locator('.island.valid').first();
      await expect(island).toBeVisible({ timeout: 5000 });
      await island.evaluate((el) => {
        const hit = el.querySelector('polygon:last-of-type') ?? el;
        hit.dispatchEvent(
          new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
          })
        );
      });
      break;
    }
    case 'pent-em-in': {
      await page.locator('.pent-piece-option').first().click({ force: true });
      const cell = page
        .locator('.pent-board .interaction rect, .pent-board rect[data-row]')
        .first();
      if (await cell.count()) {
        await cell.click({ force: true });
      }
      break;
    }
    case 'frac-fact': {
      await page.locator('.frac-choice-btn').first().click({ force: true });
      const cont = page.locator(
        '.frac-continue-btn, button:has-text("Continue")'
      );
      await expect(cont.first()).toBeVisible({ timeout: 5000 });
      await cont.first().click();
      break;
    }
    case 'fraction-pinball': {
      await page.locator('.pinball-choice-btn').first().click({ force: true });
      const cont = page.locator(
        '.pinball-continue-btn, button:has-text("Continue")'
      );
      await expect(cont.first()).toBeVisible({ timeout: 5000 });
      await cont.first().click();
      break;
    }
    default:
      throw new Error(`Missing mid-game play path for ${gameId}`);
  }
}

async function captureShot(page: Page, basename: string) {
  const filePath = path.join(OUT_DIR, `${basename}.png`);
  await page.screenshot({ path: filePath, fullPage: false });
  expect(fs.statSync(filePath).size).toBeGreaterThan(1000);
}

test.describe.configure({ mode: 'serial' });

test.describe('docs/gallery tablet capture', () => {
  test.beforeAll(() => {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  });

  for (const game of AVAILABLE_GAMES) {
    test(`${game.id}: start + mid @ tablet`, async ({ page }) => {
      test.setTimeout(120_000);
      await captureGame(page, game);
    });
  }
});

async function captureGame(page: Page, game: GameInfo) {
  await gotoGame(page, game.id);
  await startHuman(page);
  await expect(mountLocator(page, game.id)).toBeVisible({ timeout: 10_000 });
  await settle(page, 500);
  await captureShot(page, `${game.id}-start`);

  await playOneHumanTurn(page, game.id);
  await settle(page, 600);
  await expect(mountLocator(page, game.id)).toBeVisible();
  await captureShot(page, `${game.id}-mid`);
}
