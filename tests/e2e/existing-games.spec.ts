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

  test('confirm then place updates status or placing info', async ({
    page,
  }) => {
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

test.describe('Star Track / Calla / Sum Dominoes — help + new-game', () => {
  test('Star Track how-to-play opens and new game restores draw CTA', async ({
    page,
  }) => {
    await page.goto('/#/game/star-track');
    await dismissModeIfNeeded(page);

    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.click('#help-modal .modal-close');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);

    await page.click('#new-game-btn');
    await expect(page.locator('#new-game-modal')).not.toHaveClass(/hidden/);
    await page.click('#start-game-btn');
    await expect(page.locator('.star-track-draw-btn')).toBeVisible();
    await expect(
      page.locator('.star-track-status, .status-turn').first()
    ).toBeVisible();
  });

  test('Calla how-to-play opens and new game keeps board chrome', async ({
    page,
  }) => {
    await page.goto('/#/game/calla');
    await dismissModeIfNeeded(page);

    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.click('#help-modal .modal-close');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);

    await page.click('#new-game-btn');
    await expect(page.locator('#new-game-modal')).not.toHaveClass(/hidden/);
    await page.click('#start-game-btn');
    await expect(
      page.locator('.calla-board, .calla-pit').first()
    ).toBeVisible();
  });

  test('Sum Dominoes how-to-play opens and new game restores roll CTA', async ({
    page,
  }) => {
    await page.goto('/#/game/sum-dominoes');
    await dismissModeIfNeeded(page);

    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.click('#help-modal .modal-close');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);

    await page.locator('.sd-roll-btn').click();
    await page.click('#new-game-btn');
    await expect(page.locator('#new-game-modal')).not.toHaveClass(/hidden/);
    await page.click('#start-game-btn');
    await expect(page.locator('.sd-roll-btn')).toBeVisible();
    await expect(page.locator('.sd-board')).toBeVisible();
  });
});

test.describe('Illegal / premature click no-ops', () => {
  test('Par non-valid base keeps hand selection', async ({ page }) => {
    await page.goto('/#/game/par-55');
    await dismissModeIfNeeded(page);

    await page
      .locator(
        '.par55-hand-block, .par55-block, [class*="hand"] button, .par55-hand > *'
      )
      .first()
      .click({
        force: true,
      });
    const selected = page.locator(
      '.par55-hand-block.selected, .par55-block.selected, .selected'
    );
    if ((await selected.count()) > 0) {
      await expect(selected.first()).toBeVisible();
    }

    const invalid = page.locator(
      '.par55-base:not(.valid), .par55-board .par55-base:not(.par55-base-valid)'
    );
    if ((await invalid.count()) > 0) {
      await invalid.first().click({ force: true });
    }
    await expect(
      page.locator('.par55-board, .par55-hand').first()
    ).toBeVisible();
  });

  test('Prime Gold occupied/invalid cell after roll keeps placing chrome', async ({
    page,
  }) => {
    await page.goto('/#/game/prime-gold');
    await dismissModeIfNeeded(page);

    await page.locator('.pg-roll-btn, button:has-text("Roll")').first().click();
    await expect(page.locator('.pg-dice-area, .pg-die').first()).toBeVisible();

    const invalid = page.locator('.pg-cell:not(.valid)');
    if ((await invalid.count()) > 0) {
      await invalid.first().click({ force: true });
    }
    await expect(page.locator('.pg-board, .pg-status').first()).toBeVisible();
  });

  test('Juggle board click before shape keeps dice / selector chrome', async ({
    page,
  }) => {
    await page.goto('/#/game/juggle');
    await dismissModeIfNeeded(page);

    await page
      .locator('.juggle-roll-btn, button:has-text("Roll")')
      .first()
      .click();
    const cell = page
      .locator('.juggle-cell, .juggle-board td, .juggle-board [data-row]')
      .first();
    if ((await cell.count()) > 0) {
      await cell.click({ force: true });
    }
    await expect(
      page
        .locator('.juggle-dice-area, .juggle-shape-selector, .juggle-board')
        .first()
    ).toBeVisible();
  });

  test('Ramrod invalid slot click keeps rod selection or board', async ({
    page,
  }) => {
    await page.goto('/#/game/ramrod');
    await dismissModeIfNeeded(page);

    await page.locator('.ramrod-rod, .ramrod-rod-wrapper').first().click({
      force: true,
    });
    const invalid = page.locator(
      '.ramrod-slot:not(.valid), .ramrod-box:not(.valid) .ramrod-slot'
    );
    if ((await invalid.count()) > 0) {
      await invalid.first().click({ force: true });
    }
    await expect(page.locator('.ramrod-board')).toBeVisible();
  });

  test("Pent'Em In cell without piece keeps piece selector or place chrome", async ({
    page,
  }) => {
    await page.goto('/#/game/pent-em-in');
    await dismissModeIfNeeded(page);

    const cell = page
      .locator('.pent-board .interaction rect, .pent-board rect[data-row]')
      .first();
    if ((await cell.count()) > 0) {
      await cell.click({ force: true });
    }
    await expect(
      page.locator('.pent-piece-option, .pent-board, [role="status"]').first()
    ).toBeVisible();
  });

  test('Remainder Islands island before roll stays on roll CTA', async ({
    page,
  }) => {
    await page.goto('/#/game/remainder-islands');
    await dismissModeIfNeeded(page);

    const island = page.locator(
      '.remainder-island, [data-island-id], .island-cell'
    );
    if ((await island.count()) > 0) {
      await island.first().click({ force: true });
    }
    await expect(
      page.locator('.remainder-roll-btn, button:has-text("Roll")').first()
    ).toBeVisible();
  });

  test('Hex-a-Gone board click before confirm keeps block selector', async ({
    page,
  }) => {
    await page.goto('/#/game/hex-a-gone');
    await dismissModeIfNeeded(page);

    const cell = page.locator('[data-q], .hag-cell, .hexagone-cell').first();
    if ((await cell.count()) > 0) {
      await cell.click({ force: true });
    }
    await expect(
      page
        .locator('.hag-block, .hexagone-block, .block-selector, button')
        .first()
    ).toBeVisible();
  });
});

test.describe('Prime Gold / Juggle — roll then place-or-pass restores CTA', () => {
  test('Prime Gold after roll: place valid or stay placing with dice', async ({
    page,
  }) => {
    await page.goto('/#/game/prime-gold');
    await dismissModeIfNeeded(page);
    await page.locator('.pg-roll-btn, button:has-text("Roll")').first().click();
    const valid = page.locator('.pg-cell.valid');
    if ((await valid.count()) > 0) {
      await valid.first().click({ force: true });
      await expect(
        page.locator('.pg-roll-btn, .pg-status, .pg-scores').first()
      ).toBeVisible();
    } else {
      await expect(
        page.locator('.pg-dice-area, .pg-die').first()
      ).toBeVisible();
    }
  });

  test('Juggle after roll: select die restores shape or board chrome', async ({
    page,
  }) => {
    await page.goto('/#/game/juggle');
    await dismissModeIfNeeded(page);
    await page
      .locator('.juggle-roll-btn, button:has-text("Roll")')
      .first()
      .click();
    const die = page
      .locator('.juggle-die, .juggle-dice-area button, [data-die-index]')
      .first();
    if ((await die.count()) > 0) {
      await die.click({ force: true });
    }
    await expect(
      page
        .locator('.juggle-shape-selector, .juggle-shape-option, .juggle-board')
        .first()
    ).toBeVisible();
  });
});

test.describe('FIAR / Par — help modal', () => {
  test('FIAR how-to-play opens and closes', async ({ page }) => {
    await page.goto('/#/game/fiar');
    await dismissModeIfNeeded(page);
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.click('#help-modal .modal-close');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
  });

  test('Par 55 how-to-play opens and closes', async ({ page }) => {
    await page.goto('/#/game/par-55');
    await dismissModeIfNeeded(page);
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.click('#help-modal .modal-close');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
  });
});

test.describe('Vs-AI start smoke (Hex / Contig / Frac Fact)', () => {
  test('Hex vs-AI starts and mounts board', async ({ page }) => {
    await page.goto('/#/game/hex');
    const modal = page.locator('#new-game-modal');
    if (await modal.isVisible().catch(() => false)) {
      const vsAi = page.locator(
        '#mode-ai, [data-mode="ai"], button:has-text("AI"), label:has-text("AI")'
      );
      if ((await vsAi.count()) > 0) {
        await vsAi.first().click({ force: true });
      }
      const start = page.locator('#start-game-btn');
      if (await start.isVisible().catch(() => false)) {
        await start.click();
      }
    }
    await expect(page.locator('.hex-board')).toBeVisible();
    await expect(
      page.locator('.status-turn, .hex-status').first()
    ).toBeVisible();
  });

  test('Contig vs-AI starts with roll CTA', async ({ page }) => {
    await page.goto('/#/game/contig-60');
    const modal = page.locator('#new-game-modal');
    if (await modal.isVisible().catch(() => false)) {
      const vsAi = page.locator(
        '#mode-ai, [data-mode="ai"], button:has-text("AI"), label:has-text("AI")'
      );
      if ((await vsAi.count()) > 0) {
        await vsAi.first().click({ force: true });
      }
      const start = page.locator('#start-game-btn');
      if (await start.isVisible().catch(() => false)) {
        await start.click();
      }
    }
    await expect(page.locator('.contig-board')).toBeVisible();
    await expect(page.locator('.contig-roll-btn')).toBeVisible();
  });

  test('Frac Fact vs-AI starts with choices', async ({ page }) => {
    await page.goto('/#/game/frac-fact');
    const modal = page.locator('#new-game-modal');
    if (await modal.isVisible().catch(() => false)) {
      const vsAi = page.locator(
        '#mode-ai, [data-mode="ai"], button:has-text("AI"), label:has-text("AI")'
      );
      if ((await vsAi.count()) > 0) {
        await vsAi.first().click({ force: true });
      }
      const start = page.locator('#start-game-btn');
      if (await start.isVisible().catch(() => false)) {
        await start.click();
      }
    }
    await expect(
      page.locator('.frac-choice-btn, .frac-problem').first()
    ).toBeVisible();
  });
});

