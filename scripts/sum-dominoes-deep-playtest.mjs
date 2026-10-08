/**
 * Headless Chromium deep playtest for Sum Dominoes.
 * Human vs AI · Easy/Medium/Hard · tablet (768×1024 touch) + desktop (1280×800).
 * Plays until winner banner / game-over status, stall, or turn budget.
 *
 * Usage: node scripts/sum-dominoes-deep-playtest.mjs
 * Requires Vite on http://127.0.0.1:5173
 */
import { chromium, devices } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const BASE = process.env.PLAYTEST_BASE || 'http://127.0.0.1:5173';
const OUT = path.resolve('docs/playtest/sum-dominoes-deep-2026-10-07');
const ART = '/opt/cursor/artifacts';
const GAMES_PER_DIFF = Number(process.env.SD_GAMES || 10);
const MAX_HUMAN_TURNS = 80;
const STALL_MS = 12_000;

fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(ART, { recursive: true });

const DIFFS = ['easy', 'medium', 'hard'];
const VIEWPORTS = [
  {
    name: 'tablet',
    ...devices['iPad Mini'],
    viewport: { width: 768, height: 1024 },
  },
  {
    name: 'desktop',
    viewport: { width: 1280, height: 800 },
    hasTouch: false,
    isMobile: false,
  },
];

async function dismissOwl(page) {
  const dismiss = page.locator(
    '#ollie-owl button[aria-label="Dismiss message"], #ollie-owl .owl-bubble-dismiss'
  );
  if (await dismiss.first().isVisible().catch(() => false)) {
    await dismiss.first().click({ force: true }).catch(() => {});
  }
  const minimize = page.locator('#ollie-owl .owl-minimize-btn');
  if (await minimize.isVisible().catch(() => false)) {
    await minimize.click({ force: true }).catch(() => {});
  }
  await page.evaluate(() => {
    const el = document.getElementById('ollie-owl');
    if (el) el.style.pointerEvents = 'none';
  });
}

async function startVsAi(page, difficulty) {
  await page.goto(`${BASE}/#/game/sum-dominoes`, { waitUntil: 'domcontentloaded' });
  await page.getByTestId('game-loading').waitFor({ state: 'hidden', timeout: 20_000 }).catch(() => {});
  await page.locator('.sd-board, #new-game-btn').first().waitFor({ timeout: 20_000 });
  await dismissOwl(page);
  await page.locator('#new-game-btn').click();
  const modal = page.locator('#new-game-modal');
  await modal.waitFor({ state: 'visible', timeout: 10_000 });
  await page.locator('.mode-option[data-mode="human-vs-ai"]').click();
  await page.locator(`.difficulty-btn.${difficulty}`).click();
  await page.locator('#start-game-btn').click();
  await expectHidden(modal);
  await dismissOwl(page);
  await page.locator('.sd-board').waitFor({ timeout: 10_000 });
}

async function expectHidden(locator) {
  await locator.waitFor({ state: 'hidden', timeout: 10_000 }).catch(async () => {
    // modal uses class "hidden"
    const cls = await locator.getAttribute('class');
    if (!cls?.includes('hidden')) throw new Error('modal still open');
  });
}

async function measureTargets(page) {
  return page.evaluate(() => {
    const box = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return {
        w: Math.round(r.width),
        h: Math.round(r.height),
        minOk: r.width >= 44 && r.height >= 44,
      };
    };
    const all = (sel) =>
      [...document.querySelectorAll(sel)].slice(0, 12).map((el) => {
        const r = el.getBoundingClientRect();
        return { w: Math.round(r.width), h: Math.round(r.height) };
      });
    return {
      roll: box('.sd-roll-btn'),
      pass: box('.sd-pass-btn'),
      handPlayable: all('.sd-hand-domino-playable'),
      handAny: all('.sd-hand-domino'),
      validCell: all('.sd-cell-valid'),
      cell: all('.sd-cell'),
      thinking: !!document.querySelector('.sd-computer-thinking'),
      status: document.querySelector('.sd-status')?.textContent?.trim() ?? '',
    };
  });
}

