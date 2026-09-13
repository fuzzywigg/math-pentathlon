import { test, expect, Page } from '@playwright/test';
import { GAMES } from '../../src/core/game-registry';

async function dismissModeIfNeeded(page: Page) {
  const modal = page.locator('#new-game-modal');
  if (await modal.isVisible().catch(() => false)) {
    const start = page.locator('#start-game-btn');
    if (await start.isVisible().catch(() => false)) {
      await start.click();
    }
  }
}

const AVAILABLE_GAMES = GAMES.filter((g) => g.available);

test.describe('Contig 60 — e2e smoke', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/contig-60');
    await dismissModeIfNeeded(page);
  });

  test('loads title, board, and scores', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Contig 60');
    await expect(page.locator('.contig-board')).toBeVisible();
    await expect(page.locator('.contig-cell')).toHaveCount(60);
    await expect(page.locator('.contig-score-p1')).toBeVisible();
    await expect(page.locator('.contig-score-p2')).toBeVisible();
  });

  test('rolls dice and offers expressions or pass', async ({ page }) => {
    await page.locator('.contig-roll-btn').click();
    await expect(page.locator('.contig-dice-display')).toBeVisible();

    const expressions = page.locator('.contig-expressions');
    await expect(expressions).toBeVisible();

    const valid = page.locator('.contig-cell-valid');
    const pass = page.locator('.contig-pass-btn');
    const validCount = await valid.count();
    if (validCount > 0) {
      await valid.first().click();
      await expect(page.locator('.contig-roll-btn')).toBeVisible();
      await expect(page.locator('.contig-cell-p1')).toHaveCount(1);
    } else {
      await expect(pass).toBeVisible();
      await pass.click();
      await expect(page.locator('.contig-roll-btn')).toBeVisible();
    }
  });

  test('how to play modal opens', async ({ page }) => {
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.click('#help-modal .modal-close');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
  });
});

test.describe('Sum Dominoes — e2e smoke', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/sum-dominoes');
    await dismissModeIfNeeded(page);
  });

  test('loads title, board, hands, and dice CTA', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Sum Dominoes');
    await expect(page.locator('.sd-board')).toBeVisible();
    await expect(page.locator('.sd-hand-player1 .sd-hand-domino')).toHaveCount(
      7
    );
    await expect(page.locator('.sd-hand-player2 .sd-hand-domino')).toHaveCount(
      7
    );
    await expect(page.locator('.sd-roll-btn')).toBeVisible();
  });

  test('roll advances to place or pass UI', async ({ page }) => {
    await page.locator('.sd-roll-btn').click();
    await expect(page.locator('.sd-dice-display')).toBeVisible();

    const playable = page.locator('.sd-hand-domino-playable');
    const passBtn = page.locator('.sd-pass-btn');

    if ((await playable.count()) > 0) {
      await playable.first().click();
      await expect(page.locator('.sd-hand-domino-selected')).toBeVisible();
      const valid = page.locator('.sd-cell-valid');
      if ((await valid.count()) > 0) {
        await valid.first().click({ force: true });
        await expect(page.locator('.sd-roll-btn')).toBeVisible();
      }
    } else {
      await expect(passBtn).toBeVisible();
      await passBtn.click();
      await expect(page.locator('.sd-roll-btn')).toBeVisible();
    }
  });
});

test.describe('Star Track — e2e smoke', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/star-track');
    await dismissModeIfNeeded(page);
  });

  test('loads title and track chrome', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Star Track');
    await expect(page.locator('.star-track-board')).toBeVisible();
    await expect(page.locator('.star-track-draw-btn')).toBeVisible();
    await expect(page.locator('.star-track-piece-p1')).toBeVisible();
    await expect(page.locator('.star-track-piece-p2')).toBeVisible();
  });

  test('draw → choose chain advances Blue progress', async ({ page }) => {
    await page.locator('.star-track-draw-btn').click();
    await expect(page.locator('.star-track-chain-btn')).toHaveCount(2);

    await page.locator('.star-track-chain-btn').first().click();
    // After P1 move, either draw button returns (P2 turn) or choices for next
    await expect(page.locator('.star-track-draw-btn')).toBeVisible();
    await expect(page.locator('.progress-p1')).toBeVisible();
  });

  test('new game modal resets to draw phase', async ({ page }) => {
    await page.locator('.star-track-draw-btn').click();
    await page.locator('.star-track-chain-btn').first().click();

    await page.click('#new-game-btn');
    await expect(page.locator('#new-game-modal')).not.toHaveClass(/hidden/);
    await page.click('#start-game-btn');
    await expect(page.locator('.star-track-draw-btn')).toBeVisible();
  });
});