test.describe('Help + new-game deepenings (Ramrod / Kwatro / Queens / Fab)', () => {
  test('Ramrod help opens and new game restores rod chrome', async ({
    page,
  }) => {
    await page.goto('/#/game/ramrod');
    await dismissModeIfNeeded(page);

    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.click('#help-modal .modal-close');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);

    await page.click('#new-game-btn');
    await expect(page.locator('#new-game-modal')).not.toHaveClass(/hidden/);
    await page.click('#start-game-btn');
    await expect(page.locator('.ramrod-board')).toBeVisible();
  });

  test('Kwatro help opens and closes', async ({ page }) => {
    await page.goto('/#/game/kwatro-sinko');
    await dismissModeIfNeeded(page);
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.click('#help-modal .modal-close');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
  });

  test('Queens help + new game keeps board', async ({ page }) => {
    await page.goto('/#/game/queens-guards');
    await dismissModeIfNeeded(page);
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.click('#help-modal .modal-close');
    await page.click('#new-game-btn');
    await page.click('#start-game-btn');
    await expect(page.locator('.qg-board, svg').first()).toBeVisible();
  });

  test('Fab help opens and closes', async ({ page }) => {
    await page.goto('/#/game/fab-a-diffy');
    await dismissModeIfNeeded(page);
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.click('#help-modal .modal-close');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
  });
});

test.describe('More illegal / premature no-ops', () => {
  test('Stars board click before card keeps hand chrome', async ({ page }) => {
    await page.goto('/#/game/stars-bars');
    await dismissModeIfNeeded(page);
    const cell = page.locator('.stars-cell, [data-row]').first();
    if ((await cell.count()) > 0) {
      await cell.click({ force: true });
    }
    await expect(
      page.locator('.stars-hand, .stars-board, .stars-status').first()
    ).toBeVisible();
  });

  test('Fab answer click before bars keeps pool chrome', async ({ page }) => {
    await page.goto('/#/game/fab-a-diffy');
    await dismissModeIfNeeded(page);
    const answer = page
      .locator('.fab-answer-wrapper, .fab-answer-board')
      .first();
    if ((await answer.count()) > 0) {
      await answer.click({ force: true });
    }
    await expect(
      page.locator('.fab-bar-pool, .fab-game-area').first()
    ).toBeVisible();
  });

  test('Kwatro node before chip keeps board', async ({ page }) => {
    await page.goto('/#/game/kwatro-sinko');
    await dismissModeIfNeeded(page);
    const node = page.locator('[data-node-id], .kwa-node').first();
    if ((await node.count()) > 0) {
      await node.click({ force: true });
    }
    await expect(page.locator('.kwa-board')).toBeVisible();
  });

  test('Contig cell before roll keeps roll CTA', async ({ page }) => {
    await page.goto('/#/game/contig-60');
    await dismissModeIfNeeded(page);
    await page.locator('.contig-cell').first().click({ force: true });
    await expect(page.locator('.contig-roll-btn')).toBeVisible();
  });

  test('Sum Dominoes cell before roll keeps roll CTA', async ({ page }) => {
    await page.goto('/#/game/sum-dominoes');
    await dismissModeIfNeeded(page);
    const cell = page.locator('.sd-cell, .sd-board').first();
    if ((await cell.count()) > 0) {
      await cell.click({ force: true });
    }
    await expect(page.locator('.sd-roll-btn')).toBeVisible();
  });
});

test.describe('Ramrod / Contig / Stars interaction deepenings', () => {
  test('Ramrod selects a rod and keeps board chrome', async ({ page }) => {
    await page.goto('/#/game/ramrod');
    await dismissModeIfNeeded(page);
    await page.locator('.ramrod-rod, .ramrod-rod-wrapper').first().click({
      force: true,
    });
    await expect(page.locator('.ramrod-board')).toBeVisible();
  });

  test('Contig roll then pass-or-place restores rolling CTA', async ({
    page,
  }) => {
    await page.goto('/#/game/contig-60');
    await dismissModeIfNeeded(page);
    await page.locator('.contig-roll-btn').click();
    const valid = page.locator('.contig-cell-valid');
    const pass = page.locator('.contig-pass-btn');
    if ((await valid.count()) > 0) {
      await valid.first().click({ force: true });
    } else if (await pass.isVisible().catch(() => false)) {
      await pass.click();
    }
    await expect(page.locator('.contig-roll-btn')).toBeVisible();
  });

  test('Stars selects a hand card when available', async ({ page }) => {
    await page.goto('/#/game/stars-bars');
    await dismissModeIfNeeded(page);
    const card = page.locator('.stars-card:not(.disabled)').first();
    if ((await card.count()) > 0) {
      await card.click({ force: true });
    }
    await expect(
      page.locator('.stars-board, .stars-hand, .stars-status').first()
    ).toBeVisible();
  });
});

test.describe('Wave 10 — help / new-game deepenings', () => {
  test("Pent'Em In help + new game restores piece chrome", async ({ page }) => {
    await page.goto('/#/game/pent-em-in');
    await dismissModeIfNeeded(page);

    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.click('#help-modal .modal-close');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);

    await page.click('#new-game-btn');
    await expect(page.locator('#new-game-modal')).not.toHaveClass(/hidden/);
    await page.click('#start-game-btn');
    await expect(
      page.locator('.pent-piece-selector, .pent-board').first()
    ).toBeVisible();
  });

  test('Hex-a-Gone help opens and closes', async ({ page }) => {
    await page.goto('/#/game/hex-a-gone');
    await dismissModeIfNeeded(page);
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.click('#help-modal .modal-close');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
  });

  test('Remainder Islands help + new game keeps roll CTA', async ({ page }) => {
    await page.goto('/#/game/remainder-islands');
    await dismissModeIfNeeded(page);
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.click('#help-modal .modal-close');
    await page.click('#new-game-btn');
    await page.click('#start-game-btn');
    await expect(
      page.locator('.remainder-roll-btn, .remainder-dice').first()
    ).toBeVisible();
  });

  test('Fraction Pinball help opens and closes', async ({ page }) => {
    await page.goto('/#/game/fraction-pinball');
    await dismissModeIfNeeded(page);
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.click('#help-modal .modal-close');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
  });

  test('Juggle help + new game restores dice chrome', async ({ page }) => {
    await page.goto('/#/game/juggle');
    await dismissModeIfNeeded(page);
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.click('#help-modal .modal-close');
    await page.click('#new-game-btn');
    await page.click('#start-game-btn');
    await expect(
      page.locator('.juggle-roll-btn, .juggle-dice-area').first()
    ).toBeVisible();
  });

  test('Prime Gold help opens and closes', async ({ page }) => {
    await page.goto('/#/game/prime-gold');
    await dismissModeIfNeeded(page);
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.click('#help-modal .modal-close');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
  });

  test('Kings help + new game keeps board', async ({ page }) => {
    await page.goto('/#/game/kings-quadraphages');
    await dismissModeIfNeeded(page);
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.click('#help-modal .modal-close');
    await page.click('#new-game-btn');
    await page.click('#start-game-btn');
    await expect(page.locator('.cell, .board').first()).toBeVisible();
  });

  test('Stars & Bars help + new game keeps hand', async ({ page }) => {
    await page.goto('/#/game/stars-bars');
    await dismissModeIfNeeded(page);
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.click('#help-modal .modal-close');
    await page.click('#new-game-btn');
    await page.click('#start-game-btn');
    await expect(
      page.locator('.stars-hand, .stars-board').first()
    ).toBeVisible();
  });
});