async function playHumanTurn(page) {
  const roll = page.locator('.sd-roll-btn');
  if (await roll.isVisible().catch(() => false)) {
    const disabled = await roll.isDisabled().catch(() => true);
    if (!disabled) {
      await roll.click({ force: true });
      await page.waitForTimeout(120);
    }
  }

  const pass = page.locator('.sd-pass-btn');
  if (await pass.isVisible().catch(() => false)) {
    await pass.click({ force: true });
    return 'pass';
  }

  const playable = page.locator('.sd-hand-domino-playable');
  const n = await playable.count();
  if (n === 0) {
    // Wait briefly for pass button after roll with no plays
    await page.waitForTimeout(200);
    if (await pass.isVisible().catch(() => false)) {
      await pass.click({ force: true });
      return 'pass';
    }
    return 'no-move';
  }

  // Prefer a mid tile occasionally to exercise selection UX
  const idx = n > 2 && Math.random() < 0.35 ? 1 : 0;
  await playable.nth(idx).click({ force: true });
  await page.waitForTimeout(80);

  const valid = page.locator('.sd-cell-valid');
  const vc = await valid.count();
  if (vc === 0) return 'no-valid-cell';
  const vIdx = vc > 1 && Math.random() < 0.4 ? Math.min(1, vc - 1) : 0;
  await valid.nth(vIdx).click({ force: true });
  return 'place';
}

function isEnded(statusText) {
  return /wins!|draw|tie/i.test(statusText || '');
}

async function waitForHumanOrEnd(page, deadline) {
  while (Date.now() < deadline) {
    const info = await page.evaluate(() => {
      const status = document.querySelector('.sd-status')?.textContent?.trim() ?? '';
      const thinking = !!document.querySelector('.sd-computer-thinking');
      const roll = document.querySelector('.sd-roll-btn');
      const canRoll = !!roll && !roll.disabled;
      const pass = !!document.querySelector('.sd-pass-btn');
      const playable = document.querySelectorAll('.sd-hand-domino-playable').length;
      const computerText = /computer/i.test(status);
      return { status, thinking, canRoll, pass, playable, computerText };
    });
    if (isEnded(info.status)) return { kind: 'ended', ...info };
    if (!info.computerText && !info.thinking && (info.canRoll || info.pass || info.playable > 0)) {
      return { kind: 'human', ...info };
    }
    await page.waitForTimeout(150);
  }
  const status = await page.locator('.sd-status').textContent().catch(() => '');
  return { kind: 'stall', status: status?.trim() ?? '' };
}