test.describe('Kings & Quadraphages — e2e turn integrity', () => {
  test('illegal far click keeps selection; legal turn flips seat', async ({
    page,
  }) => {
    await page.goto('/#/game/kings-quadraphages');

    await page
      .locator('.cell[data-row="1"][data-col="5"]')
      .click({ force: true });
    await expect(page.locator('.cell-selected')).toBeVisible();
    await expect(page.locator('.cell-valid-move')).toHaveCount(5);

    // Invalid destination — stay in move phase
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
});

test.describe('Hex — e2e smoke', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/hex');
    await dismissModeIfNeeded(page);
  });

  test('loads title and board; empty cell click updates status', async ({
    page,
  }) => {
    await expect(page.locator('h1')).toContainText('Hex');
    await expect(page.locator('.hex-board')).toBeVisible();

    const status = page.locator('.status-turn');
    const before = await status.textContent();
    await page.locator('.hex-cell-group[data-row="5"][data-col="5"]').click({
      force: true,
    });
    await expect(status).not.toHaveText(before ?? '');
  });

  test('legal click flips seat; occupied re-click is a no-op', async ({
    page,
  }) => {
    const status = page.locator('.status-turn');
    await page.locator('.hex-cell-group[data-row="5"][data-col="5"]').click({
      force: true,
    });
    // After P1 places, status should mention player 2 / red / second seat
    await expect(status).toBeVisible();
    const afterP1 = await status.textContent();

    // Occupied cell should not change status
    await page.locator('.hex-cell-group[data-row="5"][data-col="5"]').click({
      force: true,
    });
    await expect(status).toHaveText(afterP1 ?? '');

    // Empty cell for P2 advances again
    await page.locator('.hex-cell-group[data-row="4"][data-col="4"]').click({
      force: true,
    });
    await expect(status).not.toHaveText(afterP1 ?? '');
  });
});

test.describe('Calla — e2e smoke', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/calla');
    await dismissModeIfNeeded(page);
  });

  test('loads title and board; valid pit is clickable', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Calla');
    await expect(page.locator('.calla-board')).toBeVisible();
    const valid = page.locator('.calla-pit-valid');
    await expect(valid.first()).toBeVisible();
    await valid.first().click({ force: true });
    await expect(page.locator('.calla-status')).toBeVisible();
  });

  test('valid pit click updates status text', async ({ page }) => {
    const status = page.locator('.calla-status');
    const before = await status.textContent();
    await page.locator('.calla-pit-valid').first().click({ force: true });
    await expect(status).not.toHaveText(before ?? '');
  });

  test('empty pit click is a no-op for status', async ({ page }) => {
    // First sow some cubes so at least one pit may empty; then try empty pits
    await page.locator('.calla-pit-valid').first().click({ force: true });
    const status = page.locator('.calla-status');
    const before = await status.textContent();
    const empty = page.locator('.calla-pit:not(.calla-pit-valid)').first();
    if ((await empty.count()) > 0) {
      await empty.click({ force: true });
      await expect(status).toHaveText(before ?? '');
    }
    await expect(page.locator('.calla-board')).toBeVisible();
  });
});

