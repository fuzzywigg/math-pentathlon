/**
 * Tablet place-piece UX: legal highlights + choose-another escape
 * for the playtest "Place the … piece" dead-end.
 */
import { test, expect, type Page } from '@playwright/test';

async function dismissOwlIfNeeded(page: Page) {
  const dismiss = page.locator(
    '#ollie-owl button[aria-label="Dismiss message"], #ollie-owl .owl-bubble-dismiss'
  );
  if (await dismiss.first().isVisible().catch(() => false)) {
    await dismiss.first().click({ force: true });
  }
  await page.evaluate(() => {
    const el = document.getElementById('ollie-owl');
    if (el) (el as HTMLElement).style.pointerEvents = 'none';
  });
}

test.describe("Pent'Em In place UX (tablet)", () => {
  test('crowded place step shows green anchors and choose-another escape', async ({
    page,
  }) => {
    // iPad Mini–sized touch profile without forcing a new Playwright worker
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/#/game/pent-em-in');
    await expect(page.getByTestId('game-loading')).toBeHidden({
      timeout: 15_000,
    });
    await dismissOwlIfNeeded(page);
    await expect(page.locator('.pent-piece-option').first()).toBeVisible({
      timeout: 10_000,
    });

    const injected = await page.evaluate(() => {
      const ctrl = window.__mpPentEmInController;
      if (!ctrl) return { ok: false as const, reason: 'no controller' };
      const BOARD_SIZE = 10;
      const state = ctrl.getState();
      const board = state.board.map((row) =>
        row.map((cell) => ({ ...cell }))
      );
      for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
          const keepOpen = r === 0 && c < 5;
          if (!keepOpen) {
            board[r][c] = {
              ...board[r][c],
              occupied: true,
              owner: 'player2',
              pieceId: 'block',
            };
          }
        }
      }
      // Bad orientation: vertical I5 cannot sit in the 1×5 strip
      ctrl.setState({
        ...state,
        board,
        placedPieces: [],
        currentPlayer: 'player1',
        phase: 'placePiece',
        selectedPiece: 'I5',
        selectedRotation: 90,
        selectedFlipped: false,
        previewPosition: null,
        player1Pieces: { available: ['I5', 'L5', 'X'], placed: [] },
        player2Pieces: { available: ['F'], placed: [] },
        winner: null,
      });
      return { ok: true as const };
    });
    expect(injected.ok).toBe(true);

    // Controller setState does not auto-orient; UI must still offer escape.
    // Rotate once (or choose another) should be available.
    await expect(page.locator('.pent-status')).toBeVisible();
    await expect(page.locator('.pent-btn-choose-other')).toBeVisible();
    await expect(page.locator('.pent-btn-choose-other')).toContainText(
      /Choose another|Can't fit/
    );

    // Rotate toward a fit — after rotate, green anchors appear
    const rotate = page.locator('.pent-btn-rotate');
    if (await rotate.isVisible()) {
      // Up to 3 rotates to find a fitting orientation
      for (let i = 0; i < 3; i++) {
        const count = await page.locator('.pent-cell-valid').count();
        if (count > 0) break;
        await rotate.click({ force: true });
      }
    }

    await expect(page.locator('.pent-cell-valid').first()).toBeVisible({
      timeout: 5000,
    });
    await expect(page.locator('.pent-place-hint')).toContainText(/green cell/i);

    // Escape back to piece tray
    await page.locator('.pent-btn-choose-other').click({ force: true });
    await expect(page.locator('.pent-piece-option').first()).toBeVisible();
    await expect(page.locator('.pent-status')).toContainText(/Select a piece/i);

    // Selecting I5 from tray orients + highlights immediately
    await page.locator('.pent-piece-option[data-piece="I5"]').click({
      force: true,
    });
    await expect(page.locator('.pent-status')).toContainText(/Place the I5/i);
    await expect(page.locator('.pent-cell-valid').first()).toBeVisible();
  });
});
