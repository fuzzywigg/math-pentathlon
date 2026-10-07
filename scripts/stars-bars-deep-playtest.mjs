/**
 * Headless Chromium deep playtest for Stars & Bars.
 * Human vs AI · Easy/Medium/Hard · tablet (768×1024 touch) + desktop (1280×800).
 * Plays until winner banner / game-over status, stall, or turn budget.
 *
 * Usage: node scripts/stars-bars-deep-playtest.mjs
 * Requires Vite on http://127.0.0.1:5173
 */
import { chromium, devices } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const BASE = process.env.PLAYTEST_BASE || 'http://127.0.0.1:5173';
const OUT = path.resolve('docs/playtest/stars-bars-deep-2026-10-07');
const ART = '/opt/cursor/artifacts';
const GAMES_PER_DIFF = Number(process.env.STARS_GAMES || 10);
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

async function expectHidden(locator) {
  await locator.waitFor({ state: 'hidden', timeout: 10_000 }).catch(async () => {
    const cls = await locator.getAttribute('class');
    if (!cls?.includes('hidden')) throw new Error('modal still open');
  });
}

async function startVsAi(page, difficulty) {
  await page.goto(`${BASE}/#/game/stars-bars`, {
    waitUntil: 'domcontentloaded',
  });
  await page
    .getByTestId('game-loading')
    .waitFor({ state: 'hidden', timeout: 20_000 })
    .catch(() => {});
  await page
    .locator('.stars-board, #new-game-btn')
    .first()
    .waitFor({ timeout: 20_000 });
  await dismissOwl(page);
  await page.locator('#new-game-btn').click();
  const modal = page.locator('#new-game-modal');
  await modal.waitFor({ state: 'visible', timeout: 10_000 });
  await page.locator('.mode-option[data-mode="human-vs-ai"]').click();
  await page.locator(`.difficulty-btn.${difficulty}`).click();
  await page.locator('#start-game-btn').click();
  await expectHidden(modal);
  await dismissOwl(page);
  await page.locator('.stars-board').waitFor({ timeout: 10_000 });
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
        return {
          w: Math.round(r.width),
          h: Math.round(r.height),
          minOk: r.width >= 44 && r.height >= 44,
        };
      });
    return {
      pass: box('.stars-pass-btn, .stars-btn'),
      clear: box('.stars-btn-secondary'),
      cards: all('.stars-hand-container:first-child .stars-card'),
      cells: all('.stars-cell'),
      valid: all('.stars-cell.valid'),
      thinking: !!document.querySelector('.status-ai-thinking'),
      status: document.querySelector('.stars-status')?.textContent?.trim() ?? '',
      scores: document.querySelector('.stars-scores')?.textContent?.trim() ?? '',
    };
  });
}

async function playHumanTurn(page) {
  const pass = page.locator('.stars-pass-btn');
  if (await pass.isVisible().catch(() => false)) {
    await pass.click({ force: true });
    return 'pass';
  }

  const hand = page.locator(
    '.stars-hand-container:first-child .stars-card:not(.disabled)'
  );
  const n = await hand.count();
  if (n === 0) {
    await page.waitForTimeout(200);
    if (await pass.isVisible().catch(() => false)) {
      await pass.click({ force: true });
      return 'pass';
    }
    return 'no-move';
  }

  const idx = n > 2 && Math.random() < 0.3 ? 1 : 0;
  await hand.nth(idx).click({ force: true });
  await page.waitForTimeout(80);

  const valid = page.locator('.stars-cell.valid');
  const vc = await valid.count();
  if (vc === 0) {
    const clear = page.locator('.stars-btn-secondary').filter({
      hasText: /Clear/i,
    });
    if (await clear.isVisible().catch(() => false)) {
      await clear.click({ force: true });
    }
    return 'no-valid-cell';
  }
  // Prefer a star cell when available (title includes points)
  const vIdx = vc > 1 && Math.random() < 0.45 ? Math.min(1, vc - 1) : 0;
  await valid.nth(vIdx).click({ force: true });
  return 'place';
}

function isEnded(statusText) {
  return /wins|tie|draw/i.test(statusText || '');
}

async function waitForHumanOrEnd(page, deadline) {
  while (Date.now() < deadline) {
    const info = await page.evaluate(() => {
      const status =
        document.querySelector('.stars-status')?.textContent?.trim() ?? '';
      const thinking = !!document.querySelector('.status-ai-thinking');
      const pass = !!document.querySelector('.stars-pass-btn');
      const playable = document.querySelectorAll(
        '.stars-hand-container:first-child .stars-card:not(.disabled)'
      ).length;
      const computerText = /computer is thinking/i.test(status);
      const yourTurn = /your turn/i.test(status);
      return {
        status,
        thinking,
        pass,
        playable,
        computerText,
        yourTurn,
      };
    });
    if (isEnded(info.status)) return { kind: 'ended', ...info };
    if (
      !info.computerText &&
      !info.thinking &&
      (info.pass || info.playable > 0 || info.yourTurn)
    ) {
      return { kind: 'human', ...info };
    }
    await page.waitForTimeout(120);
  }
  const status = await page.locator('.stars-status').textContent().catch(() => '');
  return { kind: 'stall', status: status?.trim() ?? '' };
}