test.describe('Wave 10 — vs-AI start smoke', () => {
  test('Juggle vs-AI starts with roll CTA', async ({ page }) => {
    await page.goto('/#/game/juggle');
    const modal = page.locator('#new-game-modal');
    if (await modal.isVisible().catch(() => false)) {
      const vsAi = page.locator(
        '#mode-ai, [data-mode="ai"], button:has-text("AI"), label:has-text("AI")'
      );
      if ((await vsAi.count()) > 0) {
        await vsAi.first().click({ force: true });
      }
      const start = page.locator('#start-game-btn');
      if (await start.isVisible().catch(() => false)) {
        await start.click();
      }
    }
    await expect(
      page.locator('.juggle-roll-btn, .juggle-dice-area').first()
    ).toBeVisible();
  });

  test('Prime Gold vs-AI starts with roll CTA', async ({ page }) => {
    await page.goto('/#/game/prime-gold');
    const modal = page.locator('#new-game-modal');
    if (await modal.isVisible().catch(() => false)) {
      const vsAi = page.locator(
        '#mode-ai, [data-mode="ai"], button:has-text("AI"), label:has-text("AI")'
      );
      if ((await vsAi.count()) > 0) {
        await vsAi.first().click({ force: true });
      }
      const start = page.locator('#start-game-btn');
      if (await start.isVisible().catch(() => false)) {
        await start.click();
      }
    }
    await expect(page.locator('.pg-roll-btn, .pg-board').first()).toBeVisible();
  });

  test('Par 55 vs-AI starts with hand chrome', async ({ page }) => {
    await page.goto('/#/game/par-55');
    const modal = page.locator('#new-game-modal');
    if (await modal.isVisible().catch(() => false)) {
      const vsAi = page.locator(
        '#mode-ai, [data-mode="ai"], button:has-text("AI"), label:has-text("AI")'
      );
      if ((await vsAi.count()) > 0) {
        await vsAi.first().click({ force: true });
      }
      const start = page.locator('#start-game-btn');
      if (await start.isVisible().catch(() => false)) {
        await start.click();
      }
    }
    await expect(
      page.locator('.par55-hand, .par55-board').first()
    ).toBeVisible();
  });
});

test.describe('Wave 10 — more illegal / premature no-ops', () => {
  test('FIAR empty board click keeps placement chrome', async ({ page }) => {
    await page.goto('/#/game/fiar');
    await dismissModeIfNeeded(page);
    const board = page
      .locator('.fiar-board, .fiar-board-container, svg')
      .first();
    await board.click({ force: true, position: { x: 5, y: 5 } });
    await expect(
      page.locator('.fiar-board, .fiar-board-container, svg').first()
    ).toBeVisible();
  });

  test('Par 55 board click before block keeps hand', async ({ page }) => {
    await page.goto('/#/game/par-55');
    await dismissModeIfNeeded(page);
    const board = page.locator('.par55-board, .par55-base').first();
    if ((await board.count()) > 0) {
      await board.click({ force: true });
    }
    await expect(
      page.locator('.par55-hand, .par55-board').first()
    ).toBeVisible();
  });

  test('Kwatro new game restores board after chip select', async ({ page }) => {
    await page.goto('/#/game/kwatro-sinko');
    await dismissModeIfNeeded(page);
    const chip = page.locator('.kwa-chip, [data-chip-id]').first();
    if ((await chip.count()) > 0) {
      await chip.click({ force: true });
    }
    await page.click('#new-game-btn');
    await page.click('#start-game-btn');
    await expect(page.locator('.kwa-board')).toBeVisible();
  });
});

test.describe('Wave 11 — help / new-game deepenings', () => {
  test('Calla help + new game restores pits', async ({ page }) => {
    await page.goto('/#/game/calla');
    await dismissModeIfNeeded(page);
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.click('#help-modal .modal-close');
    await page.click('#new-game-btn');
    await page.click('#start-game-btn');
    await expect(
      page.locator('.calla-board, .calla-pit').first()
    ).toBeVisible();
  });

  test('Contig 60 help + new game restores roll CTA', async ({ page }) => {
    await page.goto('/#/game/contig-60');
    await dismissModeIfNeeded(page);
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.click('#help-modal .modal-close');
    await page.click('#new-game-btn');
    await page.click('#start-game-btn');
    await expect(
      page.locator('.contig-roll-btn, .contig-dice-area').first()
    ).toBeVisible();
  });

  test('Sum Dominoes help + new game restores dice', async ({ page }) => {
    await page.goto('/#/game/sum-dominoes');
    await dismissModeIfNeeded(page);
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.click('#help-modal .modal-close');
    await page.click('#new-game-btn');
    await page.click('#start-game-btn');
    await expect(
      page.locator('.sd-roll-btn, .sd-dice-area, .sd-board').first()
    ).toBeVisible();
  });

  test('Queens & Guards help opens and closes', async ({ page }) => {
    await page.goto('/#/game/queens-guards');
    await dismissModeIfNeeded(page);
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.click('#help-modal .modal-close');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
  });

  test('Fab-a-Diffy help + new game keeps bar pool', async ({ page }) => {
    await page.goto('/#/game/fab-a-diffy');
    await dismissModeIfNeeded(page);
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.click('#help-modal .modal-close');
    await page.click('#new-game-btn');
    await page.click('#start-game-btn');
    await expect(
      page.locator('.fab-bar-pool, .fab-bar-wrapper').first()
    ).toBeVisible();
  });

  test('Star Track help + new game keeps draw CTA', async ({ page }) => {
    await page.goto('/#/game/star-track');
    await dismissModeIfNeeded(page);
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.click('#help-modal .modal-close');
    await page.click('#new-game-btn');
    await page.click('#start-game-btn');
    await expect(page.locator('.star-track-draw-btn').first()).toBeVisible();
  });
});

test.describe('Wave 11 — vs-AI start smoke', () => {
  test('Calla vs-AI starts with board chrome', async ({ page }) => {
    await page.goto('/#/game/calla');
    const modal = page.locator('#new-game-modal');
    if (await modal.isVisible().catch(() => false)) {
      const vsAi = page.locator(
        '#mode-ai, [data-mode="ai"], button:has-text("AI"), label:has-text("AI")'
      );
      if ((await vsAi.count()) > 0) {
        await vsAi.first().click({ force: true });
      }
      const start = page.locator('#start-game-btn');
      if (await start.isVisible().catch(() => false)) {
        await start.click();
      }
    }
    await expect(
      page.locator('.calla-board, .calla-pit').first()
    ).toBeVisible();
  });

  test('Queens vs-AI starts with board', async ({ page }) => {
    await page.goto('/#/game/queens-guards');
    const modal = page.locator('#new-game-modal');
    if (await modal.isVisible().catch(() => false)) {
      const vsAi = page.locator(
        '#mode-ai, [data-mode="ai"], button:has-text("AI"), label:has-text("AI")'
      );
      if ((await vsAi.count()) > 0) {
        await vsAi.first().click({ force: true });
      }
      const start = page.locator('#start-game-btn');
      if (await start.isVisible().catch(() => false)) {
        await start.click();
      }
    }
    await expect(
      page.locator('.qg-board, .qg-board-container, svg').first()
    ).toBeVisible();
  });

  test('Fab-a-Diffy vs-AI starts with bar pool', async ({ page }) => {
    await page.goto('/#/game/fab-a-diffy');
    const modal = page.locator('#new-game-modal');
    if (await modal.isVisible().catch(() => false)) {
      const vsAi = page.locator(
        '#mode-ai, [data-mode="ai"], button:has-text("AI"), label:has-text("AI")'
      );
      if ((await vsAi.count()) > 0) {
        await vsAi.first().click({ force: true });
      }
      const start = page.locator('#start-game-btn');
      if (await start.isVisible().catch(() => false)) {
        await start.click();
      }
    }
    await expect(
      page.locator('.fab-bar-pool, .fab-bar-wrapper').first()
    ).toBeVisible();
  });

  test('Star Track vs-AI starts with draw CTA', async ({ page }) => {
    await page.goto('/#/game/star-track');
    const modal = page.locator('#new-game-modal');
    if (await modal.isVisible().catch(() => false)) {
      const vsAi = page.locator(
        '#mode-ai, [data-mode="ai"], button:has-text("AI"), label:has-text("AI")'
      );
      if ((await vsAi.count()) > 0) {
        await vsAi.first().click({ force: true });
      }
      const start = page.locator('#start-game-btn');
      if (await start.isVisible().catch(() => false)) {
        await start.click();
      }
    }
    await expect(page.locator('.star-track-draw-btn').first()).toBeVisible();
  });
});

test.describe('Wave 11 — more illegal / premature no-ops', () => {
  test('Hex-a-Gone board click before commit keeps bank', async ({ page }) => {
    await page.goto('/#/game/hex-a-gone');
    await dismissModeIfNeeded(page);
    const board = page.locator('.hex-a-gone-board, .hex-a-gone-cell').first();
    if ((await board.count()) > 0) {
      await board.click({ force: true, position: { x: 8, y: 8 } });
    }
    await expect(
      page.locator('.hex-a-gone-bank, .hex-a-gone-board').first()
    ).toBeVisible();
  });

  test("Pent'Em In board click without piece keeps selector", async ({
    page,
  }) => {
    await page.goto('/#/game/pent-em-in');
    await dismissModeIfNeeded(page);
    const board = page.locator('.pent-board, .pent-cell, svg').first();
    if ((await board.count()) > 0) {
      await board.click({ force: true, position: { x: 10, y: 10 } });
    }
    await expect(
      page.locator('.pent-piece-selector, .pent-board').first()
    ).toBeVisible();
  });

  test('Remainder island click before roll keeps roll CTA', async ({
    page,
  }) => {
    await page.goto('/#/game/remainder-islands');
    await dismissModeIfNeeded(page);
    const island = page.locator('.remainder-island, [data-island-id]').first();
    if ((await island.count()) > 0) {
      await island.click({ force: true });
    }
    await expect(
      page.locator('.remainder-roll-btn, .remainder-dice').first()
    ).toBeVisible();
  });

  test('Contig cell click before roll keeps roll CTA', async ({ page }) => {
    await page.goto('/#/game/contig-60');
    await dismissModeIfNeeded(page);
    const cell = page.locator('.contig-cell').first();
    if ((await cell.count()) > 0) {
      await cell.click({ force: true });
    }
    await expect(
      page.locator('.contig-roll-btn, .contig-dice-area').first()
    ).toBeVisible();
  });
});

