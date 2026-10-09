/**
 * Deep playtest harness for Calla — human-vs-AI, Easy/Medium/Hard,
 * desktop + tablet Chromium. Plays full games by clicking valid pits;
 * records outcomes, stalls, console errors, AI think times, touch metrics.
 *
 * Usage: node scripts/calla-deep-playtest.mjs
 * Requires: npm run dev on :5173 (or PLAYTEST_BASE_URL).
 */
import { chromium, devices } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const BASE = process.env.PLAYTEST_BASE_URL || 'http://localhost:5173';
const GAMES_PER = Number(process.env.CALLA_GAMES_PER || 10);
const OUT_DIR = path.resolve('docs/playtest/calla-deep-2026-10-07');
const ART_DIR = path.resolve('/opt/cursor/artifacts/calla-deep-playtest');
const DIFFICULTIES = ['easy', 'medium', 'hard'];

const VIEWPORTS = {
  desktop: { width: 1280, height: 800, isMobile: false, hasTouch: false },
  tablet: {
    ...devices['iPad Mini'],
    // Force Chromium; device descriptor may set webkit-only flags we ignore.
  },
};

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.mkdirSync(ART_DIR, { recursive: true });

async function dismissOwl(page) {
  await page.evaluate(() => {
    const el = document.getElementById('ollie-owl');
    if (el) el.style.pointerEvents = 'none';
  });
}

async function startVsAi(page, difficulty) {
  await page.goto(`${BASE}/#/game/calla`, { waitUntil: 'domcontentloaded' });
  await page.getByTestId('game-loading').waitFor({ state: 'hidden', timeout: 20_000 }).catch(() => {});
  await page.locator('#new-game-btn').waitFor({ state: 'visible', timeout: 20_000 });
  await dismissOwl(page);
  await page.locator('#new-game-btn').click();
  const modal = page.locator('#new-game-modal');
  await modal.waitFor({ state: 'visible', timeout: 10_000 });
  await page.locator('.mode-option[data-mode="human-vs-ai"]').click();
  await page.locator(`.difficulty-btn.${difficulty}`).click();
  await page.locator('#start-game-btn').click();
  await expectHidden(modal);
  await dismissOwl(page);
  await page.locator('.calla-wrapper, .calla-pit').first().waitFor({ timeout: 10_000 });
  // Confirm vs-AI chrome (scores say You/AI — not Blue/Red)
  const scores = await page.locator('.calla-scores').textContent();
  if (!/You/i.test(scores || '') || !/AI/i.test(scores || '')) {
    throw new Error(`Expected You/AI score labels after vs-AI start; got "${scores}"`);
  }
}

async function expectHidden(locator) {
  await locator.waitFor({ state: 'hidden', timeout: 10_000 }).catch(async () => {
    // modal uses .hidden class
    const cls = await locator.getAttribute('class');
    if (!cls?.includes('hidden')) throw new Error('modal still visible');
  });
}

async function statusText(page) {
  return page.evaluate(() => {
    const el =
      document.querySelector('.status-turn') ||
      document.querySelector('.calla-status');
    return (el?.textContent || '').replace(/\s+/g, ' ').trim();
  });
}

async function measurePits(page) {
  return page.evaluate(() => {
    const pits = [...document.querySelectorAll('.calla-pit')];
    const board = document.querySelector('.calla-board');
    const boardRect = board?.getBoundingClientRect();
    return pits.slice(0, 5).map((g) => {
      const hit = g.querySelector('.calla-pit-hit') || g.querySelector('circle');
      const r = hit?.getBoundingClientRect();
      const vb = board?.viewBox?.baseVal;
      const svgW = boardRect?.width || 0;
      const hitR = Number(hit?.getAttribute('r') || 32);
      const cssDiameter =
        vb && vb.width ? (hitR * 2 * svgW) / vb.width : r?.width || 0;
      return {
        cssW: Math.round(r?.width || 0),
        cssH: Math.round(r?.height || 0),
        cssDiameter: Math.round(cssDiameter),
      };
    });
  });
}

