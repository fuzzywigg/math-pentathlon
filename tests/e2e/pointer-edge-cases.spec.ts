/**
 * Pointer / touch edge cases on boards (burn-1008-mp-pointer-edge-cases).
 * Chromium + dispatched PointerEvents / touch emulation.
 * Does not duplicate #457 tap targets, #486 mobile smoke, #517 races, #529 DPR.
 */
import { test } from './fixtures';
import { expect, type Page } from '@playwright/test';
import { GAMES } from '../../src/core/game-registry';

const AVAILABLE = GAMES.filter((g) => g.available);

const BOARD_SURFACE: Record<string, string> = {
  'kings-quadraphages': '#board .board',
  hex: '.hex-board',
  'star-track': '.star-track-board, .star-track-wrapper',
  'hex-a-gone': '.hex-a-gone-board',
  calla: '.calla-wrapper',
  'sum-dominoes': '.sd-board',
  'par-55': '.par55-board',
  ramrod: '.ramrod-board',
  'kwatro-sinko': '.kwa-board',
  fiar: '.fiar-board-container, .fiar-board',
  juggle: '.juggle-board',
  'contig-60': '.contig-board',
  'stars-bars': '.stars-board',
  'fab-a-diffy': '.fab-bar-pool, .fab-answer-board',
  'queens-guards': '.qg-board-container, .qg-board',
  'prime-gold': '.pg-board, .prime-board',
  'remainder-islands': '.remainder-board',
  'pent-em-in': '.pent-board',
  'frac-fact': '.frac-problem, .frac-choice-btn',
  'fraction-pinball': '.pinball-board, .pinball-game-container',
};

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
}

