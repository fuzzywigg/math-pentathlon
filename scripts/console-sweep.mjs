/**
 * One-off Playwright console sweep: load each available game, play a few
 * human moves (vs-AI when possible), capture console + unhandled rejections.
 * Writes JSON to /opt/cursor/artifacts/console-sweep-raw.json
 */
import { chromium } from '@playwright/test';
import { createRequire } from 'module';
import { writeFileSync, mkdirSync } from 'fs';

const require = createRequire(import.meta.url);
// Pull game ids from compiled-ish source via dynamic import of TS is hard;
// hardcode from registry (available:true).
const GAMES = [
  'kings-quadraphages',
  'hex',
  'star-track',
  'hex-a-gone',
  'calla',
  'sum-dominoes',
  'par-55',
  'ramrod',
  'kwatro-sinko',
  'fiar',
  'juggle',
  'contig-60',
  'stars-bars',
  'fab-a-diffy',
  'queens-guards',
  'prime-gold',
  'remainder-islands',
  'pent-em-in',
  'frac-fact',
  'fraction-pinball',
];

const BASE = process.env.BASE_URL || 'http://localhost:5173';
const OUT =
  process.env.SWEEP_OUT || '/opt/cursor/artifacts/console-sweep-raw.json';

async function dismissOwl(page) {
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
    if (el) el.style.pointerEvents = 'none';
  });
}

async function waitReady(page) {
  await page
    .getByTestId('game-loading')
    .waitFor({ state: 'hidden', timeout: 20_000 })
    .catch(() => {});
  await page.locator('#new-game-btn, h1').first().waitFor({
    state: 'visible',
    timeout: 20_000,
  });
}

async function startVsAi(page) {
  await dismissOwl(page);
  await page.locator('#new-game-btn').click();
  const modal = page.locator('#new-game-modal');
  await modal.waitFor({ state: 'visible', timeout: 10_000 });
  await page.locator('.mode-option[data-mode="human-vs-ai"]').click();
  const easy = page.locator('.difficulty-btn.easy');
  if (await easy.isVisible().catch(() => false)) await easy.click();
  await page.locator('#start-game-btn').click();
  await page.waitForTimeout(300);
  await dismissOwl(page);
}

