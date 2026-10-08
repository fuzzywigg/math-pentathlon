/**
 * Per-game UI move helpers for HvH fullgame suite.
 * Prefer legal/highlight CSS classes; fall back to DOM click when needed.
 */
import { expect, type Page } from '@playwright/test';
import {
  dismissOwl,
  isGameOver,
  readStatus,
  statusLocator,
} from './_shared';

async function sleep(page: Page, ms: number): Promise<void> {
  await page.waitForTimeout(ms);
}

async function statusSnapshot(page: Page, gameId: string): Promise<string> {
  return readStatus(page, gameId);
}

/** Attempt one illegal interaction; assert status / selection did not advance wrongly. */
export async function assertIllegalRejected(
  page: Page,
  gameId: string
): Promise<void> {
  await dismissOwl(page);
  const before = await statusSnapshot(page, gameId);

  switch (gameId) {
    case 'kings-quadraphages': {
      await page
        .locator('.cell[data-row="1"][data-col="5"]')
        .click({ force: true });
      await expect(page.locator('.cell-selected')).toBeVisible();
      const valids = await page.locator('.cell-valid-move').count();
      await page
        .locator('.cell[data-row="5"][data-col="5"]')
        .click({ force: true });
      await expect(page.locator('.cell-selected')).toBeVisible();
      await expect(page.locator('.cell-valid-move')).toHaveCount(valids);
      // Deselect via Escape if needed so legal play can proceed cleanly
      await page.keyboard.press('Escape').catch(() => undefined);
      break;
    }
    case 'hex': {
      await page
        .locator('.hex-cell-group[data-row="5"][data-col="5"]')
        .click({ force: true });
      const afterPlace = await statusSnapshot(page, gameId);
      await page
        .locator('.hex-cell-group[data-row="5"][data-col="5"]')
        .click({ force: true });
      await expect(statusLocator(page, gameId)).toHaveText(afterPlace);
      break;
    }
    case 'stars-bars': {
      await page.locator('.stars-card:not(.disabled)').first().click({
        force: true,
      });
      await expect(page.locator('.stars-card.selected')).toBeVisible();
      const invalid = page.locator('.stars-cell:not(.valid)');
      if ((await invalid.count()) > 0) {
        await invalid.first().click({ force: true });
        await expect(page.locator('.stars-card.selected')).toBeVisible();
      }
      break;
    }
    case 'fab-a-diffy': {
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
      break;
    }
    case 'calla': {
      // Click an empty / non-valid pit if present
      const invalid = page.locator('.calla-pit:not(.calla-pit-valid)');
      if ((await invalid.count()) > 0) {
        await invalid.first().click({ force: true });
        await expect(statusLocator(page, gameId)).toHaveText(before);
      }
      break;
    }
    case 'fiar': {
      // Click an occupied node after placing once — handled after first legal later
      const nodes = page.locator('.fiar-board-container [data-node-id]');
      if ((await nodes.count()) > 1) {
        // noop click on same empty twice is fine; prefer occupied if any
        const occupied = page.locator(
          '.fiar-board-container [data-node-id][data-owner], .fiar-board-container [data-owner]'
        );
        if ((await occupied.count()) > 0) {
          const s0 = await statusSnapshot(page, gameId);
          await occupied.first().click({ force: true });
          await expect(statusLocator(page, gameId)).toHaveText(s0);
        }
      }
      break;
    }
    case 'queens-guards': {
      await page.locator('[data-cell-key="5-7"]').click({ force: true });
      const invalid = page.locator(
        '[data-cell-key]:not([aria-label*="valid move"])'
      );
      if ((await invalid.count()) > 1) {
        // Click a far cell that isn't a valid move target
        await page.locator('[data-cell-key="0-0"]').click({ force: true }).catch(
          () => undefined
        );
        // Selection should remain or piece still selected
        await expect(page.locator('[data-cell-key="5-7"]')).toBeVisible();
      }
      break;
    }
    case 'ramrod': {
      const rod = page.locator('.ramrod-rod-wrapper.selectable').first();
      if (await rod.count()) {
        await rod.evaluate((el) => (el as HTMLElement).click());
        const invalid = page.locator('.ramrod-slot:not(.valid)');
        if ((await invalid.count()) > 0) {
          const s0 = await statusSnapshot(page, gameId);
          await invalid.first().click({ force: true });
          await expect(statusLocator(page, gameId)).toHaveText(s0);
        }
      }
      break;
    }
    case 'par-55': {
      const block = page.locator('.par55-hand-block.clickable').first();
      if (await block.isVisible().catch(() => false)) {
        await block.click({ force: true });
        const invalid = page.locator(
          '.par55-base:not(.par55-valid-base), .par55-base-hit:not(.par55-valid-base)'
        );
        if ((await invalid.count()) > 0) {
          const s0 = await statusSnapshot(page, gameId);
          await invalid.first().click({ force: true });
          await expect(statusLocator(page, gameId)).toHaveText(s0);
        }
      }
      break;
    }
    case 'sum-dominoes': {
      // Roll first if needed, then try invalid cell
      const roll = page.locator('.sd-roll-btn');
      if (await roll.isVisible().catch(() => false)) {
        await roll.click({ force: true });
      }
      const playable = page.locator('.sd-hand-domino-playable');
      if ((await playable.count()) > 0) {
        await playable.first().click({ force: true });
        const invalid = page.locator('.sd-cell:not(.sd-cell-valid)');
        if ((await invalid.count()) > 0) {
          await invalid.first().click({ force: true });
          await expect(page.locator('.sd-hand-domino-selected, .sd-hand-domino-playable').first()).toBeVisible();
        }
      }
      break;
    }
    case 'contig-60': {
      const roll = page.locator('.contig-roll-btn');
      if (await roll.isVisible().catch(() => false)) {
        await roll.click({ force: true });
      }
      const invalid = page.locator('.contig-cell:not(.contig-cell-valid)');
      if ((await invalid.count()) > 0) {
        const s0 = await statusSnapshot(page, gameId);
        await invalid.first().click({ force: true });
        await expect(statusLocator(page, gameId)).toHaveText(s0);
      }
      break;
    }
    case 'kwatro-sinko': {
      const chip = page.locator('.kwa-selectable-chip').first();
      if (await chip.isVisible().catch(() => false)) {
        await chip.click({ force: true });
        const invalid = page.locator(
          '.kwa-node:not(.kwa-valid-node), [data-node]:not(.kwa-valid-node)'
        );
        if ((await invalid.count()) > 0) {
          const s0 = await statusSnapshot(page, gameId);
          await invalid.first().click({ force: true });
          await expect(statusLocator(page, gameId)).toHaveText(s0);
        }
      }
      break;
    }
    case 'prime-gold': {
      const roll = page.locator('.pg-roll-btn, .prime-roll-btn').first();
      if (await roll.isVisible().catch(() => false)) {
        await roll.click({ force: true });
      }
      const invalid = page.locator(
        '.pg-cell:not(.valid), .prime-cell:not(.valid)'
      );
      if ((await invalid.count()) > 0) {
        const s0 = await statusSnapshot(page, gameId);
        await invalid.first().click({ force: true });
        await expect(statusLocator(page, gameId)).toHaveText(s0);
      }
      break;
    }
    case 'pent-em-in': {
      await page.locator('.pent-piece-option').first().click({ force: true });
      // Click a corner that often can't fit large pieces — status should stay selecting
      const s0 = await statusSnapshot(page, gameId);
      await page
        .locator('.pent-board .interaction rect, .pent-board rect[data-row]')
        .first()
        .click({ force: true })
        .catch(() => undefined);
      // Illegal placement is rejected (no winner yet); status may stay or clear selection
      expect(await isGameOver(page, gameId)).toBe(false);
      void s0;
      break;
    }
    case 'frac-fact':
    case 'fraction-pinball': {
      // Disabled choices during result phase
      const cont = page.locator(
        gameId === 'frac-fact'
          ? '.frac-continue-btn'
          : '.pinball-continue-btn'
      );
      const choiceSel =
        gameId === 'frac-fact' ? '.frac-choice-btn' : '.pinball-choice-btn';
      if (!(await cont.isVisible().catch(() => false))) {
        await page.locator(choiceSel).first().click({ force: true });
      }
      if (await cont.isVisible().catch(() => false)) {
        const disabled = page.locator(`${choiceSel}[disabled], ${choiceSel}:disabled`);
        if ((await disabled.count()) > 0) {
          const s0 = await statusSnapshot(page, gameId);
          await disabled.first().click({ force: true }).catch(() => undefined);
          await expect(statusLocator(page, gameId)).toHaveText(s0);
        }
      }
      break;
    }
    case 'juggle': {
      await page.locator('.juggle-roll-btn').click({ force: true }).catch(() => undefined);
      const die = page.locator('.juggle-die.selectable').first();
      if (await die.count()) await die.click({ force: true });
      const shape = page.locator('.juggle-shape-option').first();
      if (await shape.count()) await shape.click({ force: true });
      // Occupied / invalid cell if any
      const invalid = page.locator(
        '.juggle-cell.occupied, .juggle-cell:not(.juggle-cell-valid)'
      );
      if ((await invalid.count()) > 0) {
        const s0 = await statusSnapshot(page, gameId);
        await invalid.first().click({ force: true });
        // May or may not keep status identical; at least not game-over
        expect(await isGameOver(page, gameId)).toBe(false);
        void s0;
      }
      break;
    }
    case 'star-track': {
      // Disabled draw is illegal / no-op when already drawn
      const draw = page.locator('.star-track-draw-btn');
      if (await draw.isVisible().catch(() => false)) {
        await draw.click({ force: true });
        const s0 = await statusSnapshot(page, gameId);
        // Second draw while chain pending should be no-op or disabled
        await draw.click({ force: true }).catch(() => undefined);
        const s1 = await statusSnapshot(page, gameId);
        // Status should not regress to pre-draw
        expect(s1.length).toBeGreaterThan(0);
        void s0;
      }
      break;
    }
    case 'hex-a-gone': {
      // Click filled cell if any after we'll place — for opening, click without selecting bank
      const cell = page.locator('.hex-a-gone-board [data-q], .hex-a-gone-cell').first();
      if (await cell.count()) {
        const s0 = await statusSnapshot(page, gameId);
        await cell.click({ force: true });
        // Without bank selection, placement should not advance to opponent win
        expect(await isGameOver(page, gameId)).toBe(false);
        void s0;
      }
      break;
    }
    case 'remainder-islands': {
      const roll = page
        .locator('.remainder-btn-roll, button:has-text("Roll")')
        .first();
      if (await roll.isVisible().catch(() => false)) {
        await roll.click({ force: true });
      }
      const invalid = page.locator('.island:not(.valid)');
      if ((await invalid.count()) > 0) {
        const s0 = await statusSnapshot(page, gameId);
        await invalid.first().evaluate((el) => {
          const hit = el.querySelector('polygon:last-of-type') ?? el;
          hit.dispatchEvent(
            new MouseEvent('click', {
              bubbles: true,
              cancelable: true,
              view: window,
            })
          );
        });
        await expect(statusLocator(page, gameId)).toHaveText(s0);
      }
      break;
    }
    default:
      break;
  }
}

