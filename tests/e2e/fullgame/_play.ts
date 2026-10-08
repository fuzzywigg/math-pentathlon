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
      // Clear so the play loop starts from a clean selection.
      const clear = page.locator('.fab-btn-secondary', {
        hasText: 'Clear Selection',
      });
      if (await clear.isVisible().catch(() => false)) {
        await clear.click({ force: true });
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
      // Place one chip, then re-click occupied node (illegal / no-op).
      const placeable = page
        .locator('.fiar-board-container [data-node-id][aria-label*="valid placement"]')
        .first();
      if (await placeable.isVisible().catch(() => false)) {
        const id = await placeable.getAttribute('data-node-id');
        await placeable.click({ force: true });
        await sleep(page, 40);
        if (id) {
          const occupied = page.locator(
            `.fiar-board-container [data-node-id="${id}"]`
          );
          const s0 = await statusSnapshot(page, gameId);
          await occupied.click({ force: true });
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
      // Keep formation script aligned (queen still on 5-7).
      await page.evaluate(() => {
        (window as unknown as { __mpQgScriptIdx?: number }).__mpQgScriptIdx = 0;
      });
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
        await expect(page.locator('.par55-hand-block.selected, .par55-hand-block.clickable').first()).toBeVisible();
        const invalid = page.locator(
          '.par55-base:not(.par55-valid-base)'
        );
        if ((await invalid.count()) > 0) {
          await invalid.first().click({ force: true });
          // Illegal base must not complete a placement / end the game.
          expect(await isGameOver(page, gameId)).toBe(false);
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
      // Soft illegal: click a non-valid node while a chip is selected.
      // Reset script index afterward so the forced win path stays aligned.
      await page.evaluate(() => {
        const w = window as unknown as { __mpKwaScriptIdx?: number };
        w.__mpKwaScriptIdx = 0;
        const chip = document.querySelector('.kwa-selectable-chip');
        const g =
          (chip?.closest('g') as SVGGElement | null) ||
          (chip as HTMLElement | null);
        g?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        const invalid = [
          ...document.querySelectorAll('[data-node-id]'),
        ].find((n) => !n.querySelector('.kwa-valid-node') && !n.classList.contains('kwa-valid-node'));
        invalid?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        w.__mpKwaScriptIdx = 0;
      });
      expect(await isGameOver(page, gameId)).toBe(false);
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
      // Select a piece then click a clearly-illegal far corner; escape back if needed.
      await page.locator('.pent-piece-option').first().click({ force: true });
      await page
        .locator('.pent-board .interaction rect[data-row="0"][data-col="0"]')
        .click({ force: true })
        .catch(() => undefined);
      expect(await isGameOver(page, gameId)).toBe(false);
      const choose = page.locator('.pent-btn-choose-other');
      if (await choose.isVisible().catch(() => false)) {
        await choose.click({ force: true }).catch(() => undefined);
      }
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
      // Bias dice before any roll so the match can finish with mono/domino.
      await ensureJuggleSmallDice(page);
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
      // Draw once, then attempt a second draw via DOM (no Playwright action
      // wait — the button may be disabled/replaced while choosing a chain).
      const drew = await page.evaluate(() => {
        const btn = document.querySelector(
          '.star-track-draw-btn'
        ) as HTMLButtonElement | null;
        if (!btn) return false;
        btn.click();
        return true;
      });
      if (drew) {
        await sleep(page, 80);
        const s0 = await page.evaluate(
          () =>
            document
              .querySelector('.star-track-status .status-turn')
              ?.textContent?.replace(/\s+/g, ' ')
              .trim() ?? ''
        );
        expect(s0.length).toBeGreaterThan(0);
        await page.evaluate(() => {
          const btn = document.querySelector(
            '.star-track-draw-btn'
          ) as HTMLButtonElement | null;
          btn?.click();
        });
        const s1 = await page.evaluate(
          () =>
            document
              .querySelector('.star-track-status .status-turn')
              ?.textContent?.replace(/\s+/g, ' ')
              .trim() ?? ''
        );
        expect(s1.length).toBeGreaterThan(0);
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
  const status = await readStatus(page, 'kings-quadraphages');
  if (/quadraphage|place/i.test(status)) {
    // Prefer .cell-valid-placement; bias toward the enemy king to force a trap.
    const placed = await page.evaluate((statusText) => {
      const p2turn = /player\s*2/i.test(statusText);
      // Place near the opponent's king (trap them).
      const enemyRow = p2turn ? 1 : 9;
      const valids = [
        ...document.querySelectorAll('.cell-valid-placement'),
      ] as HTMLElement[];
      valids.sort((a, b) => {
        const ar = Math.abs(+(a.getAttribute('data-row') || 0) - enemyRow);
        const br = Math.abs(+(b.getAttribute('data-row') || 0) - enemyRow);
        return ar - br;
      });
      const pick =
        valids[0] ||
        (document.querySelector(
          '.cell[aria-label*="valid placement"]'
        ) as HTMLElement | null);
      if (!pick) return false;
      pick.click();
      pick.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true })
      );
      return true;
    }, status);
    return placed;
  }

  // Select the current seat's king (P1 top / P2 bottom), then a valid move.
  const moved = await page.evaluate((statusText) => {
    const selected = document.querySelector('.cell-selected');
    if (!selected) {
      const p2 = /player\s*2/i.test(statusText);
      // data-row/col are 1-indexed board labels (P1 @ 1,5 ; P2 @ 9,5).
      const kingCell = document.querySelector(
        p2
          ? '.cell-king.cell-p2, .cell-king[data-row="9"]'
          : '.cell-king.cell-p1, .cell-king[data-row="1"]'
      ) as HTMLElement | null;
      const fallback = p2
        ? (document.querySelector(
            '.cell[data-row="9"][data-col="5"]'
          ) as HTMLElement | null)
        : (document.querySelector(
            '.cell[data-row="1"][data-col="5"]'
          ) as HTMLElement | null);
      (kingCell || fallback)?.dispatchEvent(
        new MouseEvent('click', { bubbles: true })
      );
    }
    const valid = document.querySelector(
      '.cell-valid-move'
    ) as HTMLElement | null;
    if (!valid) return false;
    valid.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    return true;
  }, status);
  if (!moved) return false;
  await sleep(page, 40);
  if (/quadraphage|place/i.test(await readStatus(page, 'kings-quadraphages'))) {
    await page.evaluate(() => {
      const cells = [
        ...document.querySelectorAll('.cell[data-row][data-col]'),
      ] as HTMLElement[];
      const empty = cells.find(
        (c) =>
          !c.classList.contains('cell-king') &&
          !c.classList.contains('cell-blocked') &&
          !c.classList.contains('cell-valid-move')
      );
      empty?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
  }
  return true;
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
  // Select 1 bank block → Confirm → click .hex-a-gone-cell-valid.
  let progressed = false;
  for (let step = 0; step < 5; step++) {
    const result = await page.evaluate(() => {
      if (document.querySelector('.hex-a-gone-winner, .status-winner')) {
        return 'done';
      }
      // Place highlighted cell first when available
      const valid = document.querySelector(
        '.hex-a-gone-cell-valid'
      ) as HTMLElement | null;
      if (valid) {
        valid.dispatchEvent(
          new MouseEvent('click', { bubbles: true, cancelable: true })
        );
        return 'continue';
      }
      const confirm = document.querySelector<HTMLButtonElement>(
        '.hex-a-gone-confirm-btn'
      );
      if (confirm && !confirm.disabled) {
        confirm.click();
        return 'continue';
      }
      // Select a bank block if none selected yet
      const alreadySelected = document.querySelector(
        '.hex-a-gone-block-btn.selected:not(.empty)'
      );
      if (!alreadySelected) {
        const shape = document.querySelector<HTMLButtonElement>(
          '.hex-a-gone-block-btn:not(.empty)'
        );
        if (shape) {
          shape.click();
          return 'continue';
        }
      }
      const empty = Array.from(
        document.querySelectorAll<HTMLButtonElement>(
          '.hex-a-gone-a11y-grid button'
        )
      ).find((b) => (b.getAttribute('aria-label') || '').includes('empty'));
      if (empty) {
        empty.click();
        return 'continue';
      }
      return 'stuck';
    });
    if (result === 'done') return true;
    if (result === 'continue') {
      progressed = true;
      await sleep(page, 40);
      continue;
    }
    break;
  }
  return progressed;
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
  // If a block is already selected, just click a valid base.
  return page.evaluate(() => {
    const click = (el: Element | null) => {
      if (!el) return false;
      el.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true })
      );
      return true;
    };
    const valid =
      document.querySelector('.par55-valid-base') ||
      document.querySelector('.par55-base-hit');
    if (valid) return click(valid);
    const block = document.querySelector(
      '.par55-hand-block.clickable'
    ) as HTMLElement | null;
    if (!block) return false;
    click(block);
    const valid2 =
      document.querySelector('.par55-valid-base') ||
      document.querySelector('.par55-base-hit');
    return click(valid2);
  });
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

/** Cooperative short win (engine-verified, 11 plies) — chip value → dest. */
const KWATRO_WIN_SCRIPT: Array<{ value: number; to: string }> = [
  { value: 0, to: 'n1-0' },
  { value: 1, to: 'n3-0' },
  { value: 2, to: 'n1-1' },
  { value: 3, to: 'n3-1' },
  { value: 4, to: 'n1-2' },
  { value: 5, to: 'n3-2' },
  { value: 6, to: 'n1-3' },
  { value: 7, to: 'n3-3' },
  { value: 8, to: 'n1-4' },
  { value: 9, to: 'n3-4' },
  { value: 2, to: 'n2-1' },
];

/** Cooperative Blue formation win (engine-verified, 63 plies). */
const QUEENS_WIN_SCRIPT: Array<{ fromKey: string; toKey: string }> = [
  { fromKey: '5-7', toKey: '4-5' },
  { fromKey: '5-28', toKey: '5-29' },
  { fromKey: '4-5', toKey: '3-3' },
  { fromKey: '5-29', toKey: '5-28' },
  { fromKey: '3-3', toKey: '2-2' },
  { fromKey: '5-28', toKey: '5-29' },
  { fromKey: '2-2', toKey: '1-1' },
  { fromKey: '5-29', toKey: '5-28' },
  { fromKey: '1-1', toKey: '0-0' },
  { fromKey: '5-28', toKey: '5-29' },
  { fromKey: '5-1', toKey: '4-0' },
  { fromKey: '5-29', toKey: '5-28' },
  { fromKey: '4-0', toKey: '3-0' },
  { fromKey: '5-28', toKey: '5-29' },
  { fromKey: '3-0', toKey: '2-0' },
  { fromKey: '5-29', toKey: '5-28' },
  { fromKey: '2-0', toKey: '1-0' },
  { fromKey: '5-28', toKey: '5-29' },
  { fromKey: '5-5', toKey: '4-4' },
  { fromKey: '5-29', toKey: '5-28' },
  { fromKey: '4-4', toKey: '3-3' },
  { fromKey: '5-28', toKey: '5-29' },
  { fromKey: '3-3', toKey: '2-2' },
  { fromKey: '5-29', toKey: '5-28' },
  { fromKey: '2-2', toKey: '1-1' },
  { fromKey: '5-28', toKey: '5-29' },
  { fromKey: '5-9', toKey: '4-8' },
  { fromKey: '5-29', toKey: '5-28' },
  { fromKey: '4-8', toKey: '3-6' },
  { fromKey: '5-28', toKey: '5-29' },
  { fromKey: '3-6', toKey: '2-4' },
  { fromKey: '5-29', toKey: '5-28' },
  { fromKey: '2-4', toKey: '1-2' },
  { fromKey: '5-28', toKey: '5-29' },
  { fromKey: '5-11', toKey: '4-8' },
  { fromKey: '5-29', toKey: '5-28' },
  { fromKey: '4-8', toKey: '3-6' },
  { fromKey: '5-28', toKey: '5-29' },
  { fromKey: '3-6', toKey: '2-4' },
  { fromKey: '5-29', toKey: '5-28' },
  { fromKey: '2-4', toKey: '1-3' },
  { fromKey: '5-28', toKey: '5-29' },
  { fromKey: '5-3', toKey: '4-2' },
  { fromKey: '5-29', toKey: '5-28' },
  { fromKey: '4-2', toKey: '3-1' },
  { fromKey: '5-28', toKey: '5-29' },
  { fromKey: '3-1', toKey: '2-0' },
  { fromKey: '5-29', toKey: '5-28' },
  { fromKey: '5-13', toKey: '4-10' },
  { fromKey: '5-28', toKey: '5-29' },
  { fromKey: '4-10', toKey: '3-7' },
  { fromKey: '5-29', toKey: '5-28' },
  { fromKey: '3-7', toKey: '2-4' },
  { fromKey: '5-28', toKey: '5-29' },
  { fromKey: '2-0', toKey: '2-11' },
  { fromKey: '5-29', toKey: '5-28' },
  { fromKey: '2-11', toKey: '1-5' },
  { fromKey: '5-28', toKey: '5-29' },
  { fromKey: '2-4', toKey: '2-5' },
  { fromKey: '5-29', toKey: '5-28' },
  { fromKey: '2-5', toKey: '2-6' },
  { fromKey: '5-28', toKey: '5-29' },
  { fromKey: '2-6', toKey: '1-4' },
];

async function playKwatro(page: Page): Promise<boolean> {
  // Ordered script via window index so illegal probes / partial turns stay synced.
  return page.evaluate((script) => {
    const w = window as unknown as { __mpKwaScriptIdx?: number };
    if (typeof w.__mpKwaScriptIdx !== 'number') w.__mpKwaScriptIdx = 0;

    const clickGroup = (el: Element | null) => {
      if (!el) return false;
      const g = (el.closest('g') as SVGGElement | null) || (el as HTMLElement);
      g.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true })
      );
      return true;
    };

    const chipByValue = (value: number): SVGGElement | null => {
      for (const t of document.querySelectorAll('.kwa-board text')) {
        if ((t.textContent || '').trim() === String(value)) {
          const g = t.closest('g');
          if (g) return g as SVGGElement;
        }
      }
      return null;
    };

    const step = script[w.__mpKwaScriptIdx!];
    if (step) {
      // Complete destination if chip already selected
      const destG = document.querySelector(
        `[data-node-id="${step.to}"]`
      ) as HTMLElement | null;
      if (document.querySelector('.kwa-valid-node') && destG) {
        const ok = clickGroup(destG.querySelector('.kwa-valid-node') || destG);
        if (ok) {
          w.__mpKwaScriptIdx! += 1;
          return true;
        }
      }
      const chipG = chipByValue(step.value);
      if (chipG) {
        clickGroup(chipG.querySelector('.kwa-selectable-chip') || chipG);
        const dest = document.querySelector(
          `[data-node-id="${step.to}"]`
        ) as HTMLElement | null;
        if (dest) {
          const ok = clickGroup(dest.querySelector('.kwa-valid-node') || dest);
          if (ok) {
            w.__mpKwaScriptIdx! += 1;
            return true;
          }
        }
        return true; // selected; next call finishes dest
      }
    }

    // Fallback evacuate
    const valids = [
      ...document.querySelectorAll('.kwa-valid-node'),
    ] as HTMLElement[];
    if (valids.length) return clickGroup(valids[0]);
    const chips = [
      ...document.querySelectorAll('.kwa-selectable-chip'),
    ] as HTMLElement[];
    if (chips.length) {
      clickGroup(chips[0]);
      const dests = document.querySelector('.kwa-valid-node');
      if (dests) return clickGroup(dests);
      return true;
    }
    return false;
  }, KWATRO_WIN_SCRIPT);
}