async function playMoves(page, gameId, moves = 2) {
  for (let i = 0; i < moves; i++) {
    try {
      switch (gameId) {
        case 'kings-quadraphages':
          await page
            .locator('.cell[data-row="1"][data-col="5"]')
            .click({ force: true });
          await page
            .locator('.cell[data-row="2"][data-col="5"]')
            .click({ force: true });
          await page
            .locator('.cell[data-row="5"][data-col="5"]')
            .click({ force: true });
          break;
        case 'hex':
          await page
            .locator(`.hex-cell-group[data-row="${4 + i}"][data-col="${4 + i}"]`)
            .click({ force: true });
          break;
        case 'star-track':
          await page.locator('.star-track-draw-btn').click({ force: true });
          await page.locator('.star-track-chain-btn').first().click({ force: true });
          break;
        case 'hex-a-gone': {
          const bank = page.locator('.hex-a-gone-block-btn:not(.empty)').first();
          if (await bank.count()) await bank.click({ force: true });
          const confirm = page.locator('.hex-a-gone-confirm-btn');
          if (await confirm.isVisible().catch(() => false))
            await confirm.click({ force: true });
          const cell = page
            .locator('.hex-a-gone-board [data-q], .hex-a-gone-cell')
            .nth(i);
          if (await cell.count()) await cell.click({ force: true });
          break;
        }
        case 'calla': {
          const pit = page.locator('.calla-pit-valid').first();
          if (await pit.count()) await pit.click({ force: true });
          else await page.locator('.calla-pit').first().click({ force: true });
          break;
        }
        case 'sum-dominoes': {
          await page.locator('.sd-roll-btn').click({ force: true });
          const playable = page.locator('.sd-hand-domino-playable');
          const pass = page.locator('.sd-pass-btn');
          if ((await playable.count()) > 0) {
            await playable.first().click({ force: true });
            const valid = page.locator('.sd-cell-valid');
            if ((await valid.count()) > 0)
              await valid.first().click({ force: true });
          } else if (await pass.isVisible().catch(() => false)) {
            await pass.click({ force: true });
          }
          break;
        }
        case 'par-55': {
          const block = page.locator('.par55-hand-block.clickable').first();
          if (await block.count()) await block.click({ force: true });
          const base = page.locator('.par55-valid-base').first();
          if (await base.count()) await base.click({ force: true });
          break;
        }
        case 'ramrod': {
          const rod = page.locator('.ramrod-rod-wrapper.selectable').first();
          if (await rod.count()) {
            await rod.evaluate((el) => el.click());
            const slot = page.locator('.ramrod-slot.valid').first();
            if (await slot.count()) await slot.click({ force: true });
          }
          break;
        }
        case 'kwatro-sinko': {
          const chip = page.locator('.kwa-selectable-chip').first();
          if (await chip.count()) await chip.click({ force: true });
          const dest = page.locator('.kwa-valid-node').first();
          if (await dest.count()) await dest.click({ force: true });
          break;
        }
        case 'fiar':
          await page
            .locator('.fiar-board-container [data-node-id]')
            .nth(i)
            .click({ force: true });
          break;
        case 'juggle': {
          await dismissOwl(page);
          await page.locator('.juggle-roll-btn').click({ force: true });
          const die = page.locator('.juggle-die.selectable').first();
          if (await die.count()) await die.click({ force: true });
          const shape = page.locator('.juggle-shape-option').first();
          if (await shape.count()) await shape.click({ force: true });
          const cell = page.locator(
            `.juggle-board.player1 .juggle-cell[data-row="0"][data-col="${i}"]`
          );
          if (await cell.count())
            await cell.evaluate((el) => el.click());
          break;
        }
        case 'contig-60': {
          await page.locator('.contig-roll-btn').click({ force: true });
          const valid = page.locator('.contig-cell-valid');
          const pass = page.locator('.contig-pass-btn');
          if ((await valid.count()) > 0)
            await valid.first().click({ force: true });
          else if (await pass.isVisible().catch(() => false))
            await pass.click({ force: true });
          break;
        }
        case 'stars-bars': {
          const card = page.locator('.stars-card:not(.disabled)').first();
          if (await card.count()) await card.click({ force: true });
          const cell = page.locator('.stars-cell.valid').first();
          if (await cell.count()) await cell.click({ force: true });
          break;
        }
        case 'fab-a-diffy': {
          const bar = page
            .locator('.fab-bar-wrapper:not(.fab-bar-disabled)')
            .first();
          if (await bar.count()) await bar.click({ force: true });
          const op = page
            .locator('.fab-op-valid, .fab-op-btn:not(.fab-op-disabled)')
            .first();
          if (await op.count()) await op.click({ force: true });
          break;
        }
        case 'queens-guards': {
          await page.locator('[data-cell-key="5-7"]').click({ force: true });
          const dest = page
            .locator('[data-cell-key][aria-label*="valid move"]')
            .first();
          if (await dest.count()) await dest.click({ force: true });
          break;
        }
        case 'prime-gold': {
          await page
            .locator('.pg-roll-btn, .prime-roll-btn')
            .first()
            .click({ force: true });
          const valid = page
            .locator('.pg-cell.valid, .prime-cell.valid')
            .first();
          const pass = page.locator(
            '.pg-btn-secondary, .pg-pass-btn, button:has-text("Pass")'
          );
          if (await valid.count()) await valid.click({ force: true });
          else if (await pass.first().isVisible().catch(() => false))
            await pass.first().click({ force: true });
          break;
        }
        case 'remainder-islands': {
          await dismissOwl(page);
          await page
            .locator('.remainder-btn-roll, button:has-text("Roll")')
            .first()
            .click({ force: true });
          const island = page.locator('.island.valid').first();
          if (await island.count()) {
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
          }
          break;
        }
        case 'pent-em-in': {
          await page.locator('.pent-piece-option').first().click({ force: true });
          const cell = page
            .locator('.pent-board .interaction rect, .pent-board rect[data-row]')
            .nth(i);
          if (await cell.count()) await cell.click({ force: true });
          break;
        }
        case 'frac-fact': {
          await page.locator('.frac-choice-btn').first().click({ force: true });
          const cont = page.locator(
            '.frac-continue-btn, button:has-text("Continue")'
          );
          if (await cont.first().isVisible().catch(() => false))
            await cont.first().click();
          break;
        }
        case 'fraction-pinball': {
          await page
            .locator('.pinball-choice-btn')
            .first()
            .click({ force: true });
          const cont = page.locator(
            '.pinball-continue-btn, button:has-text("Continue")'
          );
          if (await cont.first().isVisible().catch(() => false))
            await cont.first().click();
          break;
        }
        default:
          break;
      }
      // Allow AI / animations to settle a bit
      await page.waitForTimeout(1200);
    } catch (err) {
      return `move ${i + 1} failed: ${err.message}`;
    }
  }
  return null;
}

async function sweepGame(browser, gameId) {
  const page = await browser.newPage();
  const messages = [];
  const pageErrors = [];
  const rejections = [];

  page.on('console', (msg) => {
    const type = msg.type();
    if (type === 'error' || type === 'warning') {
      messages.push({
        type,
        text: msg.text(),
        location: msg.location(),
      });
    }
  });
  page.on('pageerror', (err) => {
    pageErrors.push(String(err));
  });
  await page.addInitScript(() => {
    window.__sweepRejections = [];
    window.addEventListener('unhandledrejection', (e) => {
      window.__sweepRejections.push(String(e.reason));
    });
  });

  const result = {
    gameId,
    loadOk: false,
    playNote: null,
    console: messages,
    pageErrors,
    unhandledRejections: rejections,
  };

  try {
    await page.goto(`${BASE}/#/game/${gameId}`, { waitUntil: 'domcontentloaded' });
    await waitReady(page);
    result.loadOk = true;

    // Capture load-only snapshot
    result.loadConsole = [...messages];
    result.loadPageErrors = [...pageErrors];

    await startVsAi(page);
    result.playNote = await playMoves(page, gameId, 2);

    const clientRejections = await page.evaluate(
      () => window.__sweepRejections || []
    );
    rejections.push(...clientRejections);
  } catch (err) {
    result.loadOk = false;
    result.fatal = String(err);
  } finally {
    await page.close();
  }

  return result;
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const results = [];
  for (const id of GAMES) {
    console.error(`Sweeping ${id}…`);
    const r = await sweepGame(browser, id);
    results.push(r);
    const errCount =
      r.console.filter((m) => m.type === 'error').length +
      r.pageErrors.length +
      r.unhandledRejections.length;
    const warnCount = r.console.filter((m) => m.type === 'warning').length;
    console.error(
      `  loadOk=${r.loadOk} errors=${errCount} warnings=${warnCount} play=${r.playNote || 'ok'}`
    );
  }
  await browser.close();
  mkdirSync('/opt/cursor/artifacts', { recursive: true });
  writeFileSync(OUT, JSON.stringify({ at: new Date().toISOString(), results }, null, 2));
  console.log(`Wrote ${OUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