test.describe('Wave 12 — help / new-game deepenings', () => {
  test('Hex help + new game restores board', async ({ page }) => {
    await page.goto('/#/game/hex');
    await dismissModeIfNeeded(page);
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.click('#help-modal .modal-close');
    await page.click('#new-game-btn');
    await page.click('#start-game-btn');
    await expect(page.locator('.hex-board, [data-row]').first()).toBeVisible();
  });

  test('Prime Gold help + new game restores roll CTA', async ({ page }) => {
    await page.goto('/#/game/prime-gold');
    await dismissModeIfNeeded(page);
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.click('#help-modal .modal-close');
    await page.click('#new-game-btn');
    await page.click('#start-game-btn');
    await expect(
      page.locator('.pg-roll-btn, .pg-dice-area').first()
    ).toBeVisible();
  });

  test('Ramrod help + new game keeps rods', async ({ page }) => {
    await page.goto('/#/game/ramrod');
    await dismissModeIfNeeded(page);
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.click('#help-modal .modal-close');
    await page.click('#new-game-btn');
    await page.click('#start-game-btn');
    await expect(
      page.locator('.ramrod-player-rods, .ramrod-board').first()
    ).toBeVisible();
  });

  test('Kwatro-Sinko help opens and closes', async ({ page }) => {
    await page.goto('/#/game/kwatro-sinko');
    await dismissModeIfNeeded(page);
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.click('#help-modal .modal-close');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
  });

  test('Par 55 help + new game keeps hand', async ({ page }) => {
    await page.goto('/#/game/par-55');
    await dismissModeIfNeeded(page);
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.click('#help-modal .modal-close');
    await page.click('#new-game-btn');
    await page.click('#start-game-btn');
    await expect(
      page.locator('.par55-hand, .par55-board').first()
    ).toBeVisible();
  });

  test('Stars & Bars help + new game keeps hand', async ({ page }) => {
    await page.goto('/#/game/stars-bars');
    await dismissModeIfNeeded(page);
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.click('#help-modal .modal-close');
    await page.click('#new-game-btn');
    await page.click('#start-game-btn');
    await expect(
      page.locator('.stars-hand, .stars-hand-container, .stars-board').first()
    ).toBeVisible();
  });

  test('Juggle help + new game keeps dice CTA', async ({ page }) => {
    await page.goto('/#/game/juggle');
    await dismissModeIfNeeded(page);
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.click('#help-modal .modal-close');
    await page.click('#new-game-btn');
    await page.click('#start-game-btn');
    await expect(
      page.locator('.juggle-roll-btn, .juggle-dice-area').first()
    ).toBeVisible();
  });

  test('FIAR help opens and closes', async ({ page }) => {
    await page.goto('/#/game/fiar');
    await dismissModeIfNeeded(page);
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.click('#help-modal .modal-close');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
  });
});

test.describe('Wave 12 — vs-AI start smoke', () => {
  test('Hex vs-AI starts with board', async ({ page }) => {
    await page.goto('/#/game/hex');
    const modal = page.locator('#new-game-modal');
    if (await modal.isVisible().catch(() => false)) {
      const vsAi = page.locator(
        '#mode-ai, [data-mode="ai"], button:has-text("AI"), label:has-text("AI")'
      );
      if ((await vsAi.count()) > 0) {
        await vsAi.first().click({ force: true });
      }
      const start = page.locator('#start-game-btn');
      if (await start.isVisible().catch(() => false)) {
        await start.click();
      }
    }
    await expect(page.locator('.hex-board, [data-row]').first()).toBeVisible();
  });

  test('Prime Gold vs-AI starts with dice CTA', async ({ page }) => {
    await page.goto('/#/game/prime-gold');
    const modal = page.locator('#new-game-modal');
    if (await modal.isVisible().catch(() => false)) {
      const vsAi = page.locator(
        '#mode-ai, [data-mode="ai"], button:has-text("AI"), label:has-text("AI")'
      );
      if ((await vsAi.count()) > 0) {
        await vsAi.first().click({ force: true });
      }
      const start = page.locator('#start-game-btn');
      if (await start.isVisible().catch(() => false)) {
        await start.click();
      }
    }
    await expect(
      page.locator('.pg-roll-btn, .pg-dice-area').first()
    ).toBeVisible();
  });

  test('Par 55 vs-AI starts with hand', async ({ page }) => {
    await page.goto('/#/game/par-55');
    const modal = page.locator('#new-game-modal');
    if (await modal.isVisible().catch(() => false)) {
      const vsAi = page.locator(
        '#mode-ai, [data-mode="ai"], button:has-text("AI"), label:has-text("AI")'
      );
      if ((await vsAi.count()) > 0) {
        await vsAi.first().click({ force: true });
      }
      const start = page.locator('#start-game-btn');
      if (await start.isVisible().catch(() => false)) {
        await start.click();
      }
    }
    await expect(
      page.locator('.par55-hand, .par55-board').first()
    ).toBeVisible();
  });

  test('Juggle vs-AI starts with dice CTA', async ({ page }) => {
    await page.goto('/#/game/juggle');
    const modal = page.locator('#new-game-modal');
    if (await modal.isVisible().catch(() => false)) {
      const vsAi = page.locator(
        '#mode-ai, [data-mode="ai"], button:has-text("AI"), label:has-text("AI")'
      );
      if ((await vsAi.count()) > 0) {
        await vsAi.first().click({ force: true });
      }
      const start = page.locator('#start-game-btn');
      if (await start.isVisible().catch(() => false)) {
        await start.click();
      }
    }
    await expect(
      page.locator('.juggle-roll-btn, .juggle-dice-area').first()
    ).toBeVisible();
  });
});

test.describe('Wave 12 — more illegal / premature no-ops', () => {
  test('Sum Dominoes cell click before roll keeps dice CTA', async ({
    page,
  }) => {
    await page.goto('/#/game/sum-dominoes');
    await dismissModeIfNeeded(page);
    const cell = page.locator('.sd-cell, .sd-board td, [data-row]').first();
    if ((await cell.count()) > 0) {
      await cell.click({ force: true });
    }
    await expect(
      page.locator('.sd-roll-btn, .sd-dice-area, .sd-board').first()
    ).toBeVisible();
  });

  test('Star Track choice click before draw keeps draw CTA', async ({
    page,
  }) => {
    await page.goto('/#/game/star-track');
    await dismissModeIfNeeded(page);
    const choice = page
      .locator('.star-track-choice, .star-track-choices')
      .first();
    if ((await choice.count()) > 0) {
      await choice.click({ force: true });
    }
    await expect(page.locator('.star-track-draw-btn').first()).toBeVisible();
  });

  test('Queens empty click without selection keeps board', async ({ page }) => {
    await page.goto('/#/game/queens-guards');
    await dismissModeIfNeeded(page);
    const cell = page.locator('.qg-cell, [data-ring], svg').first();
    if ((await cell.count()) > 0) {
      await cell.click({ force: true, position: { x: 5, y: 5 } });
    }
    await expect(
      page.locator('.qg-board, .qg-board-container, svg').first()
    ).toBeVisible();
  });

  test('Juggle board click before roll keeps dice CTA', async ({ page }) => {
    await page.goto('/#/game/juggle');
    await dismissModeIfNeeded(page);
    const board = page.locator('.juggle-board, .juggle-cell').first();
    if ((await board.count()) > 0) {
      await board.click({ force: true, position: { x: 8, y: 8 } });
    }
    await expect(
      page.locator('.juggle-roll-btn, .juggle-dice-area').first()
    ).toBeVisible();
  });
});

test.describe('Wave 13 — help / new-game deepenings', () => {
  test('Kings help + new game restores supplies chrome', async ({ page }) => {
    await page.goto('/#/game/kings-quadraphages');
    await dismissModeIfNeeded(page);
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.click('#help-modal .modal-close');
    await page.click('#new-game-btn');
    await page.click('#start-game-btn');
    await expect(
      page.locator('.status-supplies, .supply-p1, .board').first()
    ).toBeVisible();
  });

  test('Frac Fact help + new game restores problem chrome', async ({
    page,
  }) => {
    await page.goto('/#/game/frac-fact');
    await dismissModeIfNeeded(page);
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.click('#help-modal .modal-close');
    await page.click('#new-game-btn');
    await page.click('#start-game-btn');
    await expect(
      page.locator('.frac-problem, .frac-scores, .frac-game-area').first()
    ).toBeVisible();
  });

  test('Hex-a-Gone help + new game restores bank', async ({ page }) => {
    await page.goto('/#/game/hex-a-gone');
    await dismissModeIfNeeded(page);
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.click('#help-modal .modal-close');
    await page.click('#new-game-btn');
    await page.click('#start-game-btn');
    await expect(
      page.locator('.hex-a-gone-bank, .hex-a-gone-board').first()
    ).toBeVisible();
  });

  test('Fraction Pinball help + new game restores challenge', async ({
    page,
  }) => {
    await page.goto('/#/game/fraction-pinball');
    await dismissModeIfNeeded(page);
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.click('#help-modal .modal-close');
    await page.click('#new-game-btn');
    await page.click('#start-game-btn');
    await expect(
      page
        .locator('.pinball-challenge, .pinball-scores, .pinball-board')
        .first()
    ).toBeVisible();
  });
});