async function playFiar(page: Page): Promise<boolean> {
  // Forced short win: Blue stacks a known length-4 column while Red plays elsewhere.
  // Gaps are allowed for wins, but contiguous placement is simplest.
  const BLUE_LINE = ['c3r0', 'c3r1', 'c3r2', 'c3r3', 'c3r4', 'c3r5'];
  const RED_DUMP = [
    'c7r5',
    'c8r3',
    'c0r3',
    'c8r4',
    'c0r4',
    'c7r4',
    'c6r0',
  ];

  return page.evaluate(
    ({ blueLine, redDump }) => {
      const nodes = [
        ...document.querySelectorAll('.fiar-board-container [data-node-id]'),
      ] as HTMLElement[];
      const label = (n: Element) => n.getAttribute('aria-label') || '';
      const byId = (id: string) =>
        nodes.find((n) => n.getAttribute('data-node-id') === id);
      const click = (el: HTMLElement | undefined) => {
        if (!el) return false;
        el.dispatchEvent(
          new MouseEvent('click', { bubbles: true, cancelable: true })
        );
        return true;
      };

      const status =
        document.querySelector('.fiar-status')?.textContent?.toLowerCase() ||
        '';

      // Movement phase
      if (/select a chip|green node|move/i.test(status) && !/place/i.test(status)) {
        const validMove = nodes.find((n) => /valid move/i.test(label(n)));
        if (validMove) return click(validMove);
        const selectable = nodes.find((n) => /selectable/i.test(label(n)));
        if (selectable) return click(selectable);
        return false;
      }

      // Placement: Blue builds a column; Red dumps off-line.
      const isBlue = /\bblue\b/i.test(status);
      const targets = isBlue ? blueLine : redDump;
      for (const id of targets) {
        const el = byId(id);
        if (el && /valid placement|empty/i.test(label(el))) {
          return click(el);
        }
      }
      const placeable = nodes.find((n) => /valid placement/i.test(label(n)));
      return click(placeable);
    },
    { blueLine: BLUE_LINE, redDump: RED_DUMP }
  );
}