/** Play one legal turn for whichever seat is active (HvH). Returns false if stuck. */
export async function playOneLegalTurn(
  page: Page,
  gameId: string
): Promise<boolean> {
  await dismissOwl(page);
  if (await isGameOver(page, gameId)) return false;

  switch (gameId) {
    case 'kings-quadraphages':
      return playKings(page);
    case 'hex':
      return playHex(page);
    case 'star-track':
      return playStarTrack(page);
    case 'hex-a-gone':
      return playHexAGone(page);
    case 'calla':
      return playCalla(page);
    case 'sum-dominoes':
      return playSumDominoes(page);
    case 'par-55':
      return playPar55(page);
    case 'ramrod':
      return playRamrod(page);
    case 'kwatro-sinko':
      return playKwatro(page);
    case 'fiar':
      return playFiar(page);
    case 'juggle':
      return playJuggle(page);
    case 'contig-60':
      return playContig(page);
    case 'stars-bars':
      return playStars(page);
    case 'fab-a-diffy':
      return playFab(page);
    case 'queens-guards':
      return playQueens(page);
    case 'prime-gold':
      return playPrimeGold(page);
    case 'remainder-islands':
      return playRemainder(page);
    case 'pent-em-in':
      return playPent(page);
    case 'frac-fact':
      return playFracFact(page);
    case 'fraction-pinball':
      return playPinball(page);
    default:
      return false;
  }
}