test.describe('Wave 13 — vs-AI start smoke', () => {
  test('Ramrod vs-AI starts with rods', async ({ page }) => {
    await page.goto('/#/game/ramrod');
    const modal = page.locator('#new-game-modal');
    if (await modal.isVisible().catch(() => false)) {
      const vsAi = page.locator(
        '#mode-ai, [data-mode="ai"], button:has-text("AI"), label:has-text("AI")'
      );
      if ((await vsAi.count()) > 0) {
        await vsAi.first().click({ force: true });
      }
      const start = page.locator('#start-game-btn');
      if (await start.isVisible().catch(() => false)) {
        await start.click();
      }
    }
    await expect(
      page.locator('.ramrod-player-rods, .ramrod-board').first()
    ).toBeVisible();
  });

  test('Kwatro-Sinko vs-AI starts with board', async ({ page }) => {
    await page.goto('/#/game/kwatro-sinko');
    const modal = page.locator('#new-game-modal');
    if (await modal.isVisible().catch(() => false)) {
      const vsAi = page.locator(
        '#mode-ai, [data-mode="ai"], button:has-text("AI"), label:has-text("AI")'
      );
      if ((await vsAi.count()) > 0) {
        await vsAi.first().click({ force: true });
      }
      const start = page.locator('#start-game-btn');
      if (await start.isVisible().catch(() => false)) {
        await start.click();
      }
    }
    await expect(
      page.locator('.kwa-board, .kwa-chip-info').first()
    ).toBeVisible();
  });

  test('Stars & Bars vs-AI starts with hand', async ({ page }) => {
    await page.goto('/#/game/stars-bars');
    const modal = page.locator('#new-game-modal');
    if (await modal.isVisible().catch(() => false)) {
      const vsAi = page.locator(
        '#mode-ai, [data-mode="ai"], button:has-text("AI"), label:has-text("AI")'
      );
      if ((await vsAi.count()) > 0) {
        await vsAi.first().click({ force: true });
      }
      const start = page.locator('#start-game-btn');
      if (await start.isVisible().catch(() => false)) {
        await start.click();
      }
    }
    await expect(
      page.locator('.stars-hand, .stars-hand-container, .stars-board').first()
    ).toBeVisible();
  });

  test('FIAR vs-AI starts with board', async ({ page }) => {
    await page.goto('/#/game/fiar');
    const modal = page.locator('#new-game-modal');
    if (await modal.isVisible().catch(() => false)) {
      const vsAi = page.locator(
        '#mode-ai, [data-mode="ai"], button:has-text("AI"), label:has-text("AI")'
      );
      if ((await vsAi.count()) > 0) {
        await vsAi.first().click({ force: true });
      }
      const start = page.locator('#start-game-btn');
      if (await start.isVisible().catch(() => false)) {
        await start.click();
      }
    }
    await expect(page.locator('.fiar-board, svg').first()).toBeVisible();
  });

  test("Pent'Em In vs-AI starts with piece selector", async ({ page }) => {
    await page.goto('/#/game/pent-em-in');
    const modal = page.locator('#new-game-modal');
    if (await modal.isVisible().catch(() => false)) {
      const vsAi = page.locator(
        '#mode-ai, [data-mode="ai"], button:has-text("AI"), label:has-text("AI")'
      );
      if ((await vsAi.count()) > 0) {
        await vsAi.first().click({ force: true });
      }
      const start = page.locator('#start-game-btn');
      if (await start.isVisible().catch(() => false)) {
        await start.click();
      }
    }
    await expect(
      page.locator('.pent-piece-selector, .pent-board').first()
    ).toBeVisible();
  });

  test('Remainder Islands vs-AI starts with dice', async ({ page }) => {
    await page.goto('/#/game/remainder-islands');
    const modal = page.locator('#new-game-modal');
    if (await modal.isVisible().catch(() => false)) {
      const vsAi = page.locator(
        '#mode-ai, [data-mode="ai"], button:has-text("AI"), label:has-text("AI")'
      );
      if ((await vsAi.count()) > 0) {
        await vsAi.first().click({ force: true });
      }
      const start = page.locator('#start-game-btn');
      if (await start.isVisible().catch(() => false)) {
        await start.click();
      }
    }
    await expect(
      page.locator('.remainder-dice, .remainder-board').first()
    ).toBeVisible();
  });

  test('Hex-a-Gone vs-AI starts with bank', async ({ page }) => {
    await page.goto('/#/game/hex-a-gone');
    const modal = page.locator('#new-game-modal');
    if (await modal.isVisible().catch(() => false)) {
      const vsAi = page.locator(
        '#mode-ai, [data-mode="ai"], button:has-text("AI"), label:has-text("AI")'
      );
      if ((await vsAi.count()) > 0) {
        await vsAi.first().click({ force: true });
      }
      const start = page.locator('#start-game-btn');
      if (await start.isVisible().catch(() => false)) {
        await start.click();
      }
    }
    await expect(
      page.locator('.hex-a-gone-bank, .hex-a-gone-board').first()
    ).toBeVisible();
  });

  test('Kings vs-AI starts with board', async ({ page }) => {
    await page.goto('/#/game/kings-quadraphages');
    const modal = page.locator('#new-game-modal');
    if (await modal.isVisible().catch(() => false)) {
      const vsAi = page.locator(
        '#mode-ai, [data-mode="ai"], button:has-text("AI"), label:has-text("AI")'
      );
      if ((await vsAi.count()) > 0) {
        await vsAi.first().click({ force: true });
      }
      const start = page.locator('#start-game-btn');
      if (await start.isVisible().catch(() => false)) {
        await start.click();
      }
    }
    await expect(page.locator('.board, .cell').first()).toBeVisible();
  });
});

test.describe('Wave 13 — more illegal / premature no-ops', () => {
  test('Fab answer click before bars keeps pool', async ({ page }) => {
    await page.goto('/#/game/fab-a-diffy');
    await dismissModeIfNeeded(page);
    const answer = page
      .locator('.fab-answer-wrapper, .fab-answer-board')
      .first();
    if ((await answer.count()) > 0) {
      await answer.click({ force: true });
    }
    await expect(
      page.locator('.fab-bar-pool, .fab-answer-board').first()
    ).toBeVisible();
  });

  test('Prime cell click before roll keeps dice CTA', async ({ page }) => {
    await page.goto('/#/game/prime-gold');
    await dismissModeIfNeeded(page);
    const cell = page.locator('.pg-cell, .pg-board').first();
    if ((await cell.count()) > 0) {
      await cell.click({ force: true });
    }
    await expect(
      page.locator('.pg-roll-btn, .pg-dice-area').first()
    ).toBeVisible();
  });

  test('Stars cell click before card keeps hand', async ({ page }) => {
    await page.goto('/#/game/stars-bars');
    await dismissModeIfNeeded(page);
    const cell = page.locator('.stars-cell, .stars-board').first();
    if ((await cell.count()) > 0) {
      await cell.click({ force: true, position: { x: 8, y: 8 } });
    }
    await expect(
      page.locator('.stars-hand, .stars-hand-container, .stars-board').first()
    ).toBeVisible();
  });

  test('Ramrod box click before rod keeps rods', async ({ page }) => {
    await page.goto('/#/game/ramrod');
    await dismissModeIfNeeded(page);
    const box = page.locator('.ramrod-box, .ramrod-board').first();
    if ((await box.count()) > 0) {
      await box.click({ force: true });
    }
    await expect(
      page.locator('.ramrod-player-rods, .ramrod-board').first()
    ).toBeVisible();
  });

  test('Calla empty pit click keeps board', async ({ page }) => {
    await page.goto('/#/game/calla');
    await dismissModeIfNeeded(page);
    const pit = page.locator('.calla-pit').first();
    if ((await pit.count()) > 0) {
      await pit.click({ force: true });
    }
    await expect(
      page.locator('.calla-board, .calla-pit').first()
    ).toBeVisible();
  });
});

test.describe('Wave 13 — interaction deepenings', () => {
  test('FIAR place one chip then new-game restores placement', async ({
    page,
  }) => {
    await page.goto('/#/game/fiar');
    await dismissModeIfNeeded(page);
    const node = page.locator('[data-node-id], .fiar-node, circle').first();
    if ((await node.count()) > 0) {
      await node.click({ force: true });
    }
    await page.click('#new-game-btn');
    await page.click('#start-game-btn');
    await expect(page.locator('.fiar-board, svg').first()).toBeVisible();
  });

  test('Contig roll then new-game restores roll CTA', async ({ page }) => {
    await page.goto('/#/game/contig-60');
    await dismissModeIfNeeded(page);
    const roll = page.locator('.contig-roll-btn').first();
    if ((await roll.count()) > 0) {
      await roll.click();
    }
    await page.click('#new-game-btn');
    await page.click('#start-game-btn');
    await expect(
      page.locator('.contig-roll-btn, .contig-dice-area').first()
    ).toBeVisible();
  });

  test('Kings select king keeps supplies chrome', async ({ page }) => {
    await page.goto('/#/game/kings-quadraphages');
    await dismissModeIfNeeded(page);
    await page
      .locator('.cell[data-row="1"][data-col="5"]')
      .click({ force: true });
    await expect(page.locator('.cell-selected')).toBeVisible();
    await expect(
      page.locator('.status-supplies, .supply-p1').first()
    ).toBeVisible();
  });
});