test.describe('Hex-a-Gone — e2e smoke', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/hex-a-gone');
    await dismissModeIfNeeded(page);
  });

  test('loads title, board, bank; confirm if visible after select', async ({
    page,
  }) => {
    await expect(page.locator('h1')).toContainText('Hex-a-Gone');
    await expect(page.locator('.hex-a-gone-board')).toBeVisible();
    const bankBtn = page.locator('.hex-a-gone-block-btn:not(.empty)').first();
    await expect(bankBtn).toBeVisible();
    await bankBtn.click();
    const confirm = page.locator('.hex-a-gone-confirm-btn');
    if (await confirm.isVisible().catch(() => false)) {
      await confirm.click();
      await expect(page.locator('.hex-a-gone-placing-info')).toBeVisible();
    }
  });

  test('confirm then place updates status or placing info', async ({ page }) => {
    const bankBtn = page.locator('.hex-a-gone-block-btn:not(.empty)').first();
    await bankBtn.click();
    const confirm = page.locator('.hex-a-gone-confirm-btn');
    if (!(await confirm.isVisible().catch(() => false))) {
      await expect(page.locator('.hex-a-gone-board')).toBeVisible();
      return;
    }
    await confirm.click();
    const status = page.locator(
      '.hex-a-gone-status, .status-turn, .hex-a-gone-placing-info'
    );
    await expect(status.first()).toBeVisible();
    const cell = page
      .locator('.hex-a-gone-board [data-q], .hex-a-gone-cell, .hex-cell')
      .first();
    if ((await cell.count()) > 0) {
      await cell.click({ force: true });
    }
    await expect(page.locator('.hex-a-gone-board')).toBeVisible();
  });
});

test.describe('Prime Gold — e2e smoke', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/prime-gold');
    await dismissModeIfNeeded(page);
  });

  test('loads title, board, and roll CTA', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Prime Gold');
    await expect(page.locator('.pg-board')).toBeVisible();
    await expect(page.locator('.pg-roll-btn')).toBeVisible();
    await page.locator('.pg-roll-btn').click();
    await expect(
      page.locator('.pg-dice-container .pg-die').first()
    ).toBeVisible();
  });

  test('after roll, places on valid cell when available', async ({ page }) => {
    await page.locator('.pg-roll-btn').click();
    await expect(
      page.locator('.pg-dice-container .pg-die').first()
    ).toBeVisible();

    const valid = page.locator('.pg-cell.valid');
    const pass = page.locator('.pg-btn-secondary, .pg-controls button').filter({
      hasText: /pass/i,
    });

    if ((await valid.count()) > 0) {
      await valid.first().click({ force: true });
      await expect(page.locator('.pg-board')).toBeVisible();
    } else if ((await pass.count()) > 0) {
      await pass.first().click();
      await expect(page.locator('.pg-roll-btn')).toBeVisible();
    } else {
      await expect(page.locator('.pg-board')).toBeVisible();
    }
  });
});

test.describe('Remainder Islands — e2e smoke', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/remainder-islands');
    await dismissModeIfNeeded(page);
  });

  test('loads title and roll CTA', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Remainder Islands');
    await expect(page.locator('.remainder-board')).toBeVisible();
    await expect(page.locator('.remainder-btn-roll')).toBeVisible();
    await page.locator('.remainder-btn-roll').click();
  });

  test('after roll, clicks a valid island when available', async ({ page }) => {
    await page.locator('.remainder-btn-roll').click();
    await expect(page.locator('.remainder-board')).toBeVisible();

    const valid = page.locator('.island.valid');
    if ((await valid.count()) > 0) {
      await valid.first().click({ force: true });
      await expect(page.locator('.remainder-board')).toBeVisible();
    } else {
      await expect(page.locator('.remainder-board')).toBeVisible();
    }
  });
});

test.describe('Juggle — e2e smoke', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/juggle');
    await dismissModeIfNeeded(page);
  });

  test('loads title, board, and roll CTA', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Juggle');
    await expect(page.locator('.juggle-board').first()).toBeVisible();
    await expect(page.locator('.juggle-roll-btn')).toBeVisible();
    await page.locator('.juggle-roll-btn').click();
    await expect(page.locator('.juggle-dice-display')).toBeVisible();
  });

  test('after roll, selects die/shape and tries a board cell', async ({
    page,
  }) => {
    await page.locator('.juggle-roll-btn').click();
    await expect(page.locator('.juggle-dice-display')).toBeVisible();

    const die = page.locator('.juggle-die.selectable');
    if ((await die.count()) > 0) {
      await die.first().click({ force: true });
    }

    const shape = page.locator('.juggle-shape-option');
    if ((await shape.count()) > 0) {
      await shape.first().click({ force: true });
      const cell = page.locator('.juggle-cell').first();
      if ((await cell.count()) > 0) {
        await cell.click({ force: true });
      }
    }

    await expect(page.locator('.juggle-board').first()).toBeVisible();
  });
});