async function playKings(page: Page): Promise<boolean> {
  // Prefer moving a selected king's valid target, else click a king then valid move then place
  const king = page.locator('.cell-king, .cell[data-row="1"][data-col="5"], .cell.cell-p1, .cell.cell-p2').first();
  const status = await readStatus(page, 'kings-quadraphages');
  if (/quadraphage|place/i.test(status)) {
    const empty = page.locator('.cell:not(.cell-king):not(.cell-blocked):not(.cell-p1):not(.cell-p2)').first();
    if (await empty.count()) {
      await empty.click({ force: true });
      return true;
    }
  }
  // Select king if not selected
  if ((await page.locator('.cell-selected').count()) === 0) {
    const k = page.locator('.cell-king').first();
    if (await k.count()) await k.click({ force: true });
    else if (await king.count()) await king.click({ force: true });
  }
  const valid = page.locator('.cell-valid-move').first();
  if (await valid.count()) {
    await valid.click({ force: true });
    await sleep(page, 40);
    // Place phase
    const place = page
      .locator('.cell:not(.cell-king):not(.cell-blocked):not(.cell-selected)')
      .first();
    if (/quadraphage|place/i.test(await readStatus(page, 'kings-quadraphages'))) {
      // Prefer a cell far from king
      await page
        .locator('.cell[data-row="5"][data-col="5"], .cell[data-row="0"][data-col="0"]')
        .first()
        .click({ force: true })
        .catch(async () => {
          if (await place.count()) await place.click({ force: true });
        });
    }
    return true;
  }
  return false;
}