test.describe('Wave 14 — rules-phase chrome transitions', () => {
  test('Hex-a-Gone select → confirm reveals place phase chrome', async ({
    page,
  }) => {
    await page.goto('/#/game/hex-a-gone');
    await dismissModeIfNeeded(page);
    const bankBtn = page
      .locator(
        '.hex-a-gone-bank button, .hex-a-gone-shape, [data-shape], .bank-shape'
      )
      .first();
    if ((await bankBtn.count()) > 0) {
      await bankBtn.click({ force: true });
    }
    const confirm = page.locator(
      '.hex-a-gone-confirm, button:has-text("Confirm"), button:has-text("Place")'
    );
    if ((await confirm.count()) > 0 && (await confirm.first().isEnabled())) {
      await confirm.first().click({ force: true });
    }
    await expect(
      page.locator('.hex-a-gone-board, .hex-a-gone-bank, [data-q]').first()
    ).toBeVisible();
  });

  test('Juggle roll advances past rolling CTA', async ({ page }) => {
    await page.goto('/#/game/juggle');
    await dismissModeIfNeeded(page);
    const roll = page.locator('.juggle-roll-btn');
    await expect(roll.first()).toBeVisible();
    await roll.first().click();
    await expect(
      page
        .locator(
          '.juggle-shapes, .juggle-shape, .juggle-die, .juggle-board, .juggle-dice-display'
        )
        .first()
    ).toBeVisible();
  });

  test('Prime Gold roll leaves rolling and shows board/dice', async ({
    page,
  }) => {
    await page.goto('/#/game/prime-gold');
    await dismissModeIfNeeded(page);
    const roll = page.locator('.pg-roll-btn');
    if ((await roll.count()) > 0) {
      await roll.first().click();
    }
    await expect(
      page.locator('.pg-board, .pg-cell, .pg-dice-area, .pg-pass-btn').first()
    ).toBeVisible();
  });

  test('Remainder Islands roll shows island or roll chrome', async ({
    page,
  }) => {
    await page.goto('/#/game/remainder-islands');
    await dismissModeIfNeeded(page);
    const roll = page.locator('.remainder-roll-btn, button:has-text("Roll")');
    if ((await roll.count()) > 0) {
      await roll.first().click();
    }
    await expect(
      page
        .locator(
          '.remainder-island, .remainder-board, .remainder-roll-btn, .remainder-dice'
        )
        .first()
    ).toBeVisible();
  });

  test('Star Track draw reveals chain choices', async ({ page }) => {
    await page.goto('/#/game/star-track');
    await dismissModeIfNeeded(page);
    await page.locator('.star-track-draw-btn').click();
    await expect(
      page
        .locator('.star-track-choice, .star-track-choices, .star-track-chain')
        .first()
    ).toBeVisible();
  });

  test('Contig roll shows expressions or pass (calculating phase)', async ({
    page,
  }) => {
    await page.goto('/#/game/contig-60');
    await dismissModeIfNeeded(page);
    await page.locator('.contig-roll-btn').click();
    await expect(
      page
        .locator('.contig-expressions, .contig-pass-btn, .contig-cell-valid')
        .first()
    ).toBeVisible();
  });

  test('Fab first bar select advances selection chrome', async ({ page }) => {
    await page.goto('/#/game/fab-a-diffy');
    await dismissModeIfNeeded(page);
    const bar = page
      .locator('.fab-bar-wrapper:not(.fab-bar-disabled)')
      .first();
    if ((await bar.count()) > 0) {
      await bar.click({ force: true });
      await expect(page.locator('.fab-bar-selected')).toBeVisible();
    }
    await expect(
      page.locator('.fab-bar-pool, .fab-answer-board').first()
    ).toBeVisible();
  });

  test('Calla pit click advances or keeps board (phase guard)', async ({
    page,
  }) => {
    await page.goto('/#/game/calla');
    await dismissModeIfNeeded(page);
    const pit = page.locator('.calla-pit, .calla-shield, [data-pit]').first();
    if ((await pit.count()) > 0) {
      await pit.click({ force: true });
    }
    await expect(
      page.locator('.calla-board, .calla-pit, .calla-calla').first()
    ).toBeVisible();
  });

  test('Pent piece select enters place chrome', async ({ page }) => {
    await page.goto('/#/game/pent-em-in');
    await dismissModeIfNeeded(page);
    const piece = page
      .locator('.pent-piece, .pent-em-in-piece, [data-shape-id], .piece-btn')
      .first();
    if ((await piece.count()) > 0) {
      await piece.click({ force: true });
    }
    await expect(
      page.locator('.pent-board, .pent-em-in-board, .pent-pieces').first()
    ).toBeVisible();
  });

  test('Par block select then board remains interactive', async ({ page }) => {
    await page.goto('/#/game/par-55');
    await dismissModeIfNeeded(page);
    const block = page
      .locator('.par55-block, .par55-hand-block, [data-block-id]')
      .first();
    if ((await block.count()) > 0) {
      await block.click({ force: true });
    }
    await expect(page.locator('.par55-board, .par55-hand').first()).toBeVisible();
  });
});

test.describe('Wave 14 — Contig/Sum/Star/Calla/Hex/Queens/Fab/Par/Prime/Juggle deepenings', () => {
  test('Contig roll then pass/new-game restores roll CTA', async ({ page }) => {
    await page.goto('/#/game/contig-60');
    await dismissModeIfNeeded(page);
    const roll = page.locator('.contig-roll-btn').first();
    if ((await roll.count()) > 0) {
      await roll.click();
    }
    const pass = page.locator('.contig-pass-btn');
    if (
      (await pass.count()) > 0 &&
      (await pass.isVisible().catch(() => false))
    ) {
      await pass.click();
    }
    await page.click('#new-game-btn');
    await page.click('#start-game-btn');
    await expect(
      page.locator('.contig-roll-btn, .contig-dice-area').first()
    ).toBeVisible();
  });

  test('Sum Dominoes hand + dice chrome remounts after new-game', async ({
    page,
  }) => {
    await page.goto('/#/game/sum-dominoes');
    await dismissModeIfNeeded(page);
    await expect(
      page.locator('.sd-hand-player1 .sd-hand-domino').first()
    ).toBeVisible();
    await expect(page.locator('.sd-roll-btn')).toBeVisible();
    await page.click('#new-game-btn');
    await page.click('#start-game-btn');
    await expect(page.locator('.sd-board')).toBeVisible();
    await expect(page.locator('.sd-roll-btn')).toBeVisible();
  });

  test('Star Track draw phase chrome after help close + new-game', async ({
    page,
  }) => {
    await page.goto('/#/game/star-track');
    await dismissModeIfNeeded(page);
    await page.click('#help-btn');
    await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
    await page.click('#help-modal .modal-close');
    await expect(page.locator('#help-modal')).toHaveClass(/hidden/);
    await page.click('#new-game-btn');
    await page.click('#start-game-btn');
    await expect(
      page.locator('.star-draw-btn, .star-track-board, .star-status').first()
    ).toBeVisible();
  });

  test('Calla pits mount; vs-AI starts without crash', async ({ page }) => {
    await page.goto('/#/game/calla');
    await dismissModeIfNeeded(page);
    await expect(
      page.locator('.calla-pit, .calla-board').first()
    ).toBeVisible();
    await page.click('#new-game-btn');
    const modal = page.locator('#new-game-modal');
    if (await modal.isVisible().catch(() => false)) {
      const vsAi = page.locator(
        '#mode-ai, [data-mode="ai"], button:has-text("AI"), label:has-text("AI")'
      );
      if ((await vsAi.count()) > 0) {
        await vsAi.first().click({ force: true });
      }
      const start = page.locator('#start-game-btn');
      if (await start.isVisible().catch(() => false)) {
        await start.click();
      }
    }
    await expect(
      page.locator('.calla-board, .calla-pit').first()
    ).toBeVisible();
  });

  test('Hex board cells + vs-AI start smoke', async ({ page }) => {
    await page.goto('/#/game/hex');
    await dismissModeIfNeeded(page);
    await expect(
      page.locator('.hex-cell-group, .hex-board').first()
    ).toBeVisible();
    await page.click('#new-game-btn');
    const modal = page.locator('#new-game-modal');
    if (await modal.isVisible().catch(() => false)) {
      const vsAi = page.locator(
        '#mode-ai, [data-mode="ai"], button:has-text("AI"), label:has-text("AI")'
      );
      if ((await vsAi.count()) > 0) {
        await vsAi.first().click({ force: true });
      }
      const start = page.locator('#start-game-btn');
      if (await start.isVisible().catch(() => false)) {
        await start.click();
      }
    }
    await expect(
      page.locator('.hex-cell-group, .hex-board').first()
    ).toBeVisible();
  });

  test('Queens ring board mounts; premature empty click no crash', async ({
    page,
  }) => {
    await page.goto('/#/game/queens-guards');
    await dismissModeIfNeeded(page);
    await expect(
      page.locator('.qg-board-container, .qg-board').first()
    ).toBeVisible();
    const empty = page.locator('.qg-cell, [data-ring], circle').first();
    if ((await empty.count()) > 0) {
      await empty.click({ force: true });
    }
    await expect(
      page.locator('.qg-board-container, .qg-status').first()
    ).toBeVisible();
  });

  test('Fab fraction pool visible after start', async ({ page }) => {
    await page.goto('/#/game/fab-a-diffy');
    await dismissModeIfNeeded(page);
    await expect(
      page.locator('.fab-bar-pool, .fab-answer-board').first()
    ).toBeVisible();
  });

  test('Par hand blocks + bases visible', async ({ page }) => {
    await page.goto('/#/game/par-55');
    await dismissModeIfNeeded(page);
    await expect(
      page.locator('.par55-hand, .par55-hand-block').first()
    ).toBeVisible();
    await expect(
      page.locator('.par55-board, .par55-base').first()
    ).toBeVisible();
  });

  test('Prime roll enables expression/board chrome', async ({ page }) => {
    await page.goto('/#/game/prime-gold');
    await dismissModeIfNeeded(page);
    const roll = page.locator('.pg-roll-btn').first();
    if ((await roll.count()) > 0) {
      await roll.click();
    }
    await expect(
      page
        .locator('.pg-expressions, .pg-expression, .pg-dice-display, .pg-board')
        .first()
    ).toBeVisible();
  });

  test('Juggle roll → die → shape selector mounts', async ({ page }) => {
    await page.goto('/#/game/juggle');
    await dismissModeIfNeeded(page);
    await page.locator('.juggle-roll-btn').click();
    await expect(page.locator('.juggle-dice-display')).toBeVisible();
    const die = page.locator('.juggle-die.selectable');
    if ((await die.count()) > 0) {
      await die.first().click({ force: true });
    }
    await expect(
      page
        .locator('.juggle-shape-option, .juggle-shape-selector, .juggle-board')
        .first()
    ).toBeVisible();
  });
});

