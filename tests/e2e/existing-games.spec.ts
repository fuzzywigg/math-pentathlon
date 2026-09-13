import { test, expect, Page } from '@playwright/test';

async function dismissModeIfNeeded(page: Page) {
  const modal = page.locator('#new-game-modal');
  if (await modal.isVisible().catch(() => false)) {
    const start = page.locator('#start-game-btn');
    if (await start.isVisible().catch(() => false)) {
      await start.click();
    }
  }
}

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

    await page.locator('.cell[data-row="1"][data-col="5"]').click({ force: true });
    await expect(page.locator('.cell-selected')).toBeVisible();
    await expect(page.locator('.cell-valid-move')).toHaveCount(5);

    // Invalid destination — stay in move phase
    await page.locator('.cell[data-row="5"][data-col="5"]').click({ force: true });
    await expect(page.locator('.status-turn')).toContainText('green square');

    await page.locator('.cell[data-row="2"][data-col="5"]').click({ force: true });
    await expect(page.locator('.status-turn')).toContainText('Quadraphage');
    await page.locator('.cell[data-row="5"][data-col="5"]').click({ force: true });

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
    await expect(page.locator('.pg-dice-container .pg-die').first()).toBeVisible();
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
    await expect(page.locator('.fiar-status, .fiar-chips-info').first()).toBeVisible();
  });
});

test.describe('Stars & Bars — e2e smoke', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/game/stars-bars');
    await dismissModeIfNeeded(page);
  });

  test('loads title and board or hand cards', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Stars & Bars');
    const board = page.locator('.stars-board');
    const card = page.locator('.stars-card');
    await expect(board.or(card.first())).toBeVisible();
  });
});

test.describe('Fab-a-Diffy — e2e smoke', () => {
  test('loads title and primary board', async ({ page }) => {
    await page.goto('/#/game/fab-a-diffy');
    await dismissModeIfNeeded(page);
    await expect(page.locator('h1')).toContainText('Fab-a-Diffy');
    await expect(
      page.locator('.fab-bar-pool, .fab-answer-board').first()
    ).toBeVisible();
  });
});

test.describe('Par 55 — e2e smoke', () => {
  test('loads title and primary board', async ({ page }) => {
    await page.goto('/#/game/par-55');
    await dismissModeIfNeeded(page);
    await expect(page.locator('h1')).toContainText('Par 55');
    await expect(page.locator('.par55-board')).toBeVisible();
  });
});

test.describe('Kwatro-Sinko — e2e smoke', () => {
  test('loads title and primary board', async ({ page }) => {
    await page.goto('/#/game/kwatro-sinko');
    await dismissModeIfNeeded(page);
    await expect(page.locator('h1')).toContainText('Kwatro-Sinko');
    await expect(page.locator('.kwa-board')).toBeVisible();
  });
});

test.describe('Queens & Guards — e2e smoke', () => {
  test('loads title and primary board', async ({ page }) => {
    await page.goto('/#/game/queens-guards');
    await dismissModeIfNeeded(page);
    await expect(page.locator('h1')).toContainText('Queens & Guards');
    await expect(page.locator('.qg-board-container')).toBeVisible();
  });
});

test.describe("Pent'Em In — e2e smoke", () => {
  test('loads title and primary board', async ({ page }) => {
    await page.goto('/#/game/pent-em-in');
    await dismissModeIfNeeded(page);
    await expect(page.locator('h1')).toContainText("Pent'Em In");
    await expect(page.locator('.pent-board')).toBeVisible();
  });
});

test.describe('Fraction Pinball — e2e smoke', () => {
  test('loads title and primary board', async ({ page }) => {
    await page.goto('/#/game/fraction-pinball');
    await dismissModeIfNeeded(page);
    await expect(page.locator('h1')).toContainText('Fraction Pinball');
    await expect(
      page.locator('.pinball-board, .pinball-challenge, .pinball-game-container').first()
    ).toBeVisible();
  });
});