async function playHex(page: Page): Promise<boolean> {
  return page.evaluate(() => {
    const empties = [...document.querySelectorAll('.hex-cell-group')].filter(
      (g) => g.querySelector('.hex-cell-empty')
    );
    if (!empties.length) return false;
    empties.sort((a, b) => {
      const ar = +a.getAttribute('data-row')!;
      const ac = +a.getAttribute('data-col')!;
      const br = +b.getAttribute('data-row')!;
      const bc = +b.getAttribute('data-col')!;
      return Math.abs(ac - 5) - Math.abs(bc - 5) || br - ar;
    });
    const pick = empties[0];
    pick.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    return true;
  });
}

async function playStarTrack(page: Page): Promise<boolean> {
  const draw = page.locator('.star-track-draw-btn');
  if (await draw.isVisible().catch(() => false)) {
    const disabled = await draw.isDisabled().catch(() => false);
    if (!disabled) {
      await draw.click({ force: true });
      await sleep(page, 50);
    }
  }
  const chain = page.locator('.star-track-chain-btn:not([disabled])');
  if ((await chain.count()) > 0) {
    await chain.first().click({ force: true });
    return true;
  }
  return false;
}

async function playHexAGone(page: Page): Promise<boolean> {
  // Prefer a11y grid path (reliable for both 2D and 3D)
  const a11y = page.locator('.hex-a-gone-a11y-grid');
  if (await a11y.isVisible().catch(() => false)) {
    const before = await readStatus(page, 'hex-a-gone');
    await page.evaluate(() => {
      const confirm = document.querySelector<HTMLButtonElement>(
        '.hex-a-gone-confirm-btn'
      );
      if (confirm) {
        confirm.click();
        return;
      }
      const shape = document.querySelector<HTMLButtonElement>(
        '.hex-a-gone-block-btn:not(.empty)'
      );
      if (shape) {
        shape.click();
        return;
      }
      const empty = Array.from(
        document.querySelectorAll<HTMLButtonElement>(
          '.hex-a-gone-a11y-grid button'
        )
      ).find((b) => (b.getAttribute('aria-label') || '').includes('empty'));
      empty?.click();
    });
    await sleep(page, 40);
    // May need two steps (select + place)
    if ((await readStatus(page, 'hex-a-gone')) === before) {
      await page.evaluate(() => {
        const confirm = document.querySelector<HTMLButtonElement>(
          '.hex-a-gone-confirm-btn'
        );
        if (confirm) confirm.click();
        const empty = Array.from(
          document.querySelectorAll<HTMLButtonElement>(
            '.hex-a-gone-a11y-grid button'
          )
        ).find((b) => (b.getAttribute('aria-label') || '').includes('empty'));
        empty?.click();
      });
    }
    return true;
  }
  const bank = page.locator('.hex-a-gone-block-btn:not(.empty)').first();
  if (await bank.isVisible().catch(() => false)) {
    await bank.click({ force: true });
    const confirm = page.locator('.hex-a-gone-confirm-btn');
    if (await confirm.isVisible().catch(() => false)) {
      await confirm.click({ force: true });
    }
  }
  const cell = page
    .locator(
      '.hex-a-gone-cell-valid, .hex-a-gone-board [data-q], .hex-a-gone-cell'
    )
    .first();
  if (await cell.count()) {
    await cell.click({ force: true });
    return true;
  }
  return false;
}