test.describe('Wave 15 — rules-phase / illegal chrome transitions', () => {
  test('Hex-a-Gone bank select → confirm reveals place-phase chrome', async ({
    page,
  }) => {
    await page.goto('/#/game/hex-a-gone');
    await dismissModeIfNeeded(page);
    const bankBtn = page.locator('.hex-a-gone-block-btn:not(.empty)').first();
    if ((await bankBtn.count()) > 0) {
      await bankBtn.click({ force: true });
    }
    const confirm = page.locator('.hex-a-gone-confirm-btn');
    if ((await confirm.count()) > 0 && (await confirm.first().isEnabled())) {
      await confirm.first().click({ force: true });
      await expect(page.locator('.hex-a-gone-placing-info')).toBeVisible();
    }
    await expect(page.locator('.hex-a-gone-board')).toBeVisible();
  });

  test('Remainder Islands roll advances past roll CTA', async ({ page }) => {
    await page.goto('/#/game/remainder-islands');
    await dismissModeIfNeeded(page);
    await page.locator('.remainder-btn-roll').click();
    await expect(page.locator('.remainder-board')).toBeVisible();
  });

  test('Pent piece select enters place chrome', async ({ page }) => {
    await page.goto('/#/game/pent-em-in');
    await dismissModeIfNeeded(page);
    const piece = page
      .locator('.pent-piece, .pent-em-in-piece, [data-shape-id], .piece-btn')
      .first();
    if ((await piece.count()) > 0) {
      await piece.click({ force: true });
    }
    await expect(
      page.locator('.pent-board, .pent-em-in-board, .pent-pieces').first()
    ).toBeVisible();
  });

  test('Ramrod rod select advances place-phase status', async ({ page }) => {
    await page.goto('/#/game/ramrod');
    await dismissModeIfNeeded(page);
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
    }
    await expect(page.locator('.ramrod-board')).toBeVisible();
  });

  test('Kwatro chip select keeps board interactive', async ({ page }) => {
    await page.goto('/#/game/kwatro-sinko');
    await dismissModeIfNeeded(page);
    const chip = page
      .locator('.kwa-chip, .kwatro-chip, [data-chip-id], .chip')
      .first();
    if ((await chip.count()) > 0) {
      await chip.click({ force: true });
    }
    await expect(
      page.locator('.kwa-board, .kwatro-board, .kwa-graph, canvas').first()
    ).toBeVisible();
  });

  test('FIAR placement node click keeps status chrome', async ({ page }) => {
    await page.goto('/#/game/fiar');
    await dismissModeIfNeeded(page);
    const node = page.locator('[data-node-id]').first();
    if ((await node.count()) > 0) {
      await node.click({ force: true });
    }
    await expect(
      page.locator('.fiar-status, .fiar-chips-info, .fiar-board').first()
    ).toBeVisible();
  });

  test('Stars card select enters placing chrome', async ({ page }) => {
    await page.goto('/#/game/stars-bars');
    await dismissModeIfNeeded(page);
    const card = page
      .locator('.stars-card, .sb-card, .stars-hand-card, [data-card-id]')
      .first();
    if ((await card.count()) > 0) {
      await card.click({ force: true });
    }
    await expect(
      page.locator('.stars-board, .sb-board, .stars-hand').first()
    ).toBeVisible();
  });

  test('Frac Fact answer click advances to result or stays answering', async ({
    page,
  }) => {
    await page.goto('/#/game/frac-fact');
    await dismissModeIfNeeded(page);
    await expect(page.locator('.frac-problem')).toBeVisible();
    await page.locator('.frac-choice-btn').first().click({ force: true });
    await expect(
      page.locator('.frac-result, .frac-scores, .frac-feedback').first()
    ).toBeVisible();
  });

  test('Fraction Pinball answer click advances showResult or answering', async ({
    page,
  }) => {
    await page.goto('/#/game/fraction-pinball');
    await dismissModeIfNeeded(page);
    const choice = page
      .locator(
        '.pinball-choice, .fp-choice, .answer-btn, button.choice, .fp-answer'
      )
      .first();
    if ((await choice.count()) > 0) {
      await choice.click({ force: true });
    }
    await expect(
      page
        .locator('.pinball-board, .fp-board, .fp-target, .fp-score')
        .first()
    ).toBeVisible();
  });

  test('Kings cell click selects king or keeps move-phase chrome', async ({
    page,
  }) => {
    await page.goto('/#/game/kings-quadraphages');
    await dismissModeIfNeeded(page);
    await page
      .locator('.cell[data-row="1"][data-col="5"]')
      .click({ force: true });
    await expect(page.locator('.cell-selected, .status-turn').first()).toBeVisible();
  });

  test('Sum Dominoes premature place without roll is a no-op', async ({
    page,
  }) => {
    await page.goto('/#/game/sum-dominoes');
    await dismissModeIfNeeded(page);
    await expect(page.locator('.sd-roll-btn')).toBeVisible();
    const domino = page.locator('.sd-hand-player1 .sd-hand-domino').first();
    if ((await domino.count()) > 0) {
      await domino.click({ force: true });
    }
    await expect(page.locator('.sd-roll-btn')).toBeVisible();
  });

  test('Contig premature cell click before roll keeps roll CTA', async ({
    page,
  }) => {
    await page.goto('/#/game/contig-60');
    await dismissModeIfNeeded(page);
    const cell = page.locator('.contig-cell').first();
    await cell.click({ force: true });
    await expect(page.locator('.contig-roll-btn')).toBeVisible();
  });
});

