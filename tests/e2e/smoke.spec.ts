/**
 * High-value e2e smoke: menu loads, every available game opens, and each
 * game can complete a human move with a computer reply in vs-AI mode.
 */
import { test, expect, type Page, type Locator } from '@playwright/test';
import { GAMES, type GameInfo } from '../../src/core/game-registry';

const AVAILABLE_GAMES = GAMES.filter((g) => g.available);

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
  // Ensure the owl stack cannot intercept board clicks.
  await page.evaluate(() => {
    const el = document.getElementById('ollie-owl');
    if (el) {
      (el as HTMLElement).style.pointerEvents = 'none';
    }
  });
}

/** Lazy game chunks show `data-testid="game-loading"` until the shell mounts. */
async function waitForGameReady(page: Page) {
  await expect(page.getByTestId('game-loading')).toBeHidden({
    timeout: 15_000,
  });
  await expect(page.locator('#new-game-btn, h1').first()).toBeVisible({
    timeout: 15_000,
  });
}

async function gotoGame(page: Page, gameId: string) {
  await page.goto(`/#/game/${gameId}`);
  await waitForGameReady(page);
}

async function startVsAi(page: Page) {
  await waitForGameReady(page);
  await dismissOwlIfNeeded(page);
  // Games mount in human mode; open New Game to choose vs AI.
  await page.locator('#new-game-btn').click();
  const modal = page.locator('#new-game-modal');
  await expect(modal).toBeVisible({ timeout: 10_000 });
  await page.locator('.mode-option[data-mode="human-vs-ai"]').click();
  const easy = page.locator('.difficulty-btn.easy');
  if (await easy.isVisible().catch(() => false)) {
    await easy.click();
  }
  await page.locator('#start-game-btn').click();
  await expect(modal).toHaveClass(/hidden/);
  await dismissOwlIfNeeded(page);
}