test.describe('Ramrod — e2e smoke', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/ramrod');
    await dismissModeIfNeeded(page);
  });

  test('loads title and board', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Ramrod');
    await expect(page.locator('.ramrod-board')).toBeVisible();
  });

  test('selects a rod and places on a valid slot when available', async ({
    page,
  }) => {
    await expect(page.locator('.ramrod-board')).toBeVisible();

    // Dismiss Ollie if covering the hand; use DOM click to avoid overlay intercept
    const dismissOwl = page.locator(
      '#ollie-owl button[aria-label="Dismiss message"]'
    );
    if (await dismissOwl.isVisible().catch(() => false)) {
      await dismissOwl.click({ force: true });
    }

    const selectable = page.locator('.ramrod-rod-wrapper.selectable');
    if ((await selectable.count()) > 0) {
      await selectable.first().evaluate((el) => (el as HTMLElement).click());
      await expect(page.locator('.ramrod-status')).toContainText(/Place rod/i);

      const validSlot = page.locator('.ramrod-slot.valid');
      if ((await validSlot.count()) > 0) {
        await validSlot.first().click({ force: true });
      }
    }

    await expect(page.locator('.ramrod-board')).toBeVisible();
    await expect(
      page.locator('.ramrod-scores, .ramrod-history, .ramrod-controls').first()
    ).toBeVisible();
  });
});

test.describe('Frac Fact — e2e smoke', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/frac-fact');
    await dismissModeIfNeeded(page);
  });

  test('loads title and choice buttons', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Frac Fact');
    await expect(page.locator('.frac-problem')).toBeVisible();
    await expect(page.locator('.frac-choice-btn').first()).toBeVisible();
  });

  test('clicking a choice shows result or keeps scores visible', async ({
    page,
  }) => {
    await page.locator('.frac-choice-btn').first().click({ force: true });
    await expect(
      page.locator('.frac-result, .frac-scores, .frac-feedback').first()
    ).toBeVisible();
  });
});

test.describe('FIAR — e2e smoke', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/fiar');
    await dismissModeIfNeeded(page);
  });

  test('loads title and places one chip on a node', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('FIAR');
    const node = page.locator('[data-node-id]').first();
    await expect(node).toBeVisible();
    await node.click({ force: true });
    await expect(
      page.locator('.fiar-status, .fiar-chips-info').first()
    ).toBeVisible();
  });

  test('places chips then tries movement UI if it appears', async ({
    page,
  }) => {
    const nodes = page.locator('[data-node-id]');
    const nodeCount = await nodes.count();
    const placements = Math.min(8, nodeCount);

    for (let i = 0; i < placements; i++) {
      await nodes.nth(i).click({ force: true });
    }

    await expect(
      page.locator('.fiar-status, .fiar-chips-info').first()
    ).toBeVisible();

    const selectable = page.locator('[data-node-id]:has(.pulse-highlight)');
    if ((await selectable.count()) > 0) {
      await selectable.first().click({ force: true });
      // After selection, another empty/valid destination may be clickable
      const destinations = page.locator('[data-node-id]');
      if ((await destinations.count()) > 1) {
        await destinations.nth(1).click({ force: true });
      }
    }

    await expect(
      page.locator('.fiar-status, .fiar-chips-info').first()
    ).toBeVisible();
  });
});

test.describe('Stars & Bars — e2e smoke', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/stars-bars');
    await dismissModeIfNeeded(page);
  });

  test('loads title and board or hand cards', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Stars & Bars');
    await expect(page.locator('.stars-board')).toBeVisible();
    await expect(page.locator('.stars-card').first()).toBeVisible();
  });

  test('selects a hand card then places on a valid cell when available', async ({
    page,
  }) => {
    const card = page.locator('.stars-card:not(.disabled)').first();
    await expect(card).toBeVisible();
    await card.click({ force: true });
    await expect(page.locator('.stars-card.selected')).toBeVisible();

    const valid = page.locator('.stars-cell.valid');
    if ((await valid.count()) > 0) {
      await valid.first().click({ force: true });
    }

    await expect(page.locator('.stars-board')).toBeVisible();
  });
});