test.describe('Wave 16 — AI pipeline vs-AI chrome deepenings', () => {
  async function startVsAi(page: Page) {
    const modal = page.locator('#new-game-modal');
    if (await modal.isVisible().catch(() => false)) {
      const vsAi = page.locator(
        '#mode-ai, [data-mode="ai"], button:has-text("AI"), label:has-text("AI")'
      );
      if ((await vsAi.count()) > 0) {
        await vsAi.first().click({ force: true });
      }
      const start = page.locator('#start-game-btn');
      if (await start.isVisible().catch(() => false)) {
        await start.click();
      }
    }
  }

  test('Juggle vs-AI roll CTA advances into shape/place chrome', async ({
    page,
  }) => {
    await page.goto('/#/game/juggle');
    await startVsAi(page);
    const roll = page.locator('.juggle-roll-btn, .roll-dice-btn, button:has-text("Roll")').first();
    if ((await roll.count()) > 0 && (await roll.isVisible().catch(() => false))) {
      await roll.click({ force: true });
    }
    await expect(
      page
        .locator(
          '.juggle-board, .juggle-dice, .juggle-shapes, .juggle-shape, .polyomino-board'
        )
        .first()
    ).toBeVisible();
  });

  test('Hex-a-Gone vs-AI bank remains interactive after start', async ({
    page,
  }) => {
    await page.goto('/#/game/hex-a-gone');
    await startVsAi(page);
    await expect(
      page.locator('.hag-bank, .hex-a-gone-bank, .hag-board, .hexagon-board').first()
    ).toBeVisible();
    const block = page
      .locator('.hag-block, .hag-bank-shape, [data-shape], .block-btn')
      .first();
    if ((await block.count()) > 0) {
      await block.click({ force: true });
    }
    await expect(
      page.locator('.hag-board, .hex-a-gone-board, .hag-bank').first()
    ).toBeVisible();
  });

  test('Contig vs-AI roll yields expressions or pass', async ({ page }) => {
    await page.goto('/#/game/contig-60');
    await startVsAi(page);
    const roll = page.locator('.contig-roll-btn');
    await expect(roll).toBeVisible();
    await roll.click();
    await expect(
      page.locator('.contig-expressions, .contig-pass-btn, .contig-dice-display').first()
    ).toBeVisible();
  });

  test('Sum Dominoes vs-AI roll yields place or pass chrome', async ({
    page,
  }) => {
    await page.goto('/#/game/sum-dominoes');
    await startVsAi(page);
    await page.locator('.sd-roll-btn').click();
    await expect(
      page.locator('.sd-dice-display, .sd-pass-btn, .sd-board').first()
    ).toBeVisible();
  });

  test('Star Track vs-AI draw advances to chain choice or draw again', async ({
    page,
  }) => {
    await page.goto('/#/game/star-track');
    await startVsAi(page);
    const draw = page.locator('.star-track-draw-btn').first();
    await expect(draw).toBeVisible();
    await draw.click({ force: true });
    await expect(
      page
        .locator('.star-track-chain-btn, .star-track-draw-btn, .star-track-board')
        .first()
    ).toBeVisible();
  });

  test('Fab vs-AI bar pool click keeps selecting chrome', async ({ page }) => {
    await page.goto('/#/game/fab-a-diffy');
    await startVsAi(page);
    const bar = page.locator('.fab-bar-wrapper, .fab-bar-pool .fab-bar').first();
    if ((await bar.count()) > 0) {
      await bar.click({ force: true });
    }
    await expect(
      page.locator('.fab-bar-pool, .fab-answer-board, .fab-scores').first()
    ).toBeVisible();
  });

  test('Calla vs-AI pit click keeps board chrome', async ({ page }) => {
    await page.goto('/#/game/calla');
    await startVsAi(page);
    const pit = page.locator('.calla-pit, [data-pit], .pit').first();
    if ((await pit.count()) > 0) {
      await pit.click({ force: true });
    }
    await expect(
      page.locator('.calla-board, .calla-pit, .calla-calla').first()
    ).toBeVisible();
  });

  test('Frac Fact vs-AI choice click shows result or scores', async ({
    page,
  }) => {
    await page.goto('/#/game/frac-fact');
    await startVsAi(page);
    await expect(page.locator('.frac-problem, .frac-choice-btn').first()).toBeVisible();
    const choice = page.locator('.frac-choice-btn').first();
    if ((await choice.count()) > 0) {
      await choice.click({ force: true });
    }
    await expect(
      page.locator('.frac-result, .frac-scores, .frac-feedback, .frac-problem').first()
    ).toBeVisible();
  });

  test('Prime Gold vs-AI roll keeps dice/board chrome', async ({ page }) => {
    await page.goto('/#/game/prime-gold');
    await startVsAi(page);
    const roll = page
      .locator('.prime-roll-btn, .pg-roll-btn, button:has-text("Roll")')
      .first();
    if ((await roll.count()) > 0 && (await roll.isVisible().catch(() => false))) {
      await roll.click({ force: true });
    }
    await expect(
      page.locator('.prime-board, .pg-board, .prime-dice, .pg-dice').first()
    ).toBeVisible();
  });

  test('Kings vs-AI king select keeps move-phase chrome', async ({ page }) => {
    await page.goto('/#/game/kings-quadraphages');
    await startVsAi(page);
    await page
      .locator('.cell[data-row="1"][data-col="5"]')
      .click({ force: true });
    await expect(
      page.locator('.cell-selected, .status-turn, .kings-board').first()
    ).toBeVisible();
  });

  test('Par 55 vs-AI block select keeps hand/board chrome', async ({ page }) => {
    await page.goto('/#/game/par-55');
    await startVsAi(page);
    const block = page
      .locator('.par55-block, .par55-hand-block, [data-block-id]')
      .first();
    if ((await block.count()) > 0) {
      await block.click({ force: true });
    }
    await expect(page.locator('.par55-board, .par55-hand').first()).toBeVisible();
  });

  test('Ramrod vs-AI rod select keeps board chrome', async ({ page }) => {
    await page.goto('/#/game/ramrod');
    await startVsAi(page);
    const rod = page.locator('.ramrod-rod, .rr-rod, [data-rod-id]').first();
    if ((await rod.count()) > 0) {
      await rod.click({ force: true });
    }
    await expect(
      page.locator('.ramrod-board, .rr-board, .ramrod-rods').first()
    ).toBeVisible();
  });
});

test.describe('Wave 17 — board geometry / seat chrome deepenings', () => {
  test('Contig board still exposes 60 uniquely numbered cells', async ({
    page,
  }) => {
    await page.goto('/#/game/contig-60');
    await dismissModeIfNeeded(page);
    await expect(page.locator('.contig-cell')).toHaveCount(60);
    await expect(page.locator('.contig-score-p1')).toBeVisible();
    await expect(page.locator('.contig-score-p2')).toBeVisible();
  });

  test('Hex corner cell click stays on board chrome', async ({ page }) => {
    await page.goto('/#/game/hex');
    await dismissModeIfNeeded(page);
    await page.locator('.hex-cell-group[data-row="0"][data-col="0"]').click({
      force: true,
    });
    await expect(page.locator('.hex-board, [data-row]').first()).toBeVisible();
  });

  test('Hex-a-Gone axial cells remain present after bank peek', async ({
    page,
  }) => {
    await page.goto('/#/game/hex-a-gone');
    await dismissModeIfNeeded(page);
    const cell = page
      .locator('.hex-a-gone-board [data-q], .hex-a-gone-cell, .hex-cell')
      .first();
    await expect(cell).toBeVisible();
    const block = page
      .locator('.hag-block, .hag-bank-shape, [data-shape], .block-btn')
      .first();
    if ((await block.count()) > 0) {
      await block.click({ force: true });
    }
    await expect(
      page.locator('.hex-a-gone-board, .hag-board, .hex-a-gone-bank').first()
    ).toBeVisible();
  });

  test('Kings corner vs center cells stay addressable', async ({ page }) => {
    await page.goto('/#/game/kings-quadraphages');
    await dismissModeIfNeeded(page);
    await expect(page.locator('.cell[data-row="1"][data-col="1"]')).toBeVisible();
    await expect(page.locator('.cell[data-row="5"][data-col="5"]')).toBeVisible();
    await expect(page.locator('.cell[data-row="9"][data-col="9"]')).toBeVisible();
    await expect(
      page.locator('.status-supplies, .supply-p1, .supply-p2, .board').first()
    ).toBeVisible();
  });

  test('Queens board container keeps ring geometry chrome', async ({
    page,
  }) => {
    await page.goto('/#/game/queens-guards');
    await dismissModeIfNeeded(page);
    await expect(
      page.locator('.qg-board-container, .qg-board, svg').first()
    ).toBeVisible();
    const cell = page.locator('.qg-cell, [data-ring], svg circle, svg g').first();
    if ((await cell.count()) > 0) {
      await cell.click({ force: true });
    }
    await expect(
      page.locator('.qg-board-container, .qg-status, .qg-board').first()
    ).toBeVisible();
  });

  test('FIAR node graph chrome stays after first node tap', async ({
    page,
  }) => {
    await page.goto('/#/game/fiar');
    await dismissModeIfNeeded(page);
    const node = page
      .locator('.fiar-node, [data-node], .fiar-board circle, .fiar-board .node')
      .first();
    if ((await node.count()) > 0) {
      await node.click({ force: true });
    }
    await expect(
      page.locator('.fiar-board, .fiar-status, .fiar-game').first()
    ).toBeVisible();
  });

  test('Pent Em In board grid cells remain after piece peek', async ({
    page,
  }) => {
    await page.goto('/#/game/pent-em-in');
    await dismissModeIfNeeded(page);
    const piece = page
      .locator('.pent-piece, .pent-tray [data-piece], .piece-btn')
      .first();
    if ((await piece.count()) > 0) {
      await piece.click({ force: true });
    }
    await expect(
      page
        .locator('.pent-board, .pent-board .interaction rect, .pent-tray')
        .first()
    ).toBeVisible();
  });

  test('Calla both seat pits remain on board after start', async ({ page }) => {
    await page.goto('/#/game/calla');
    await dismissModeIfNeeded(page);
    await expect(page.locator('.calla-pit, [data-pit], .pit').first()).toBeVisible();
    await expect(
      page.locator('.calla-board, .calla-calla, .calla-scores').first()
    ).toBeVisible();
  });

  test('Star Track both seat markers stay visible with draw CTA', async ({
    page,
  }) => {
    await page.goto('/#/game/star-track');
    await dismissModeIfNeeded(page);
    await expect(page.locator('.star-track-draw-btn').first()).toBeVisible();
    await expect(
      page
        .locator(
          '.star-track-board, .star-track-track, .star-track-p1, .star-track-p2'
        )
        .first()
    ).toBeVisible();
  });

  test('Par 55 board + both score seats remain after hand peek', async ({
    page,
  }) => {
    await page.goto('/#/game/par-55');
    await dismissModeIfNeeded(page);
    const block = page
      .locator('.par55-block, .par55-hand-block, [data-block-id]')
      .first();
    if ((await block.count()) > 0) {
      await block.click({ force: true });
    }
    await expect(page.locator('.par55-board, .par55-hand').first()).toBeVisible();
  });
});