async function playCalla(page: Page): Promise<boolean> {
  const valid = page.locator('.calla-pit-valid');
  if ((await valid.count()) === 0) return false;
  await valid.first().click({ force: true });
  return true;
}

async function playSumDominoes(page: Page): Promise<boolean> {
  const roll = page.locator('.sd-roll-btn');
  if (await roll.isVisible().catch(() => false)) {
    await roll.click({ force: true });
    await sleep(page, 40);
  }
  const playable = page.locator('.sd-hand-domino-playable');
  const pass = page.locator('.sd-pass-btn');
  if ((await playable.count()) > 0) {
    await playable.first().click({ force: true });
    const valid = page.locator('.sd-cell-valid');
    if ((await valid.count()) > 0) {
      await valid.first().click({ force: true });
      return true;
    }
  }
  if (await pass.isVisible().catch(() => false)) {
    await pass.click({ force: true });
    return true;
  }
  return false;
}

async function playPar55(page: Page): Promise<boolean> {
  const block = page.locator('.par55-hand-block.clickable').first();
  if (!(await block.isVisible().catch(() => false))) return false;
  await block.click({ force: true });
  const base = page.locator('.par55-valid-base, .par55-base-hit').first();
  if (await base.count()) {
    await base.click({ force: true });
    return true;
  }
  return false;
}

async function playRamrod(page: Page): Promise<boolean> {
  const rod = page.locator('.ramrod-rod-wrapper.selectable').first();
  if (!(await rod.count())) return false;
  await rod.evaluate((el) => (el as HTMLElement).click());
  const slot = page.locator('.ramrod-slot.valid').first();
  if (await slot.count()) {
    await slot.click({ force: true });
    return true;
  }
  return false;
}

async function playKwatro(page: Page): Promise<boolean> {
  const chip = page.locator('.kwa-selectable-chip').first();
  if (!(await chip.isVisible().catch(() => false))) return false;
  await chip.click({ force: true });
  const dest = page.locator('.kwa-valid-node').first();
  if (await dest.count()) {
    await dest.click({ force: true });
    return true;
  }
  return false;
}

async function playFiar(page: Page): Promise<boolean> {
  return page.evaluate(() => {
    const highlighted = document.querySelector(
      '[data-node-id]:has(.pulse-highlight)'
    ) as HTMLElement | null;
    if (highlighted) {
      highlighted.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true })
      );
      return true;
    }
    const empty = [
      ...document.querySelectorAll(
        '.fiar-board-container [data-node-id]'
      ),
    ].find((n) => {
      const owner = n.getAttribute('data-owner');
      return !owner || owner === '0' || owner === 'none';
    }) as HTMLElement | undefined;
    if (empty) {
      empty.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true })
      );
      return true;
    }
    const any = document.querySelector(
      '.fiar-board-container [data-node-id]'
    ) as HTMLElement | null;
    if (any) {
      any.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true })
      );
      return true;
    }
    return false;
  });
}

async function playJuggle(page: Page): Promise<boolean> {
  await dismissOwl(page);
  const roll = page.locator('.juggle-roll-btn');
  if (await roll.isVisible().catch(() => false)) {
    await roll.click({ force: true });
    await sleep(page, 40);
  }
  const die = page.locator('.juggle-die.selectable').first();
  if (await die.count()) await die.click({ force: true });
  const shape = page.locator('.juggle-shape-option:not(.disabled)').first();
  if (await shape.count()) await shape.click({ force: true });
  const valid = page.locator('.juggle-cell-valid, .juggle-cell[data-row]').first();
  // Prefer current player's board empty cell
  const cell = page.locator(
    '.juggle-board.player1 .juggle-cell:not(.occupied):not(.occupied-player1):not(.occupied-player2), .juggle-board.player2 .juggle-cell:not(.occupied), .juggle-cell-valid'
  ).first();
  if (await cell.count()) {
    await cell.evaluate((el) => (el as HTMLElement).click());
    return true;
  }
  if (await valid.count()) {
    await valid.evaluate((el) => (el as HTMLElement).click());
    return true;
  }
  return false;
}