test.describe('Pointer edge cases', () => {
  test('every game board mount uses touch-action manipulation (or none on 3D canvas)', async ({
    page,
  }) => {
    for (const game of AVAILABLE) {
      await gotoGame(page, game.id);
      await startHuman(page);
      const sel = BOARD_SURFACE[game.id];
      expect(sel, game.id).toBeTruthy();
      await expect(page.locator(sel!).first()).toBeVisible({ timeout: 15_000 });

      // Most games mount `#board`; frac-fact / remainder / pinball use `#game-container`.
      const board = page.locator('#board, #game-container').first();
      await expect(board).toBeVisible();
      const boardTouch = await board.evaluate(
        (el) => getComputedStyle(el).touchAction
      );
      expect(
        /manipulation|none/.test(boardTouch),
        `${game.id} mount touch-action=${boardTouch}`
      ).toBe(true);

      const canvas = page.locator('#board canvas, #game-container canvas').first();
      if ((await canvas.count()) > 0 && (await canvas.isVisible())) {
        const canvasTouch = await canvas.evaluate(
          (el) =>
            (el as HTMLElement).style.touchAction ||
            getComputedStyle(el).touchAction
        );
        expect(
          canvasTouch === 'none' || /none/.test(canvasTouch),
          `${game.id} canvas touch-action=${canvasTouch}`
        ).toBe(true);
      }
    }
  });

  test('contextmenu on board mount is prevented', async ({ page }) => {
    await gotoGame(page, 'hex');
    await startHuman(page);
    const board = page.locator('#board, #game-container').first();
    await expect(board).toBeVisible();
    const prevented = await board.evaluate((el) => {
      const ev = new MouseEvent('contextmenu', {
        bubbles: true,
        cancelable: true,
      });
      el.dispatchEvent(ev);
      return ev.defaultPrevented;
    });
    expect(prevented).toBe(true);
  });

  test('remainder-islands: pointercancel mid-gesture does not claim an island', async ({
    page,
  }) => {
    await gotoGame(page, 'remainder-islands');
    await startHuman(page);

    await page.locator('.remainder-btn-roll, button:has-text("Roll")').click();
    const island = page.locator('.island.valid').first();
    await expect(island).toBeVisible({ timeout: 10_000 });

    const historyBefore = await page.evaluate(() => {
      return document.querySelectorAll('.remainder-board .island.selected')
        .length;
    });

    await island.evaluate((el) => {
      const hit = el.querySelector('polygon:last-of-type') ?? el;
      const base: PointerEventInit = {
        bubbles: true,
        cancelable: true,
        pointerId: 7,
        pointerType: 'touch',
        isPrimary: true,
        clientX: 20,
        clientY: 20,
      };
      hit.dispatchEvent(
        new PointerEvent('pointerdown', { ...base, buttons: 1 })
      );
      hit.dispatchEvent(
        new PointerEvent('pointermove', {
          ...base,
          clientX: 80,
          clientY: 20,
          buttons: 1,
        })
      );
      hit.dispatchEvent(
        new PointerEvent('pointercancel', { ...base, clientX: 80, clientY: 20 })
      );
      hit.dispatchEvent(
        new PointerEvent('pointerup', { ...base, clientX: 80, clientY: 20 })
      );
    });

    // Still in selectIsland — roll button gone / islands still interactive
    await expect(page.locator('.island.valid').first()).toBeVisible();
    const stillSelecting = await page.locator('.remainder-btn-roll').count();
    // After a successful claim the UI returns to rolling (roll btn visible).
    // Cancel must leave us without advancing — roll btn still absent OR
    // phase still select (valid islands remain). Prefer valid-island presence.
    expect(await page.locator('.island.valid').count()).toBeGreaterThan(0);
    void historyBefore;
    void stillSelecting;
  });

  test('remainder-islands: primary pointer tap claims; second finger does not', async ({
    page,
  }) => {
    await gotoGame(page, 'remainder-islands');
    await startHuman(page);
    await page.locator('.remainder-btn-roll, button:has-text("Roll")').click();
    const island = page.locator('.island.valid').first();
    await expect(island).toBeVisible({ timeout: 10_000 });

    await island.evaluate((el) => {
      const hit = el.querySelector('polygon:last-of-type') ?? el;
      // Secondary finger down+up must not claim
      hit.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          pointerId: 2,
          pointerType: 'touch',
          isPrimary: false,
          clientX: 12,
          clientY: 12,
          buttons: 1,
        })
      );
      hit.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          pointerId: 2,
          pointerType: 'touch',
          isPrimary: false,
          clientX: 12,
          clientY: 12,
          buttons: 0,
        })
      );
    });
    await expect(page.locator('.island.valid').first()).toBeVisible();

    await island.evaluate((el) => {
      const hit = el.querySelector('polygon:last-of-type') ?? el;
      const base: PointerEventInit = {
        bubbles: true,
        cancelable: true,
        pointerId: 1,
        pointerType: 'touch',
        isPrimary: true,
        clientX: 14,
        clientY: 14,
      };
      hit.dispatchEvent(
        new PointerEvent('pointerdown', { ...base, buttons: 1 })
      );
      hit.dispatchEvent(
        new PointerEvent('pointerup', { ...base, buttons: 0 })
      );
    });

    // Claim advances to rolling — roll control returns
    await expect(
      page.locator('.remainder-btn-roll, button:has-text("Roll")')
    ).toBeVisible({ timeout: 10_000 });
  });

  test('Ollie: pointercancel mid-drag snaps back (no stuck drag)', async ({
    page,
  }) => {
    await page.goto('/#/');
    const owl = page.locator('#ollie-owl, .owl-container').first();
    await expect(owl).toBeAttached({ timeout: 15_000 });

    // Menu may dock Ollie minimized / CSS-hidden; drive the drag SM via evaluate.
    const stuck = await page.evaluate(() => {
      const root = document.querySelector(
        '#ollie-owl, .owl-container'
      ) as HTMLElement | null;
      if (!root) return 'missing-root';
      const handle = (root.querySelector('.owl-character') ??
        root.querySelector('.owl-minimized')) as HTMLElement | null;
      if (!handle) return 'missing-handle';

      const fire = (
        target: EventTarget,
        type: string,
        init: PointerEventInit
      ): void => {
        target.dispatchEvent(
          new PointerEvent(type, {
            bubbles: true,
            cancelable: true,
            pointerId: 1,
            pointerType: 'touch',
            isPrimary: true,
            ...init,
          })
        );
      };

      fire(handle, 'pointerdown', {
        button: 0,
        buttons: 1,
        clientX: 300,
        clientY: 40,
      });
      fire(root, 'pointermove', {
        buttons: 1,
        clientX: 120,
        clientY: 220,
      });
      const dragging = root.classList.contains('owl-dragging');
      fire(root, 'pointercancel', {
        buttons: 0,
        clientX: 120,
        clientY: 220,
      });
      if (!dragging) return 'never-dragged';
      return root.classList.contains('owl-dragging') ? 'stuck' : 'ok';
    });

    expect(stuck).toBe('ok');
  });
});