async function playOneGame(page, { viewport, difficulty, gameIndex }) {
  const consoleErrors = [];
  const pageErrors = [];
  const onConsole = (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  };
  const onPageError = (err) => pageErrors.push(String(err));
  page.on('console', onConsole);
  page.on('pageerror', onPageError);

  const t0 = Date.now();
  let humanMoves = 0;
  let aiThinkSamples = [];
  let stalled = false;
  let stallReason = '';
  let winner = null;
  let turns = 0;

  try {
    await startVsAi(page, difficulty);
    const pitSizes = await measurePits(page);

    // Screenshot first game of each combo
    if (gameIndex === 0) {
      const shot = path.join(
        OUT_DIR,
        `${viewport}-${difficulty}-start.png`
      );
      await page.screenshot({ path: shot, fullPage: true });
      fs.copyFileSync(shot, path.join(ART_DIR, path.basename(shot)));
    }

    for (let step = 0; step < 120; step++) {
      const st = await statusText(page);
      // "You Win!" must match (singular) as well as "Wins" / "Tie"
      if (/win|tie/i.test(st)) {
        winner = st;
        turns = step;
        break;
      }

      if (/thinking/i.test(st)) {
        const thinkStart = Date.now();
        await page
          .waitForFunction(
            () => {
              const t = (
                document.querySelector('.status-turn')?.textContent || ''
              ).toLowerCase();
              return !t.includes('thinking');
            },
            { timeout: 15_000 }
          )
          .catch(() => {
            stalled = true;
            stallReason = 'AI thinking >15s';
          });
        aiThinkSamples.push(Date.now() - thinkStart);
        if (stalled) break;
        continue;
      }

      // Human turn — click a valid pit (prefer player1)
      const valid = page.locator('.calla-pit-valid');
      const n = await valid.count();
      if (n === 0) {
        // Wait briefly for AI / render / end banner
        await page.waitForTimeout(250);
        const st2 = await statusText(page);
        // "You Win!" / "AI Wins!" / "Tie" — match win|wins|tie
        if (/win|tie/i.test(st2)) {
          winner = st2;
          turns = step;
          break;
        }
        if (/thinking/i.test(st2)) continue;
        // retry once more
        await page.waitForTimeout(600);
        const st3 = await statusText(page);
        if (/win|tie/i.test(st3)) {
          winner = st3;
          turns = step;
          break;
        }
        const n2 = await page.locator('.calla-pit-valid').count();
        if (n2 === 0 && !/thinking|win|tie/i.test(st3)) {
          stalled = true;
          stallReason = `No valid pits; status="${st3}"`;
          break;
        }
        continue;
      }

      // Prefer first valid (deterministic-ish); alternate mid indices for variety
      const idx = gameIndex % 2 === 0 ? 0 : Math.min(n - 1, step % n);
      const before = await statusText(page);
      await valid.nth(idx).click({ force: true });
      humanMoves++;

      // Wait for status change or thinking
      await page
        .waitForFunction(
          (prev) => {
            const t = (
              document.querySelector('.status-turn')?.textContent || ''
            )
              .replace(/\s+/g, ' ')
              .trim();
            return t !== prev || /thinking|wins|tie/i.test(t);
          },
          before,
          { timeout: 5_000 }
        )
        .catch(() => {});
    }

    if (!winner && !stalled) {
      stalled = true;
      stallReason = `Hit step cap; status="${await statusText(page)}"`;
    }

    if (gameIndex === 0 || stalled || /You Wins/i.test(winner || '')) {
      const shot = path.join(
        OUT_DIR,
        `${viewport}-${difficulty}-g${gameIndex}-end.png`
      );
      await page.screenshot({ path: shot, fullPage: true });
      fs.copyFileSync(shot, path.join(ART_DIR, path.basename(shot)));
    }

    return {
      viewport,
      difficulty,
      gameIndex,
      ok: !stalled && !!winner,
      winner,
      turns,
      humanMoves,
      durationMs: Date.now() - t0,
      aiThinkMs: aiThinkSamples,
      aiThinkMax: aiThinkSamples.length
        ? Math.max(...aiThinkSamples)
        : 0,
      aiThinkAvg: aiThinkSamples.length
        ? aiThinkSamples.reduce((a, b) => a + b, 0) / aiThinkSamples.length
        : 0,
      stalled,
      stallReason,
      consoleErrors,
      pageErrors,
      pitSizes,
      finalStatus: await statusText(page),
      uxFlags: {
        youWinsGrammar: /You Wins/i.test(winner || ''),
        blueDuringHva: /Blue's turn/i.test(await statusText(page)),
      },
    };
  } finally {
    page.off('console', onConsole);
    page.off('pageerror', onPageError);
  }
}

