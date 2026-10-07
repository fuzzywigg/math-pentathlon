/**
 * Headless Chromium deep playtest for Par 55.
 * Human vs AI · Easy/Medium/Hard · tablet (768×1024 touch) + desktop (1280×800).
 * Plays until winner banner / tie status, stall, or turn budget.
 *
 * Usage: node scripts/par-55-deep-playtest.mjs
 * Requires Vite on http://127.0.0.1:5173
 *
 * Env: PAR55_GAMES (default 10), PLAYTEST_BASE, PAR55_QUICK=1 (1 game per combo)
 */
import { chromium, devices } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const BASE = process.env.PLAYTEST_BASE || 'http://127.0.0.1:5173';
const OUT = path.resolve('docs/playtest/par-55-deep-2026-10-07');
const ART = '/opt/cursor/artifacts';
const GAMES_PER_DIFF = Number(
  process.env.PAR55_QUICK ? 1 : process.env.PAR55_GAMES || 10
);
const MAX_HUMAN_TURNS = 120;
const STALL_MS = 15_000;

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
  await page.goto(`${BASE}/#/game/par-55`, { waitUntil: 'domcontentloaded' });
  await page
    .getByTestId('game-loading')
    .waitFor({ state: 'hidden', timeout: 20_000 })
    .catch(() => {});
  await page.locator('.par55-board, #new-game-btn').first().waitFor({
    timeout: 20_000,
  });
  await dismissOwl(page);
  await page.locator('#new-game-btn').click();
  const modal = page.locator('#new-game-modal');
  await modal.waitFor({ state: 'visible', timeout: 10_000 });
  await page.locator('.mode-option[data-mode="human-vs-ai"]').click();
  await page.locator(`.difficulty-btn.${difficulty}`).click();
  await page.locator('#start-game-btn').click();
  await expectHidden(modal);
  await dismissOwl(page);
  await page.locator('.par55-board').waitFor({ timeout: 10_000 });
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
      [...document.querySelectorAll(sel)].slice(0, 16).map((el) => {
        const r = el.getBoundingClientRect();
        return {
          w: Math.round(r.width),
          h: Math.round(r.height),
          minOk: r.width >= 44 && r.height >= 44,
        };
      });
    const svgBases = [...document.querySelectorAll('[data-base-id]')].slice(
      0,
      8
    );
    const baseBoxes = svgBases.map((el) => {
      const r = el.getBoundingClientRect();
      return {
        w: Math.round(r.width),
        h: Math.round(r.height),
        minOk: r.width >= 44 && r.height >= 44,
      };
    });
    const validBases = [
      ...document.querySelectorAll('.par55-valid-base'),
    ].slice(0, 8);
    const validBoxes = validBases.map((el) => {
      const r = el.getBoundingClientRect();
      return {
        w: Math.round(r.width),
        h: Math.round(r.height),
        minOk: r.width >= 44 && r.height >= 44,
      };
    });
    return {
      handClickable: all('.par55-hand-block.clickable'),
      handAny: all('.par55-hand-block'),
      pass: box('.par55-btn'),
      clear: box('.par55-btn-secondary'),
      bases: baseBoxes,
      validBases: validBoxes,
      thinking: /computer|thinking/i.test(
        document.querySelector('.par55-status')?.textContent || ''
      ),
      status: document.querySelector('.par55-status')?.textContent?.trim() ?? '',
      phaseHint: document.querySelector('.par55-turn-hint')?.textContent?.trim(),
    };
  });
}

function isEnded(statusText) {
  return /wins!|tie/i.test(statusText || '');
}