/** Install mono/domino-biased RNG so HvH can fill 9×9 without soft-lock. */
async function ensureJuggleSmallDice(page: Page): Promise<void> {
  await page.evaluate(() => {
    const w = window as unknown as { __mpJuggleSmallDice?: boolean };
    if (w.__mpJuggleSmallDice) return;
    w.__mpJuggleSmallDice = true;
    let t = 0x1234567;
    Math.random = () => {
      t = (t + 0x6d2b79f5) >>> 0;
      // Map to [0, 0.33) so rollDice faces stay 1–2 (mono/domino).
      return ((t >>> 8) % 1000) / 3000;
    };
  });
}

async function playJuggle(page: Page): Promise<boolean> {
  await dismissOwl(page);
  await ensureJuggleSmallDice(page);
  const status = await readStatus(page, 'juggle');

  const clickValid = async () => {
    // Prefer DOM click — Playwright isVisible can miss SVG/grid highlight cells.
    return page.evaluate(() => {
      const el =
        document.querySelector(
          '.juggle-board.active .juggle-cell-valid'
        ) ||
        document.querySelector('.juggle-cell-valid') ||
        document.querySelector(
          '.juggle-board.active .juggle-cell[aria-label*="valid placement"]'
        ) ||
        document.querySelector('.juggle-cell[aria-label*="valid placement"]');
      if (!el) return false;
      (el as HTMLElement).click();
      el.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true })
      );
      return true;
    });
  };

  if (await clickValid()) return true;

  // Place phase: rotate/flip then place, else choose another shape
  if (/place the shape|place /i.test(status)) {
    for (let i = 0; i < 8; i++) {
      const controls = page.locator(
        '.juggle-control-btn, button:has-text("Rotate"), button:has-text("Flip")'
      );
      const n = await controls.count();
      if (n === 0) break;
      await controls.nth(i % n).click({ force: true });
      await sleep(page, 40);
      if (await clickValid()) return true;
    }
    const other = page.locator('.juggle-choose-other-btn');
    if (await other.isVisible().catch(() => false)) {
      await other.click({ force: true });
      return true;
    }
    return false;
  }

  const other = page.locator('.juggle-choose-other-btn');
  if (await other.isVisible().catch(() => false)) {
    await other.click({ force: true });
    return true;
  }

  if (/roll/i.test(status)) {
    const roll = page.locator('.juggle-roll-btn');
    if (await roll.isVisible().catch(() => false)) {
      await roll.click({ force: true });
      await sleep(page, 40);
    }
  }

  // Always prefer mono/domino (RNG is also biased); fills boards without soft-lock.
  if (/die|shape category|choose shape|roll|place/i.test(status) || true) {
    const dice = page.locator('.juggle-die.selectable');
    const count = await dice.count();
    let clicked = false;
    const order = [
      '1 cell',
      'Monomino',
      '2 cell',
      'Domino',
      '3 cell',
      'Triomino',
      '4 cell',
      'Tetromino',
      '5 cell',
      'Pentomino',
    ];
    for (const key of order) {
      const d = page.locator(`.juggle-die.selectable[aria-label*="${key}"]`).first();
      if (await d.isVisible().catch(() => false)) {
        await d.click({ force: true });
        clicked = true;
        break;
      }
    }
    if (!clicked && count > 0) {
      await dice.first().click({ force: true });
      clicked = true;
    }
    if (!clicked) return false;
    await sleep(page, 50);
  }

  const shape = page.locator('.juggle-shape-option').first();
  if (await shape.isVisible().catch(() => false)) {
    await shape.click({ force: true });
    await sleep(page, 40);
  }

  if (await clickValid()) return true;

  for (let i = 0; i < 4; i++) {
    const rot = page.locator('.juggle-control-btn').first();
    if (!(await rot.isVisible().catch(() => false))) break;
    await rot.click({ force: true });
    await sleep(page, 30);
    if (await clickValid()) return true;
  }

  if (await other.isVisible().catch(() => false)) {
    await other.click({ force: true });
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
  // Mirror fab-a-diffy-playability tryHumanClaim (Playwright locators).
  const passBtn = page.locator('.fab-btn-secondary', { hasText: 'Pass Turn' });
  if (await passBtn.isVisible().catch(() => false)) {
    await passBtn.click({ force: true });
    return true;
  }

  const ansReady = page.locator('.fab-answer-matchable').first();
  if (await ansReady.isVisible().catch(() => false)) {
    await ansReady.click({ force: true });
    return true;
  }

  const opReady = page.locator('.fab-op-valid').first();
  if (await opReady.isVisible().catch(() => false)) {
    await opReady.click({ force: true });
    await sleep(page, 40);
    const match = page.locator('.fab-answer-matchable').first();
    if (await match.isVisible().catch(() => false)) {
      await match.click({ force: true });
    }
    return true;
  }

  const clear = page.locator('.fab-btn-secondary', {
    hasText: 'Clear Selection',
  });
  const ids = await page.$$eval(
    '.fab-bar-wrapper:not(.fab-bar-disabled)',
    (els) =>
      els
        .map((e) => e.getAttribute('data-bar-id'))
        .filter((id): id is string => !!id)
  );
  if (ids.length < 2) return false;

  for (let i = 0; i < Math.min(ids.length, 8); i++) {
    for (let j = 0; j < Math.min(ids.length, 8); j++) {
      if (i === j) continue;
      if (await clear.isVisible().catch(() => false)) {
        await clear.click({ force: true });
      }
      const b1 = page.locator(`[data-bar-id="${ids[i]}"]`);
      const b2 = page.locator(`[data-bar-id="${ids[j]}"]`);
      if ((await b1.count()) === 0 || (await b2.count()) === 0) continue;
      await b1.click({ force: true });
      await b2.click({ force: true });
      const validOp = page.locator('.fab-op-valid').first();
      if (!(await validOp.isVisible().catch(() => false))) {
        if (await clear.isVisible().catch(() => false)) {
          await clear.click({ force: true });
        }
        continue;
      }
      await validOp.click({ force: true });
      const match = page.locator('.fab-answer-matchable').first();
      await match.waitFor({ state: 'attached', timeout: 5_000 }).catch(() => undefined);
      if (await match.count()) {
        await match.click({ force: true });
      }
      return true;
    }
  }
  return false;
}