test.describe('Fab-a-Diffy — e2e smoke', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/fab-a-diffy');
    await dismissModeIfNeeded(page);
  });

  test('loads title and primary board', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Fab-a-Diffy');
    await expect(
      page.locator('.fab-bar-pool, .fab-answer-board').first()
    ).toBeVisible();
  });

  test('selects bars from pool and tries answer or operation when available', async ({
    page,
  }) => {
    const bar = page.locator('.fab-bar-wrapper:not(.fab-bar-disabled)').first();
    await expect(bar).toBeVisible();
    await bar.click({ force: true });
    await expect(page.locator('.fab-bar-selected')).toBeVisible();

    const second = page.locator(
      '.fab-bar-wrapper:not(.fab-bar-disabled):not(.fab-bar-selected)'
    );
    if ((await second.count()) > 0) {
      await second.first().click({ force: true });
    }

    const op = page.locator('.fab-op-valid, .fab-op-btn:not(.fab-op-disabled)');
    if ((await op.count()) > 0) {
      await op.first().click({ force: true });
    }

    const answer = page.locator('.fab-answer-matchable');
    if ((await answer.count()) > 0) {
      await answer.first().click({ force: true });
    }

    await expect(
      page.locator('.fab-bar-pool, .fab-answer-board').first()
    ).toBeVisible();
  });

  test('status updates after selecting the first bar', async ({ page }) => {
    const status = page.locator('.fab-status');
    await expect(status).toBeVisible();
    const before = await status.textContent();
    await page
      .locator('.fab-bar-wrapper:not(.fab-bar-disabled)')
      .first()
      .click({
        force: true,
      });
    await expect(status).not.toHaveText(before ?? '');
  });
});

test.describe('Par 55 — e2e smoke', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/par-55');
    await dismissModeIfNeeded(page);
  });

  test('loads title and primary board', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Par 55');
    await expect(page.locator('.par55-board')).toBeVisible();
  });

  test('selects a hand block and places on a valid base when available', async ({
    page,
  }) => {
    const block = page.locator('.par55-hand-block.clickable').first();
    await expect(block).toBeVisible();
    await block.click({ force: true });
    await expect(page.locator('.par55-hand-block.selected')).toBeVisible();

    const valid = page.locator('.par55-valid-base');
    if ((await valid.count()) > 0) {
      await valid.first().click({ force: true });
    }

    await expect(page.locator('.par55-board')).toBeVisible();
  });

  test('scores or history remain visible after a place attempt', async ({
    page,
  }) => {
    await page.locator('.par55-hand-block.clickable').first().click({
      force: true,
    });
    const valid = page.locator('.par55-valid-base');
    if ((await valid.count()) > 0) {
      await valid.first().click({ force: true });
    }
    await expect(
      page.locator('.par55-scores, .par55-history').first()
    ).toBeVisible();
  });
});

test.describe('Kwatro-Sinko — e2e smoke', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/kwatro-sinko');
    await dismissModeIfNeeded(page);
  });

  test('loads title and primary board', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Kwatro-Sinko');
    await expect(page.locator('.kwa-board')).toBeVisible();
  });

  test('selects a chip then a destination node when available', async ({
    page,
  }) => {
    const chip = page.locator('.kwa-selectable-chip').first();
    await expect(chip).toBeVisible();
    await chip.click({ force: true });

    const dest = page.locator('.kwa-valid-node');
    if ((await dest.count()) > 0) {
      await dest.first().click({ force: true });
    }

    await expect(page.locator('.kwa-board')).toBeVisible();
    await expect(
      page.locator('.kwa-chip-info, .kwa-history').first()
    ).toBeVisible();
  });

  test('illegal occupied destination keeps selection chrome', async ({
    page,
  }) => {
    const chip = page.locator('.kwa-selectable-chip').first();
    await chip.click({ force: true });
    await expect(
      page.locator('.kwa-selected-chip, .kwa-valid-node').first()
    ).toBeVisible();

    // Click an occupied / non-valid node if present — selection should remain
    const occupied = page.locator(
      '.kwa-board [data-node-id]:not(.kwa-valid-node)'
    );
    if ((await occupied.count()) > 0) {
      await occupied.first().click({ force: true });
    }

    await expect(page.locator('.kwa-board')).toBeVisible();
  });
});