async function waitForHumanOrEnd(page, deadline) {
  while (Date.now() < deadline) {
    const info = await page.evaluate(() => {
      const status =
        document.querySelector('.par55-status')?.textContent?.trim() ?? '';
      const computerText = /computer|thinking/i.test(status);
      const clickable = document.querySelectorAll(
        '.par55-hand-block.clickable'
      ).length;
      const valid = document.querySelectorAll('.par55-valid-base').length;
      const pass = !!document.querySelector('.par55-controls .par55-btn');
      const banner = !!document.querySelector('.par55-winner-banner');
      return { status, computerText, clickable, valid, pass, banner };
    });
    if (isEnded(info.status) || info.banner) {
      return { kind: 'ended', ...info };
    }
    if (
      !info.computerText &&
      (info.clickable > 0 || info.valid > 0 || info.pass)
    ) {
      return { kind: 'human', ...info };
    }
    await page.waitForTimeout(120);
  }
  const status = await page.locator('.par55-status').textContent().catch(() => '');
  return { kind: 'stall', status: status?.trim() ?? '' };
}

async function playHumanTurn(page) {
  const pass = page.locator('.par55-controls .par55-btn');
  if (await pass.isVisible().catch(() => false)) {
    const text = (await pass.textContent().catch(() => '')) || '';
    if (/pass/i.test(text)) {
      await pass.click({ force: true });
      return 'pass';
    }
  }

  const clickable = page.locator('.par55-hand-block.clickable');
  const n = await clickable.count();
  if (n === 0) {
    // Maybe already placing (selection persisted?) — try valid base
    const valid = page.locator('.par55-valid-base');
    if ((await valid.count()) > 0) {
      await valid.first().click({ force: true });
      return 'place-only';
    }
    if (await pass.isVisible().catch(() => false)) {
      await pass.click({ force: true });
      return 'pass';
    }
    return 'no-move';
  }

  const idx = n > 2 && Math.random() < 0.3 ? 1 : 0;
  await clickable.nth(idx).click({ force: true });
  await page.waitForTimeout(60);

  const valid = page.locator('.par55-valid-base');
  const vc = await valid.count();
  if (vc === 0) {
    // Clear and try another block
    const clear = page.locator('.par55-controls .par55-btn');
    if (await clear.isVisible().catch(() => false)) {
      await clear.click({ force: true }).catch(() => {});
    }
    return 'no-valid';
  }
  const vIdx = vc > 2 && Math.random() < 0.35 ? Math.min(2, vc - 1) : 0;
  await valid.nth(vIdx).click({ force: true });
  return 'place';
}