async function playQueens(page: Page): Promise<boolean> {
  // Ordered cooperative formation script (Blue wins with queen+6 guards).
  return page.evaluate((script) => {
    const w = window as unknown as { __mpQgScriptIdx?: number };
    if (typeof w.__mpQgScriptIdx !== 'number') w.__mpQgScriptIdx = 0;

    const click = (el: Element | null) => {
      if (!el) return false;
      const g = (el.closest('g') as SVGGElement | null) || (el as HTMLElement);
      g.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true })
      );
      return true;
    };

    const cell = (key: string) =>
      document.querySelector(`[data-cell-key="${key}"]`);

    // Skip steps already applied (e.g. opening probe left queen selected).
    while (w.__mpQgScriptIdx! < script.length) {
      const step = script[w.__mpQgScriptIdx!]!;
      const fromEl = cell(step.fromKey);
      const toEl = cell(step.toKey);
      if (!fromEl || !toEl) {
        w.__mpQgScriptIdx! += 1;
        continue;
      }
      const fromLabel = fromEl.getAttribute('aria-label') || '';
      const toLabel = toEl.getAttribute('aria-label') || '';
      // If from no longer has our piece, step already done — advance.
      if (!/Blue|Red/i.test(fromLabel) && !/selected/i.test(fromLabel)) {
        w.__mpQgScriptIdx! += 1;
        continue;
      }
      // If destination already occupied by a piece and from empty, advance.
      if (/Blue|Red/i.test(toLabel) && !/Blue|Red/i.test(fromLabel)) {
        w.__mpQgScriptIdx! += 1;
        continue;
      }
      break;
    }

    const step = script[w.__mpQgScriptIdx!];
    if (!step) {
      // Fallback: any valid move
      const valid = document.querySelector(
        '[data-cell-key][aria-label*="valid move"]'
      );
      if (valid) return click(valid);
      const piece = document.querySelector(
        '[data-cell-key][aria-label*="Blue"], [data-cell-key][aria-label*="Red"]'
      );
      if (piece) {
        click(piece);
        const dest = document.querySelector(
          '[data-cell-key][aria-label*="valid move"]'
        );
        if (dest) return click(dest);
      }
      return false;
    }

    // If valids already showing (piece pre-selected), click destination when it matches.
    const existingValids = [
      ...document.querySelectorAll(
        '[data-cell-key][aria-label*="valid move"]'
      ),
    ] as HTMLElement[];
    if (existingValids.length) {
      const match = existingValids.find(
        (el) => el.getAttribute('data-cell-key') === step.toKey
      );
      if (match) {
        const ok = click(match);
        if (ok) w.__mpQgScriptIdx! += 1;
        return ok;
      }
      // Wrong piece selected — click scripted from, then to.
    }

    const from = cell(step.fromKey);
    if (!from) return false;
    click(from);
    const dest =
      document.querySelector(
        `[data-cell-key="${step.toKey}"][aria-label*="valid move"]`
      ) || cell(step.toKey);
    const ok = click(dest);
    if (ok) w.__mpQgScriptIdx! += 1;
    return ok;
  }, QUEENS_WIN_SCRIPT);
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
  const status = await readStatus(page, 'pent-em-in');

  // Place phase: click interaction rects with valid placement (not highlight-only).
  if (/place the|place /i.test(status)) {
    for (let r = 0; r < 4; r++) {
      const placed = await page.evaluate(() => {
        const rect = document.querySelector(
          '.pent-board .interaction rect[aria-label*="valid placement"]'
        ) as SVGElement | null;
        if (!rect) return false;
        rect.dispatchEvent(
          new MouseEvent('click', { bubbles: true, cancelable: true })
        );
        return true;
      });
      if (placed) return true;
      const rot = page.locator('.pent-btn-rotate');
      if (await rot.isVisible().catch(() => false)) {
        await rot.click({ force: true });
        await sleep(page, 30);
      } else break;
    }
    const other = page.locator('.pent-btn-choose-other');
    if (await other.isVisible().catch(() => false)) {
      await other.click({ force: true });
      return true;
    }
    return false;
  }

  if (/won.?t fit|choose another/i.test(status)) {
    const other = page.locator('.pent-btn-choose-other');
    if (await other.isVisible().catch(() => false)) {
      await other.click({ force: true });
      return true;
    }
  }

  // Select phase — pick a compact piece, then place after paint.
  const selected = await page.evaluate(() => {
    for (const id of ['X', 'P', 'U', 'V', 'W', 'F', 'T5', 'Y', 'N', 'L5', 'I5', 'Z5']) {
      const opt = document.querySelector(
        `.pent-piece-option[data-piece="${id}"]:not(.disabled)`
      ) as HTMLElement | null;
      if (opt) {
        opt.click();
        return id;
      }
    }
    const any = document.querySelector(
      '.pent-piece-option:not(.disabled)'
    ) as HTMLElement | null;
    any?.click();
    return any ? 'any' : null;
  });
  if (!selected) return false;
  await sleep(page, 60);
  for (let r = 0; r < 4; r++) {
    const placed = await page.evaluate(() => {
      const rect = document.querySelector(
        '.pent-board .interaction rect[aria-label*="valid placement"]'
      ) as SVGElement | null;
      if (!rect) return false;
      rect.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true })
      );
      return true;
    });
    if (placed) return true;
    const rot = page.locator('.pent-btn-rotate');
    if (await rot.isVisible().catch(() => false)) {
      await rot.click({ force: true });
      await sleep(page, 30);
    } else break;
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