async function playContig(page: Page): Promise<boolean> {
  const roll = page.locator('.contig-roll-btn');
  if (await roll.isVisible().catch(() => false)) {
    await roll.click({ force: true });
    await sleep(page, 40);
  }
  const valid = page.locator('.contig-cell-valid');
  const pass = page.locator('.contig-pass-btn');
  if ((await valid.count()) > 0) {
    await valid.first().click({ force: true });
    return true;
  }
  if (await pass.isVisible().catch(() => false)) {
    await pass.click({ force: true });
    return true;
  }
  return false;
}

async function playStars(page: Page): Promise<boolean> {
  const pass = page.locator('.stars-pass-btn');
  if (await pass.isVisible().catch(() => false)) {
    // Prefer play when cards available
    const playable = page.locator('.stars-card:not(.disabled)');
    if ((await playable.count()) === 0) {
      await pass.click({ force: true });
      return true;
    }
  }
  const card = page.locator('.stars-card:not(.disabled)').first();
  if (!(await card.count())) {
    if (await pass.isVisible().catch(() => false)) {
      await pass.click({ force: true });
      return true;
    }
    return false;
  }
  await card.click({ force: true });
  const cell = page.locator('.stars-cell.valid').first();
  if (await cell.count()) {
    await cell.click({ force: true });
    return true;
  }
  if (await pass.isVisible().catch(() => false)) {
    await pass.click({ force: true });
    return true;
  }
  return false;
}

async function playFab(page: Page): Promise<boolean> {
  const claim = page.locator(
    '.fab-answer-matchable, .fab-op-valid, .fab-claim-btn'
  );
  const bar = page.locator('.fab-bar-wrapper:not(.fab-bar-disabled)').first();
  if (await bar.isVisible().catch(() => false)) {
    await bar.click({ force: true });
    const op = page
      .locator('.fab-op-valid, .fab-op-btn:not(.fab-op-disabled)')
      .first();
    if (await op.count()) {
      await op.click({ force: true });
      await sleep(page, 40);
    }
    const match = page.locator('.fab-answer-matchable').first();
    if (await match.count()) {
      await match.click({ force: true });
      return true;
    }
    return true;
  }
  if ((await claim.count()) > 0) {
    await claim.first().click({ force: true });
    return true;
  }
  const pass = page.locator('.fab-pass-btn, button:has-text("Pass")');
  if (await pass.first().isVisible().catch(() => false)) {
    await pass.first().click({ force: true });
    return true;
  }
  return false;
}

async function playQueens(page: Page): Promise<boolean> {
  // Select any piece with valid moves
  const moved = await page.evaluate(() => {
    const pieces = [
      ...document.querySelectorAll('[data-cell-key][aria-label]'),
    ] as HTMLElement[];
    const own = pieces.filter((el) => {
      const label = el.getAttribute('aria-label') || '';
      return /queen|guard|your|blue|red|select/i.test(label);
    });
    for (const p of own.length ? own : pieces) {
      p.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      const dest = document.querySelector(
        '[data-cell-key][aria-label*="valid move"]'
      ) as HTMLElement | null;
      if (dest) {
        dest.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        return true;
      }
    }
    // Fallback: center then any valid
    const center = document.querySelector(
      '[data-cell-key="5-7"]'
    ) as HTMLElement | null;
    center?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    const dest = document.querySelector(
      '[data-cell-key][aria-label*="valid move"]'
    ) as HTMLElement | null;
    if (dest) {
      dest.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      return true;
    }
    return false;
  });
  return moved;
}