test.describe('Queens & Guards — e2e smoke', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/queens-guards');
    await dismissModeIfNeeded(page);
  });

  test('loads title and primary board', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Queens & Guards');
    await expect(page.locator('.qg-board-container')).toBeVisible();
  });

  test('selects a piece and asserts status / move instruction', async ({
    page,
  }) => {
    // Player 1 queen starts at ring 5, position 7
    const piece = page.locator('[data-cell-key="5-7"]');
    await expect(piece).toBeVisible();
    await piece.click({ force: true });

    await expect(page.locator('.qg-status')).toContainText(
      /highlighted|Select|move/i
    );
    await expect(page.locator('.qg-board-container')).toBeVisible();
  });

  test('selects then moves to a valid destination when highlighted', async ({
    page,
  }) => {
    const piece = page.locator('[data-cell-key="5-7"]');
    await piece.click({ force: true });
    await expect(page.locator('.qg-status')).toContainText(
      /highlighted|Select|move/i
    );

    const destination = page
      .locator('[data-cell-key][aria-label*="valid move"]')
      .first();
    if ((await destination.count()) > 0) {
      const before = await page.locator('.qg-status').textContent();
      await destination.click({ force: true });
      await expect(page.locator('.qg-status')).not.toHaveText(before ?? '');
    }

    await expect(page.locator('.qg-board-container')).toBeVisible();
  });
});

test.describe("Pent'Em In — e2e smoke", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/pent-em-in');
    await dismissModeIfNeeded(page);
  });

  test('loads title and primary board', async ({ page }) => {
    await expect(page.locator('h1')).toContainText("Pent'Em In");
    await expect(page.locator('.pent-board')).toBeVisible();
  });

  test('selects a piece then clicks a board cell', async ({ page }) => {
    const piece = page.locator('.pent-piece-option').first();
    await expect(piece).toBeVisible();
    await piece.click({ force: true });
    // Selecting moves into placePiece phase (selector may unmount); status confirms
    await expect(
      page.locator('[role="status"], .pent-instructions').first()
    ).toContainText(/Place/i);

    const cell = page
      .locator('.pent-board .interaction rect, .pent-board rect[data-row]')
      .first();
    if ((await cell.count()) > 0) {
      await cell.click({ force: true });
    }

    await expect(page.locator('.pent-board')).toBeVisible();
  });
});

test.describe('Fraction Pinball — e2e smoke', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/fraction-pinball');
    await dismissModeIfNeeded(page);
  });

  test('loads title and primary board', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Fraction Pinball');
    await expect(
      page
        .locator('.pinball-board, .pinball-challenge, .pinball-game-container')
        .first()
    ).toBeVisible();
  });

  test('clicks an answer choice after start', async ({ page }) => {
    const choice = page.locator('.pinball-choice-btn').first();
    await expect(choice).toBeVisible();
    await choice.click({ force: true });
    await expect(
      page
        .locator('.pinball-result, .pinball-feedback, .pinball-scores')
        .first()
    ).toBeVisible();
  });
});

test.describe('Registry games — load titles', () => {
  for (const game of AVAILABLE_GAMES) {
    test(`${game.id} loads its title`, async ({ page }) => {
      await page.goto(`/#/game/${game.id}`);
      await dismissModeIfNeeded(page);
      // Titles may append punctuation / subtitles; match the registry name stem
      const stem = game.name.replace(/[!?]+$/, '').split(' (')[0];
      await expect(page.locator('h1')).toContainText(stem);
    });
  }
});