async function probeNewGameRace(page, difficulty) {
  // Mid AI think: open New Game and start again — stale timer must not place.
  await startVsAi(page, difficulty);
  // One human place to hand off to AI
  await playHumanTurn(page);
  await page.waitForTimeout(100);
  const thinking = await page
    .locator('.status-ai-thinking')
    .isVisible()
    .catch(() => false);
  await page.locator('#new-game-btn').click();
  const modal = page.locator('#new-game-modal');
  await modal.waitFor({ state: 'visible', timeout: 10_000 });
  await page.locator('.mode-option[data-mode="human-vs-ai"]').click();
  await page.locator(`.difficulty-btn.${difficulty}`).click();
  await page.locator('#start-game-btn').click();
  await expectHidden(modal);
  await page.waitForTimeout(2000);
  const after = await page.evaluate(() => {
    const status =
      document.querySelector('.stars-status')?.textContent?.trim() ?? '';
    const history = document.querySelectorAll('.stars-move-item').length;
    const filled = document.querySelectorAll('.stars-cell.player1, .stars-cell.player2')
      .length;
    return { status, history, filled };
  });
  return {
    sawThinkingBefore: thinking,
    status: after.status,
    history: after.history,
    filled: after.filled,
    suspicious: after.history > 0 || after.filled > 0 || /thinking/i.test(after.status),
  };
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
  let maxAiThinkMs = 0;
  const aiThinkSeen = { count: 0 };

  try {
    await startVsAi(page, difficulty);
    measures = await measureTargets(page);

    if (gameIndex === 0 && difficulty === 'easy') {
      const shot = path.join(OUT, `${viewport.name}-start.png`);
      await page.screenshot({ path: shot, fullPage: false });
      fs.copyFileSync(shot, path.join(ART, `stars-${viewport.name}-start.png`));
    }

    for (turns = 0; turns < MAX_HUMAN_TURNS; turns++) {
      const gate = await waitForHumanOrEnd(page, Date.now() + STALL_MS);
      lastStatus = gate.status;
      if (gate.kind === 'ended') {
        outcome = /tie|draw/i.test(gate.status)
          ? 'draw'
          : /computer/i.test(gate.status)
            ? 'ai-win'
            : 'human-win';
        break;
      }
      if (gate.kind === 'stall') {
        outcome = 'stall';
        break;
      }

      if (gate.thinking || gate.computerText) aiThinkSeen.count++;

      if (turns === 2 && gameIndex === 0) {
        const shot = path.join(OUT, `${viewport.name}-${difficulty}-mid.png`);
        await page.screenshot({ path: shot, fullPage: false });
        fs.copyFileSync(
          shot,
          path.join(ART, `stars-${viewport.name}-${difficulty}-mid.png`)
        );
      }

      // Capture AI thinking screenshot once
      if (aiThinkSeen.count === 0 && gameIndex === 0) {
        // Will capture after human move below
      }

      const thinkStart = Date.now();
      const action = await playHumanTurn(page);
      if (action === 'no-move' || action === 'no-valid-cell') {
        await page.waitForTimeout(400);
        const again = await playHumanTurn(page);
        if (again === 'no-move' || again === 'no-valid-cell') {
          const after = await page
            .locator('.stars-status')
            .textContent()
            .catch(() => '');
          lastStatus = after?.trim() ?? '';
          if (isEnded(lastStatus)) {
            outcome = /tie|draw/i.test(lastStatus)
              ? 'draw'
              : /computer/i.test(lastStatus)
                ? 'ai-win'
                : 'human-win';
            break;
          }
          continue;
        }
      }

      await page.waitForTimeout(80);
      const flash = await page
        .locator('.stars-status')
        .textContent()
        .catch(() => '');
      if (/computer is thinking/i.test(flash || '')) {
        aiThinkSeen.count++;
        if (gameIndex === 0 && difficulty === 'medium') {
          const shot = path.join(OUT, `${viewport.name}-ai-thinking.png`);
          await page.screenshot({ path: shot, fullPage: false });
          fs.copyFileSync(
            shot,
            path.join(ART, `stars-${viewport.name}-ai-thinking.png`)
          );
        }
        // Wait until human seat returns to measure think pause
        const humanBack = await waitForHumanOrEnd(page, Date.now() + STALL_MS);
        maxAiThinkMs = Math.max(maxAiThinkMs, Date.now() - thinkStart);
        lastStatus = humanBack.status;
        if (humanBack.kind === 'ended') {
          outcome = /tie|draw/i.test(humanBack.status)
            ? 'draw'
            : /computer/i.test(humanBack.status)
              ? 'ai-win'
              : 'human-win';
          break;
        }
        if (humanBack.kind === 'stall') {
          outcome = 'stall';
          break;
        }
        continue;
      }

      lastStatus = flash?.trim() ?? '';
      if (isEnded(lastStatus)) {
        outcome = /tie|draw/i.test(lastStatus)
          ? 'draw'
          : /computer/i.test(lastStatus)
            ? 'ai-win'
            : 'human-win';
        break;
      }
    }

    if (outcome === 'unknown' && turns >= MAX_HUMAN_TURNS) outcome = 'turn-budget';

    if (gameIndex === 0) {
      const shot = path.join(OUT, `${viewport.name}-${difficulty}-end.png`);
      await page.screenshot({ path: shot, fullPage: false });
      fs.copyFileSync(
        shot,
        path.join(ART, `stars-${viewport.name}-${difficulty}-end.png`)
      );
    }

    const endMeasures = await measureTargets(page);
    measures = { ...measures, end: endMeasures };
  } catch (err) {
    outcome = 'error';
    lastStatus = String(err?.message || err);
    const shot = path.join(
      OUT,
      `${viewport.name}-${difficulty}-g${gameIndex}-error.png`
    );
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
    maxAiThinkMs,
    lastStatus,
    consoleErrors: [...new Set(consoleErrors)].slice(0, 20),
    pageErrors: [...new Set(pageErrors)].slice(0, 10),
    measures,
    aiThinkSeen: aiThinkSeen.count,
  };
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const results = [];
  console.log(
    `Deep playtest Stars & Bars — ${GAMES_PER_DIFF} games × ${DIFFS.length} diffs × ${VIEWPORTS.length} viewports`
  );

  // New Game race probe (tablet medium)
  {
    const context = await browser.newContext({
      ...VIEWPORTS[0],
      locale: 'en-US',
    });
    const page = await context.newPage();
    let race;
    try {
      race = await probeNewGameRace(page, 'medium');
      const shot = path.join(OUT, 'tablet-medium-new-game-race.png');
      await page.screenshot({ path: shot, fullPage: false });
      fs.copyFileSync(
        shot,
        path.join(ART, 'stars-tablet-medium-new-game-race.png')
      );
    } catch (err) {
      race = { error: String(err?.message || err), suspicious: true };
    }
    await context.close();
    fs.writeFileSync(
      path.join(OUT, 'new-game-race.json'),
      JSON.stringify(race, null, 2)
    );
    console.log('New Game race probe:', JSON.stringify(race));
  }

  for (const vp of VIEWPORTS) {
    for (const diff of DIFFS) {
      for (let g = 0; g < GAMES_PER_DIFF; g++) {
        const r = await runOneGame(browser, vp, diff, g);
        results.push(r);
        const errN = r.consoleErrors.length + r.pageErrors.length;
        console.log(
          `[${r.viewport}/${r.difficulty}#${g}] ${r.outcome} turns=${r.turns} ${r.ms}ms thinkSeen=${r.aiThinkSeen} maxThink=${r.maxAiThinkMs}ms errs=${errN} :: ${r.lastStatus.slice(0, 80)}`
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
    stalls: results.filter(
      (r) => r.outcome === 'stall' || r.outcome === 'turn-budget'
    ),
    errors: results.filter(
      (r) => r.outcome === 'error' || r.consoleErrors.length || r.pageErrors.length
    ),
    touchSamples: results
      .filter((r) => r.gameIndex === 0)
      .map((r) => ({
        viewport: r.viewport,
        difficulty: r.difficulty,
        measures: r.measures,
      })),
    maxAiThinkMs: Math.max(0, ...results.map((r) => r.maxAiThinkMs || 0)),
    results,
  };
  for (const r of results) {
    summary.byOutcome[r.outcome] = (summary.byOutcome[r.outcome] || 0) + 1;
  }

  const jsonPath = path.join(OUT, 'results.json');
  fs.writeFileSync(jsonPath, JSON.stringify(summary, null, 2));
  fs.writeFileSync(
    path.join(ART, 'stars-bars-deep-results.json'),
    JSON.stringify(summary, null, 2)
  );
  console.log('\nSummary by outcome:', summary.byOutcome);
  console.log('Stalls/budget:', summary.stalls.length);
  console.log('Max AI think sample ms:', summary.maxAiThinkMs);
  console.log('Wrote', jsonPath);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