async function runOneGame(browser, viewport, difficulty, gameIndex) {
  const context = await browser.newContext({
    ...viewport,
    locale: 'en-US',
  });
  const page = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => pageErrors.push(String(err)));

  const t0 = Date.now();
  let outcome = 'unknown';
  let turns = 0;
  let lastStatus = '';
  let measures = null;
  let illicitHumanRollSkip = 0;
  const aiThinkSeen = { count: 0 };

  try {
    await startVsAi(page, difficulty);

    // Opening measures
    measures = await measureTargets(page);

    for (turns = 0; turns < MAX_HUMAN_TURNS; turns++) {
      const before = await page.evaluate(() => ({
        status: document.querySelector('.sd-status')?.textContent?.trim() ?? '',
        dice: !!document.querySelector('.sd-dice-display'),
        roll: !!document.querySelector('.sd-roll-btn:not([disabled])'),
      }));

      // Detect illicit auto-roll: human turn jumps from Roll affordance to dice
      // without our click — sampled between AI handoff waits.
      const gate = await waitForHumanOrEnd(page, Date.now() + STALL_MS);
      lastStatus = gate.status;
      if (gate.kind === 'ended') {
        outcome = /draw|tie/i.test(gate.status) ? 'draw' : /red/i.test(gate.status) ? 'ai-win' : 'human-win';
        break;
      }
      if (gate.kind === 'stall') {
        outcome = 'stall';
        break;
      }

      if (/computer|thinking/i.test(gate.status) || gate.thinking) {
        aiThinkSeen.count++;
      }

      // Snapshot mid-game once
      if (turns === 2 && gameIndex === 0) {
        const shot = path.join(OUT, `${viewport.name}-${difficulty}-mid.png`);
        await page.screenshot({ path: shot, fullPage: false });
        fs.copyFileSync(shot, path.join(ART, `sd-${viewport.name}-${difficulty}-mid.png`));
      }

      const action = await playHumanTurn(page);
      if (action === 'no-move' || action === 'no-valid-cell') {
        // One retry after short wait — AI may still be finishing
        await page.waitForTimeout(400);
        const again = await playHumanTurn(page);
        if (again === 'no-move' || again === 'no-valid-cell') {
          // Check if AI stole the roll (dice appeared without us rolling)
          const after = await page.evaluate(() => ({
            status: document.querySelector('.sd-status')?.textContent?.trim() ?? '',
            dice: !!document.querySelector('.sd-dice-display'),
            roll: !!document.querySelector('.sd-roll-btn'),
          }));
          if (before.roll && after.dice && !after.roll) {
            illicitHumanRollSkip++;
          }
          lastStatus = after.status;
          if (isEnded(after.status)) {
            outcome = /draw|tie/i.test(after.status)
              ? 'draw'
              : /red/i.test(after.status)
                ? 'ai-win'
                : 'human-win';
            break;
          }
          // soft continue — may be AI turn
          continue;
        }
      }

      // After human action, AI should think
      await page.waitForTimeout(100);
      const thinkFlash = await page
        .locator('.sd-computer-thinking, .sd-status')
        .first()
        .textContent()
        .catch(() => '');
      if (/computer|thinking/i.test(thinkFlash || '')) aiThinkSeen.count++;

      const post = await page.locator('.sd-status').textContent().catch(() => '');
      lastStatus = post?.trim() ?? '';
      if (isEnded(lastStatus)) {
        outcome = /draw|tie/i.test(lastStatus) ? 'draw' : /red/i.test(lastStatus) ? 'ai-win' : 'human-win';
        break;
      }
    }

    if (outcome === 'unknown' && turns >= MAX_HUMAN_TURNS) outcome = 'turn-budget';

    // End screenshot for first game of each combo
    if (gameIndex === 0) {
      const shot = path.join(OUT, `${viewport.name}-${difficulty}-end.png`);
      await page.screenshot({ path: shot, fullPage: false });
      fs.copyFileSync(shot, path.join(ART, `sd-${viewport.name}-${difficulty}-end.png`));
    }

    // End-state measures when roll/pass visible
    const endMeasures = await measureTargets(page);
    measures = { ...measures, end: endMeasures };
  } catch (err) {
    outcome = 'error';
    lastStatus = String(err?.message || err);
    const shot = path.join(OUT, `${viewport.name}-${difficulty}-g${gameIndex}-error.png`);
    await page.screenshot({ path: shot, fullPage: false }).catch(() => {});
  }

  const ms = Date.now() - t0;
  await context.close();
  return {
    viewport: viewport.name,
    difficulty,
    gameIndex,
    outcome,
    turns,
    ms,
    lastStatus,
    consoleErrors: [...new Set(consoleErrors)].slice(0, 20),
    pageErrors: [...new Set(pageErrors)].slice(0, 10),
    measures,
    aiThinkSeen: aiThinkSeen.count,
    illicitHumanRollSkip,
  };
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const results = [];
  console.log(`Deep playtest Sum Dominoes — ${GAMES_PER_DIFF} games × ${DIFFS.length} diffs × ${VIEWPORTS.length} viewports`);

  for (const vp of VIEWPORTS) {
    for (const diff of DIFFS) {
      for (let g = 0; g < GAMES_PER_DIFF; g++) {
        const r = await runOneGame(browser, vp, diff, g);
        results.push(r);
        const errN = r.consoleErrors.length + r.pageErrors.length;
        console.log(
          `[${r.viewport}/${r.difficulty}#${g}] ${r.outcome} turns=${r.turns} ${r.ms}ms think=${r.aiThinkSeen} illicitRoll=${r.illicitHumanRollSkip} errs=${errN} :: ${r.lastStatus.slice(0, 80)}`
        );
      }
    }
  }

  await browser.close();

  const summary = {
    generatedAt: new Date().toISOString(),
    gamesPerDiff: GAMES_PER_DIFF,
    total: results.length,
    byOutcome: {},
    stalls: results.filter((r) => r.outcome === 'stall' || r.outcome === 'turn-budget'),
    errors: results.filter((r) => r.outcome === 'error' || r.consoleErrors.length || r.pageErrors.length),
    illicitRolls: results.filter((r) => r.illicitHumanRollSkip > 0),
    touchSamples: results
      .filter((r) => r.gameIndex === 0)
      .map((r) => ({
        viewport: r.viewport,
        difficulty: r.difficulty,
        measures: r.measures,
      })),
    results,
  };
  for (const r of results) {
    summary.byOutcome[r.outcome] = (summary.byOutcome[r.outcome] || 0) + 1;
  }

  const jsonPath = path.join(OUT, 'results.json');
  fs.writeFileSync(jsonPath, JSON.stringify(summary, null, 2));
  fs.writeFileSync(path.join(ART, 'sum-dominoes-deep-results.json'), JSON.stringify(summary, null, 2));
  console.log('\nSummary by outcome:', summary.byOutcome);
  console.log('Stalls/budget:', summary.stalls.length);
  console.log('Illicit human roll skips:', summary.illicitRolls.length);
  console.log('Wrote', jsonPath);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