async function runViewport(name, viewportOpts) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport:
      name === 'tablet'
        ? { width: 768, height: 1024 }
        : { width: viewportOpts.width, height: viewportOpts.height },
    hasTouch: name === 'tablet',
    isMobile: name === 'tablet',
    deviceScaleFactor: name === 'tablet' ? 2 : 1,
  });
  const page = await context.newPage();
  const results = [];

  for (const difficulty of DIFFICULTIES) {
    for (let g = 0; g < GAMES_PER; g++) {
      process.stdout.write(
        `  ${name}/${difficulty} game ${g + 1}/${GAMES_PER}...\n`
      );
      try {
        const r = await playOneGame(page, {
          viewport: name,
          difficulty,
          gameIndex: g,
        });
        results.push(r);
        process.stdout.write(
          `    -> ${r.ok ? 'OK' : 'STALL'} ${r.winner || r.stallReason} ` +
            `moves=${r.humanMoves} aiMax=${r.aiThinkMax}ms errs=${r.consoleErrors.length}\n`
        );
      } catch (err) {
        results.push({
          viewport: name,
          difficulty,
          gameIndex: g,
          ok: false,
          stalled: true,
          stallReason: String(err),
          consoleErrors: [],
          pageErrors: [String(err)],
          humanMoves: 0,
          durationMs: 0,
          aiThinkMs: [],
          aiThinkMax: 0,
          aiThinkAvg: 0,
          turns: 0,
          winner: null,
          pitSizes: [],
          finalStatus: '',
          uxFlags: {},
        });
        process.stdout.write(`    -> ERROR ${err}\n`);
      }
    }
  }

  await browser.close();
  return results;
}

function summarize(results) {
  const byKey = {};
  for (const r of results) {
    const k = `${r.viewport}/${r.difficulty}`;
    byKey[k] ??= {
      total: 0,
      ok: 0,
      stalls: 0,
      youWins: 0,
      consoleErrors: 0,
      pageErrors: 0,
      aiMax: 0,
      winners: [],
      pitMinDiameter: Infinity,
    };
    const b = byKey[k];
    b.total++;
    if (r.ok) b.ok++;
    if (r.stalled) b.stalls++;
    if (r.uxFlags?.youWinsGrammar) b.youWins++;
    b.consoleErrors += r.consoleErrors?.length || 0;
    b.pageErrors += r.pageErrors?.length || 0;
    b.aiMax = Math.max(b.aiMax, r.aiThinkMax || 0);
    if (r.winner) b.winners.push(r.winner);
    for (const p of r.pitSizes || []) {
      b.pitMinDiameter = Math.min(b.pitMinDiameter, p.cssDiameter || p.cssW);
    }
  }
  return byKey;
}

const all = [];
console.log(`Calla deep playtest → ${BASE} (${GAMES_PER} games × 3 diffs × 2 viewports)`);
for (const [name, opts] of Object.entries(VIEWPORTS)) {
  console.log(`\n=== ${name} ===`);
  all.push(...(await runViewport(name, opts)));
}

const summary = summarize(all);
const outJson = path.join(OUT_DIR, 'results.json');
const artJson = path.join(ART_DIR, 'results.json');
fs.writeFileSync(outJson, JSON.stringify({ summary, results: all }, null, 2));
fs.writeFileSync(artJson, JSON.stringify({ summary, results: all }, null, 2));

console.log('\n=== SUMMARY ===');
console.log(JSON.stringify(summary, null, 2));
console.log(`Wrote ${outJson}`);