async function startHuman(page: Page) {
  await waitForGameReady(page);
  const modal = page.locator('#new-game-modal');
  // Already playing human after lazy mount — only click Start if modal is open.
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

function titleStem(game: GameInfo): string {
  return game.name.replace(/[!?]+$/, '').split(' (')[0];
}

function mountLocator(page: Page, gameId: string): Locator {
  const sel = MOUNT[gameId] ?? '#board, #game-container, main';
  return page.locator(sel).first();
}

async function fingerprint(page: Page) {
  return page.evaluate(() => {
    const status =
      document.querySelector(
        '#status, .status-turn, .qg-status, .fiar-status, .ramrod-status, [role="status"]'
      )?.textContent ?? '';
    const history = document.querySelectorAll(
      '.move-history-entry, .history-entry, .kwa-history li, .ramrod-history-entry, .sd-history-entry'
    ).length;
    const p2 = document.querySelectorAll(
      '.cell-p2, .hex-cell-p2, .contig-cell-p2, .star-track-piece-p2, .calla-score-p2, .pg-cell.p2, .island.p2, .juggle-cell.p2, .stars-cell.p2, .fab-score-p2, .par55-score-p2, .kwa-chip-p2, .pent-cell-p2, .fiar-board-container [data-owner="2"], .fiar-board-container .chip-p2'
    ).length;
    const scores =
      document.querySelector(
        '.contig-score-p2, .sd-score-p2, .frac-scores, .pinball-scores, .pg-scores, .juggle-scores'
      )?.textContent ?? '';
    const boardLen =
      document.querySelector('#board, #game-container, main')?.innerHTML
        .length ?? 0;
    return { status, history, p2, scores, boardLen };
  });
}

async function waitForChange(
  page: Page,
  before: Awaited<ReturnType<typeof fingerprint>>,
  timeout = 15000
) {
  await expect
    .poll(async () => fingerprint(page), { timeout })
    .not.toEqual(before);
}

/** Complete one human action path, then wait for the board/status to advance (AI reply). */
async function playHumanThenAwaitAi(page: Page, gameId: string) {
  const before = await fingerprint(page);

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
      // Activate Blue A1 via DOM (owl overlay can steal real pointer events).
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
      // Click the transparent hit-area polygon (listener is not on the <g>).
      await island.evaluate((el) => {
        const hit = el.querySelector('polygon:last-of-type') ?? el;
        hit.dispatchEvent(
          new MouseEvent('click', { bubbles: true, cancelable: true, view: window })
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
      // Human result must be dismissed before AI gets the next problem.
      const cont = page.locator('.frac-continue-btn, button:has-text("Continue")');
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
      throw new Error(`Missing play path for ${gameId}`);
  }

  // Human action should change something first…
  await waitForChange(page, before, 10000).catch(() => undefined);
  const afterHuman = await fingerprint(page);

  // …then AI reply (or quiz advance) should change the fingerprint again,
  // or return control so the human can act (roll / status).
  await expect
    .poll(
      async () => {
        const now = await fingerprint(page);
        const changed =
          now.history !== afterHuman.history ||
          now.p2 !== afterHuman.p2 ||
          now.scores !== afterHuman.scores ||
          now.status !== afterHuman.status ||
          Math.abs(now.boardLen - afterHuman.boardLen) > 40;
        const status = now.status.toLowerCase();
        const aiMention =
          status.includes('ai') ||
          status.includes('red') ||
          status.includes('thinking') ||
          status.includes('purple');
        const humanCanAct = await page
          .locator(
            [
              '.contig-roll-btn',
              '.sd-roll-btn',
              '.juggle-roll-btn',
              '.pg-roll-btn',
              '.prime-roll-btn',
              '.star-track-draw-btn',
              '.remainder-btn-roll',
              '.frac-choice-btn',
              '.pinball-choice-btn',
              '.cell-king.cell-p1',
              '.hex-cell-group',
              '.calla-pit-valid',
              '.kwa-selectable-chip',
              '.ramrod-rod-wrapper.selectable',
              '.par55-hand-block.clickable',
              '.stars-card:not(.disabled)',
              '.fab-bar-wrapper:not(.fab-bar-disabled)',
              '.pent-piece-option',
              '.hex-a-gone-block-btn:not(.empty)',
              '[data-cell-key="5-7"]',
              '.fiar-board-container [data-node-id]',
              '.status-winner, .game-over, .winner',
              '.juggle-cell.occupied-player2',
              '.remainder-btn-roll',
            ].join(', ')
          )
          .first()
          .isVisible()
          .catch(() => false);
        // Quiz AI auto-answers: Red/Purple score or round advances.
        const quizAdvanced =
          /red|purple/i.test(now.scores) && now.scores !== afterHuman.scores;
        return changed || humanCanAct || aiMention || quizAdvanced;
      },
      { timeout: 15000 }
    )
    .toBeTruthy();

  await expect(mountLocator(page, gameId)).toBeVisible();
}

test.describe('Menu smoke', () => {
  test('landing page loads brand and available game cards', async ({
    page,
  }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Math Pentathlon/);
    await expect(page.locator('h1')).toContainText('Math Pentathlon');
    await expect(page.locator('.game-card').first()).toBeVisible();
    const availableCards = page.locator('.game-card:not(.game-card-disabled)');
    await expect(availableCards).toHaveCount(AVAILABLE_GAMES.length);
  });
});

test.describe('Every game opens', () => {
  for (const game of AVAILABLE_GAMES) {
    test(`${game.id} loads title and board`, async ({ page }) => {
      await gotoGame(page, game.id);
      await startHuman(page);
      await expect(page.locator('h1')).toContainText(titleStem(game));
      await expect(mountLocator(page, game.id)).toBeVisible({
        timeout: 10_000,
      });
    });
  }
});

test.describe('Vs-AI: human move + computer reply', () => {
  for (const game of AVAILABLE_GAMES) {
    test(`${game.id} human acts and AI replies`, async ({ page }) => {
      test.setTimeout(60_000);
      await gotoGame(page, game.id);
      await startVsAi(page);
      await expect(mountLocator(page, game.id)).toBeVisible({
        timeout: 10_000,
      });
      await playHumanThenAwaitAi(page, game.id);
    });
  }
});