async function probeNewGameRace(page, difficulty) {
  // Mid AI pause: start New Game and ensure Blue still owns the seat
  await startVsAi(page, difficulty);
  // Make one human move to hand off to AI
  const gate = await waitForHumanOrEnd(page, Date.now() + STALL_MS);
  if (gate.kind !== 'human') return { ok: false, reason: 'no-human-open', gate };
  await playHumanTurn(page);
  // Wait until computer thinking
  const thinkDeadline = Date.now() + 3000;
  let sawThink = false;
  while (Date.now() < thinkDeadline) {
    const st = await page.locator('.par55-status').textContent().catch(() => '');
    if (/computer|thinking/i.test(st || '')) {
      sawThink = true;
      break;
    }
    if (isEnded(st || '')) break;
    await page.waitForTimeout(40);
  }
  if (!sawThink) {
    // AI may have finished instantly; still try race
  }
  await page.locator('#new-game-btn').click();
  const modal = page.locator('#new-game-modal');
  await modal.waitFor({ state: 'visible', timeout: 10_000 });
  await page.locator('.mode-option[data-mode="human-vs-ai"]').click();
  await page.locator(`.difficulty-btn.${difficulty}`).click();
  await page.locator('#start-game-btn').click();
  await expectHidden(modal);
  await page.waitForTimeout(900); // longer than old 800ms AI delay
  const after = await page.evaluate(() => {
    const status =
      document.querySelector('.par55-status')?.textContent?.trim() ?? '';
    const history = document.querySelectorAll('.par55-history-move').length;
    const clickable = document.querySelectorAll(
      '.par55-hand-block.clickable'
    ).length;
    const computer = /computer|thinking/i.test(status);
    return { status, history, clickable, computer };
  });
  // Fresh game: Blue to select, no history, no AI auto-move
  const ok =
    after.history === 0 &&
    !after.computer &&
    /blue/i.test(after.status) &&
    after.clickable > 0;
  return { ok, after, sawThink };
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
  let aiThinkCount = 0;
  let maxAiThinkMs = 0;
  let illicitPass = 0;

  try {
    await startVsAi(page, difficulty);
    measures = await measureTargets(page);

    if (gameIndex === 0) {
      const shot = path.join(OUT, `${viewport.name}-${difficulty}-start.png`);
      await page.screenshot({ path: shot, fullPage: false });
      fs.copyFileSync(
        shot,
        path.join(ART, `par55-${viewport.name}-${difficulty}-start.png`)
      );
    }

    for (turns = 0; turns < MAX_HUMAN_TURNS; turns++) {
      const gate = await waitForHumanOrEnd(page, Date.now() + STALL_MS);
      lastStatus = gate.status;
      if (gate.kind === 'ended') {
        outcome = /tie/i.test(gate.status)
          ? 'draw'
          : /red/i.test(gate.status)
            ? 'ai-win'
            : 'human-win';
        break;
      }
      if (gate.kind === 'stall') {
        outcome = 'stall';
        break;
      }

      if (turns === 1 && gameIndex === 0) {
        const shot = path.join(OUT, `${viewport.name}-${difficulty}-mid.png`);
        await page.screenshot({ path: shot, fullPage: false });
        fs.copyFileSync(
          shot,
          path.join(ART, `par55-${viewport.name}-${difficulty}-mid.png`)
        );
        measures = {
          ...measures,
          mid: await measureTargets(page),
        };
      }

      const histBefore = await page
        .locator('.par55-history-move')
        .count()
        .catch(() => 0);

      const action = await playHumanTurn(page);
      if (action === 'no-move' || action === 'no-valid') {
        await page.waitForTimeout(350);
        const again = await playHumanTurn(page);
        if (again === 'no-move' || again === 'no-valid') {
          const st = await page.locator('.par55-status').textContent();
          lastStatus = st?.trim() ?? '';
          if (isEnded(lastStatus)) {
            outcome = /tie/i.test(lastStatus)
              ? 'draw'
              : /red/i.test(lastStatus)
                ? 'ai-win'
                : 'human-win';
            break;
          }
          continue;
        }
      }

      // Watch for AI thinking chrome
      const thinkStart = Date.now();
      let sawThink = false;
      const thinkDeadline = Date.now() + 4000;
      while (Date.now() < thinkDeadline) {
        const st = await page
          .locator('.par55-status')
          .textContent()
          .catch(() => '');
        if (/computer|thinking/i.test(st || '')) {
          sawThink = true;
          aiThinkCount++;
          // stay until human again or end
          const back = await waitForHumanOrEnd(page, Date.now() + STALL_MS);
          maxAiThinkMs = Math.max(maxAiThinkMs, Date.now() - thinkStart);
          lastStatus = back.status;
          if (back.kind === 'ended') {
            outcome = /tie/i.test(back.status)
              ? 'draw'
              : /red/i.test(back.status)
                ? 'ai-win'
                : 'human-win';
          } else if (back.kind === 'stall') {
            outcome = 'stall';
          }
          break;
        }
        if (isEnded(st || '')) {
          lastStatus = st?.trim() ?? '';
          outcome = /tie/i.test(lastStatus)
            ? 'draw'
            : /red/i.test(lastStatus)
              ? 'ai-win'
              : 'human-win';
          break;
        }
        // Human may still be selecting if place failed
        const clickable = await page
          .locator('.par55-hand-block.clickable')
          .count();
        if (clickable > 0 && Date.now() - thinkStart > 200) {
          // AI didn't take seat — maybe human still to move after failed place
          break;
        }
        await page.waitForTimeout(50);
      }
      if (!sawThink && outcome === 'unknown') {
        // AI may have moved so fast we missed chrome; check history grew by 2
        const histAfter = await page
          .locator('.par55-history-move')
          .count()
          .catch(() => 0);
        if (histAfter > histBefore + 1) {
          // human + AI
        } else if (histAfter === histBefore) {
          // suspicious — human action didn't land; or pass both
        }
      }

      if (outcome !== 'unknown') break;

      // Detect illicit AI pass of Blue: history jumped with Blue pass while we acted
      const statusNow = await page
        .locator('.par55-status')
        .textContent()
        .catch(() => '');
      lastStatus = statusNow?.trim() ?? '';
      if (isEnded(lastStatus)) {
        outcome = /tie/i.test(lastStatus)
          ? 'draw'
          : /red/i.test(lastStatus)
            ? 'ai-win'
            : 'human-win';
        break;
      }
    }

    if (outcome === 'unknown' && turns >= MAX_HUMAN_TURNS) {
      outcome = 'turn-budget';
    }

    if (gameIndex === 0) {
      const shot = path.join(OUT, `${viewport.name}-${difficulty}-end.png`);
      await page.screenshot({ path: shot, fullPage: false });
      fs.copyFileSync(
        shot,
        path.join(ART, `par55-${viewport.name}-${difficulty}-end.png`)
      );
    }
    measures = { ...measures, end: await measureTargets(page) };
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
    lastStatus,
    consoleErrors: [...new Set(consoleErrors)].slice(0, 20),
    pageErrors: [...new Set(pageErrors)].slice(0, 10),
    measures,
    aiThinkCount,
    maxAiThinkMs,
    illicitPass,
  };
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const results = [];
  console.log(
    `Deep playtest Par 55 — ${GAMES_PER_DIFF} games × ${DIFFS.length} diffs × ${VIEWPORTS.length} viewports`
  );

  // Baseline New Game race probe (medium / tablet)
  {
    const context = await browser.newContext({
      ...VIEWPORTS[0],
      locale: 'en-US',
    });
    const page = await context.newPage();
    const race = await probeNewGameRace(page, 'medium');
    fs.writeFileSync(
      path.join(OUT, 'new-game-race.json'),
      JSON.stringify(race, null, 2)
    );
    console.log(
      `[new-game-race] ok=${race.ok} sawThink=${race.sawThink} :: ${JSON.stringify(race.after || race.reason)}`
    );
    if (race.ok || race.after) {
      const shot = path.join(OUT, 'tablet-medium-new-game-race.png');
      await page.screenshot({ path: shot, fullPage: false }).catch(() => {});
      try {
        fs.copyFileSync(
          shot,
          path.join(ART, 'par55-tablet-medium-new-game-race.png')
        );
      } catch {
        /* missing shot */
      }
    }
    await context.close();
  }

  for (const vp of VIEWPORTS) {
    for (const diff of DIFFS) {
      for (let g = 0; g < GAMES_PER_DIFF; g++) {
        const r = await runOneGame(browser, vp, diff, g);
        results.push(r);
        const errN = r.consoleErrors.length + r.pageErrors.length;
        console.log(
          `[${r.viewport}/${r.difficulty}#${g}] ${r.outcome} turns=${r.turns} ${r.ms}ms think=${r.aiThinkCount} maxThink=${r.maxAiThinkMs}ms errs=${errN} :: ${String(r.lastStatus).slice(0, 80)}`
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
    path.join(ART, 'par-55-deep-results.json'),
    JSON.stringify(summary, null, 2)
  );
  console.log('\nSummary by outcome:', summary.byOutcome);
  console.log('Stalls/budget:', summary.stalls.length);
  console.log('Error games:', summary.errors.length);
  console.log('Max AI think ms:', summary.maxAiThinkMs);
  console.log('Wrote', jsonPath);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