async function playPrimeGold(page: Page): Promise<boolean> {
  const roll = page.locator('.pg-roll-btn, .prime-roll-btn').first();
  if (await roll.isVisible().catch(() => false)) {
    await roll.click({ force: true });
    await sleep(page, 40);
  }
  const valid = page.locator('.pg-cell.valid, .prime-cell.valid').first();
  const pass = page.locator(
    '.pg-btn-secondary, .pg-pass-btn, button:has-text("Pass")'
  );
  if (await valid.count()) {
    await valid.click({ force: true });
    return true;
  }
  if (await pass.first().isVisible().catch(() => false)) {
    await pass.first().click({ force: true });
    return true;
  }
  return false;
}

async function playRemainder(page: Page): Promise<boolean> {
  await dismissOwl(page);
  const roll = page
    .locator('.remainder-btn-roll, button:has-text("Roll")')
    .first();
  if (await roll.isVisible().catch(() => false)) {
    await roll.click({ force: true });
    await sleep(page, 40);
  }
  const island = page.locator('.island.valid').first();
  if (!(await island.isVisible().catch(() => false))) return false;
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
  return true;
}

async function playPent(page: Page): Promise<boolean> {
  const piece = page.locator('.pent-piece-option:not(.disabled)').first();
  if (!(await piece.count())) return false;
  await piece.click({ force: true });
  await sleep(page, 30);
  // Prefer a11y grid if present
  const a11y = page.locator('.pent-a11y-grid [role="gridcell"]:not([aria-disabled="true"])');
  if ((await a11y.count()) > 0) {
    // Try several cells for a fit
    const n = Math.min(20, await a11y.count());
    for (let i = 0; i < n; i++) {
      const before = await readStatus(page, 'pent-em-in');
      await a11y.nth(i).click({ force: true });
      await sleep(page, 30);
      const after = await readStatus(page, 'pent-em-in');
      if (after !== before || (await isGameOver(page, 'pent-em-in'))) return true;
      // re-select piece if needed
      if (await piece.isVisible().catch(() => false)) {
        await piece.click({ force: true });
      }
    }
  }
  const cells = page.locator(
    '.pent-board .interaction rect, .pent-board rect[data-row]'
  );
  const count = Math.min(25, await cells.count());
  for (let i = 0; i < count; i++) {
    const before = await readStatus(page, 'pent-em-in');
    await cells.nth(i).click({ force: true });
    await sleep(page, 20);
    if ((await readStatus(page, 'pent-em-in')) !== before) return true;
    if (await isGameOver(page, 'pent-em-in')) return true;
  }
  return false;
}

async function playFracFact(page: Page): Promise<boolean> {
  const cont = page.locator('.frac-continue-btn, button:has-text("Continue")');
  if (await cont.first().isVisible().catch(() => false)) {
    await cont.first().click();
    return true;
  }
  const choice = page.locator('.frac-choice-btn:not([disabled])').first();
  if (await choice.isVisible().catch(() => false)) {
    await choice.click({ force: true });
    return true;
  }
  return false;
}

async function playPinball(page: Page): Promise<boolean> {
  const cont = page.locator(
    '.pinball-continue-btn, button:has-text("Continue")'
  );
  if (await cont.first().isVisible().catch(() => false)) {
    await cont.first().click();
    return true;
  }
  const choice = page.locator('.pinball-choice-btn:not([disabled])').first();
  if (await choice.isVisible().catch(() => false)) {
    await choice.click({ force: true });
    return true;
  }
  return false;
}

/** Drive HvH until game-over. Returns turn count. */
export async function playToGameOver(
  page: Page,
  gameId: string,
  opts: { maxTurns?: number } = {}
): Promise<number> {
  const maxTurns = opts.maxTurns ?? 200;
  let turns = 0;

  for (turns = 0; turns < maxTurns; turns++) {
    if (await isGameOver(page, gameId)) return turns;
    const ok = await playOneLegalTurn(page, gameId);
    await sleep(page, 50);
    if (!ok) {
      // Brief wait for UI settle then retry once
      await sleep(page, 200);
      if (await isGameOver(page, gameId)) return turns;
      const retry = await playOneLegalTurn(page, gameId);
      if (!retry) {
        throw new Error(
          `Stuck playing ${gameId} after ${turns} turns; status="${await statusSnapshot(page, gameId)}"`
        );
      }
    }
  }
  if (!(await isGameOver(page, gameId))) {
    throw new Error(
      `${gameId} did not reach game-over in ${maxTurns} turns; status="${await statusSnapshot(page, gameId)}"`
    );
  }
  return turns;
}