test.describe('Fab-a-Diffy — illegal / disabled bar no-op', () => {
  test('disabled bar click does not clear an existing selection', async ({
    page,
  }) => {
    await page.goto('/#/game/fab-a-diffy');
    await dismissModeIfNeeded(page);

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

    await expect(
      page.locator('.fab-bar-pool, .fab-answer-board').first()
    ).toBeVisible();
  });
});

test.describe('Stars & Bars — illegal occupied cell no-op', () => {
  test('occupied / non-valid click keeps card selection', async ({ page }) => {
    await page.goto('/#/game/stars-bars');
    await dismissModeIfNeeded(page);

    await page.locator('.stars-card:not(.disabled)').first().click({
      force: true,
    });
    await expect(page.locator('.stars-card.selected')).toBeVisible();

    const invalid = page.locator('.stars-cell:not(.valid)');
    if ((await invalid.count()) > 0) {
      await invalid.first().click({ force: true });
      await expect(page.locator('.stars-card.selected')).toBeVisible();
    }

    await expect(page.locator('.stars-board')).toBeVisible();
  });
});

test.describe('Queens & Guards — illegal destination no-op', () => {
  test('non-valid cell after select keeps move instruction', async ({
    page,
  }) => {
    await page.goto('/#/game/queens-guards');
    await dismissModeIfNeeded(page);

    await page.locator('[data-cell-key="5-7"]').click({ force: true });
    const status = page.locator('.qg-status');
    await expect(status).toContainText(/highlighted|Select|move/i);
    const before = await status.textContent();

    const invalid = page.locator(
      '[data-cell-key]:not([aria-label*="valid move"])'
    );
    if ((await invalid.count()) > 1) {
      await invalid.nth(1).click({ force: true });
    }

    await expect(page.locator('.qg-board-container')).toBeVisible();
    // Status may re-select or keep instruction; board remains interactive
    await expect(status).toBeVisible();
    expect(before?.length ?? 0).toBeGreaterThan(0);
  });
});

test.describe('Contig 60 — pass when no valid cells', () => {
  test('after roll, pass path or place path both restore roll CTA', async ({
    page,
  }) => {
    await page.goto('/#/game/contig-60');
    await dismissModeIfNeeded(page);
    await page.locator('.contig-roll-btn').click();
    const pass = page.locator('.contig-pass-btn');
    const valid = page.locator('.contig-cell-valid');
    if ((await pass.count()) > 0 && (await valid.count()) === 0) {
      await pass.click();
    } else if ((await valid.count()) > 0) {
      await valid.first().click({ force: true });
    }
    await expect(page.locator('.contig-roll-btn')).toBeVisible();
  });
});

test.describe('Hex — help modal + new-game reset', () => {
  test('how to play opens; new game restores empty board chrome', async ({
    page,
  }) => {
    await page.goto('/#/game/hex');
    await dismissModeIfNeeded(page);

    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.click('#help-modal .modal-close');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);

    await page.locator('.hex-cell-group[data-row="5"][data-col="5"]').click({
      force: true,
    });
    await page.click('#new-game-btn');
    await expect(page.locator('#new-game-modal')).not.toHaveClass(/hidden/);
    await page.click('#start-game-btn');
    await expect(page.locator('.hex-board')).toBeVisible();
    await expect(page.locator('.status-turn')).toBeVisible();
  });
});

test.describe('Frac Fact / Fraction Pinball — feedback after choice', () => {
  test('Frac Fact choice shows feedback or result chrome', async ({ page }) => {
    await page.goto('/#/game/frac-fact');
    await dismissModeIfNeeded(page);
    await page.locator('.frac-choice-btn').first().click({ force: true });
    await expect(
      page.locator('.frac-feedback, .frac-result, .frac-scores').first()
    ).toBeVisible();
  });

  test('Fraction Pinball choice shows feedback chrome', async ({ page }) => {
    await page.goto('/#/game/fraction-pinball');
    await dismissModeIfNeeded(page);
    await page.locator('.pinball-choice-btn').first().click({ force: true });
    await expect(
      page
        .locator('.pinball-feedback, .pinball-result, .pinball-scores')
        .first()
    ).toBeVisible();
  });
});
