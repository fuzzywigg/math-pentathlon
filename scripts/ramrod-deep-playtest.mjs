/**
 * Headless Chromium deep playtest for Ramrod.
 * Human vs AI · Easy/Medium/Hard · tablet (768×1024 touch) + desktop (1280×800).
 * Plays until winner banner / game-over status, stall, or turn budget.
 *
 * Usage: node scripts/ramrod-deep-playtest.mjs
 * Requires Vite on http://127.0.0.1:5173
 */
import { chromium, devices } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const BASE = process.env.PLAYTEST_BASE || 'http://127.0.0.1:5173';
const OUT = path.resolve('docs/playtest/ramrod-deep-2026-10-07');
const ART = '/opt/cursor/artifacts';
const GAMES_PER_DIFF = Number(process.env.RAMROD_GAMES || 10);
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
  await page.goto(`${BASE}/#/game/ramrod`, { waitUntil: 'domcontentloaded' });
  await page
    .getByTestId('game-loading')
    .waitFor({ state: 'hidden', timeout: 20_000 })
    .catch(() => {});
  await page.locator('.ramrod-board, #new-game-btn').first().waitFor({
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
  await page.locator('.ramrod-board').waitFor({ timeout: 10_000 });
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
      pass: box('.ramrod-btn-secondary'),
      clear: [...document.querySelectorAll('.ramrod-btn-secondary')].map((el) => {
        const r = el.getBoundingClientRect();
        return {
          text: el.textContent?.trim(),
          w: Math.round(r.width),
          h: Math.round(r.height),
        };
      }),
      selectableRods: all('.ramrod-rod-wrapper.selectable'),
      validSlots: all('.ramrod-slot.valid'),
      slots: all('.ramrod-slot'),
      thinking: !!document.querySelector('.ramrod-computer-thinking'),
      hint: document.querySelector('.ramrod-turn-hint')?.textContent?.trim() ?? '',
      status: document.querySelector('.ramrod-status')?.textContent?.trim() ?? '',
    };
  });
}

/** Click via DOM dispatch — survives shell overflow-clip quirks. */
async function tap(page, selector, index = 0) {
  const ok = await page.evaluate(
    ({ selector, index }) => {
      const el = document.querySelectorAll(selector)[index];
      if (!el) return false;
      el.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true, view: window })
      );
      return true;
    },
    { selector, index }
  );
  if (!ok) {
    await page.locator(selector).nth(index).click({ force: true }).catch(() => {});
  }
}

async function playHumanTurn(page) {
  const deadlock = await page.locator('.ramrod-deadlock-hint').count();
  if (deadlock > 0) return 'deadlock';

  const didPass = await page.evaluate(() => {
    const btn = [...document.querySelectorAll('.ramrod-btn-secondary')].find(
      (b) => b.textContent?.includes('Pass Turn')
    );
    if (!btn) return false;
    btn.dispatchEvent(
      new MouseEvent('click', { bubbles: true, cancelable: true, view: window })
    );
    return true;
  });
  if (didPass) return 'pass';

  // Prefer a rod that completes a box (has a "Need:" complementary slot), else first
  const choice = await page.evaluate(() => {
    const rods = [
      ...document.querySelectorAll(
        '.ramrod-player-player1 .ramrod-rod-wrapper.selectable'
      ),
    ];
    if (rods.length === 0) return null;
    // Try each rod via temporary click simulation is hard; pick index by label length
    // Prefer mid-length rods (3–7) which complete more often in practice
    let best = 0;
    let bestScore = -1;
    rods.forEach((el, i) => {
      const label = el.querySelector('.ramrod-rod-label')?.textContent ?? '0';
      const len = Number(label);
      const score = len >= 3 && len <= 7 ? 10 + len : len;
      if (score > bestScore) {
        bestScore = score;
        best = i;
      }
    });
    return { index: best, count: rods.length };
  });

  if (!choice) {
    await page.waitForTimeout(200);
    return 'no-move';
  }

  await tap(
    page,
    '.ramrod-player-player1 .ramrod-rod-wrapper.selectable',
    choice.index
  );
  await page.waitForTimeout(60);

  let vc = await page.locator('.ramrod-slot.valid').count();
  if (vc === 0) {
    // Try other rods
    for (let i = 0; i < choice.count; i++) {
      if (i === choice.index) continue;
      await page.evaluate(() => {
        const selected = document.querySelector(
          '.ramrod-rod-wrapper.selected.selectable'
        );
        selected?.dispatchEvent(
          new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
          })
        );
      });
      await page.waitForTimeout(40);
      await tap(
        page,
        '.ramrod-player-player1 .ramrod-rod-wrapper.selectable',
        0
      );
      // After deselect, selectable list resets — click i-th among p1
      await page.evaluate((idx) => {
        const rods = [
          ...document.querySelectorAll(
            '.ramrod-player-player1 .ramrod-rod-wrapper.selectable'
          ),
        ];
        const el = rods[idx];
        el?.dispatchEvent(
          new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
          })
        );
      }, i);
      await page.waitForTimeout(40);
      vc = await page.locator('.ramrod-slot.valid').count();
      if (vc > 0) break;
    }
  }

  if (vc === 0) return 'no-valid-slot';

  // Prefer a slot that shows "Need:" (completing) when available
  const slotIdx = await page.evaluate(() => {
    const valids = [...document.querySelectorAll('.ramrod-slot.valid')];
    const complete = valids.findIndex((s) =>
      s.parentElement?.textContent?.includes('Need:')
    );
    return complete >= 0 ? complete : 0;
  });
  await tap(page, '.ramrod-slot.valid', slotIdx);
  return 'place';
}

function isEnded(statusText) {
  return /wins|tie/i.test(statusText || '');
}

async function waitForHumanOrEnd(page, deadline) {
  while (Date.now() < deadline) {
    const info = await page.evaluate(() => {
      const status =
        document.querySelector('.ramrod-status')?.textContent?.trim() ?? '';
      const thinking = !!document.querySelector('.ramrod-computer-thinking');
      const pass = [...document.querySelectorAll('.ramrod-btn-secondary')].some(
        (b) => b.textContent?.includes('Pass Turn')
      );
      const selectable = document.querySelectorAll(
        '.ramrod-rod-wrapper.selectable'
      ).length;
      const computerText = /computer|thinking/i.test(status);
      const banner = !!document.querySelector('.ramrod-winner-banner');
      return { status, thinking, pass, selectable, computerText, banner };
    });
    if (info.banner || isEnded(info.status)) return { kind: 'ended', ...info };
    if (
      !info.computerText &&
      !info.thinking &&
      (info.pass || info.selectable > 0)
    ) {
      return { kind: 'human', ...info };
    }
    await page.waitForTimeout(120);
  }
  const status = await page.locator('.ramrod-status').textContent().catch(() => '');
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
  let illicitPassSkip = 0;
  const aiThinkSeen = { count: 0 };
  let maxAiPauseMs = 0;

  try {
    await startVsAi(page, difficulty);
    measures = await measureTargets(page);

    if (gameIndex === 0 && difficulty === 'easy') {
      const shot = path.join(OUT, `${viewport.name}-start.png`);
      await page.screenshot({ path: shot, fullPage: false });
      fs.copyFileSync(shot, path.join(ART, `ramrod-${viewport.name}-start.png`));
    }

    for (turns = 0; turns < MAX_HUMAN_TURNS; turns++) {
      const beforePlayer = await page.evaluate(() => {
        const status =
          document.querySelector('.ramrod-status')?.textContent?.trim() ?? '';
        return {
          status,
          blueSelect: /Blue's turn - Select a rod/.test(status),
          history:
            document.querySelectorAll('.ramrod-history-move').length,
        };
      });

      const gate = await waitForHumanOrEnd(page, Date.now() + STALL_MS);
      lastStatus = gate.status;
      if (gate.kind === 'ended') {
        outcome = /tie/i.test(gate.status)
          ? 'draw'
          : /Red wins/i.test(gate.status)
            ? 'ai-win'
            : 'human-win';
        break;
      }
      if (gate.kind === 'stall') {
        outcome = 'stall';
        break;
      }

      if (/computer|thinking/i.test(gate.status) || gate.thinking) {
        aiThinkSeen.count++;
      }

      if (turns === 1 && gameIndex === 0) {
        // Capture placing hint if possible
        const sel = page.locator('.ramrod-rod-wrapper.selectable').first();
        if (await sel.isVisible().catch(() => false)) {
          await sel.click({ force: true }).catch(() => {});
          await page.waitForTimeout(80);
          const shot = path.join(OUT, `${viewport.name}-placing-hint.png`);
          await page.screenshot({ path: shot, fullPage: false });
          fs.copyFileSync(
            shot,
            path.join(ART, `ramrod-${viewport.name}-placing-hint.png`)
          );
          const clear = page.locator('.ramrod-btn-secondary', {
            hasText: 'Clear Selection',
          });
          if (await clear.isVisible().catch(() => false)) {
            // leave selected for playHumanTurn — don't clear
          }
        }
      }

      if (turns === 2 && gameIndex === 0) {
        const shot = path.join(OUT, `${viewport.name}-${difficulty}-mid.png`);
        await page.screenshot({ path: shot, fullPage: false });
        fs.copyFileSync(
          shot,
          path.join(ART, `ramrod-${viewport.name}-${difficulty}-mid.png`)
        );
      }

      const action = await playHumanTurn(page);
      if (action === 'deadlock') {
        outcome = 'deadlock';
        break;
      }
      if (action === 'no-move' || action === 'no-valid-slot') {
        await page.waitForTimeout(400);
        const again = await playHumanTurn(page);
        if (again === 'deadlock') {
          outcome = 'deadlock';
          break;
        }
        if (again === 'no-move' || again === 'no-valid-slot') {
          const after = await page.evaluate(() => ({
            status:
              document.querySelector('.ramrod-status')?.textContent?.trim() ??
              '',
            selectable: document.querySelectorAll(
              '.ramrod-rod-wrapper.selectable'
            ).length,
          }));
          // Illicit: Blue had select affordance, then suddenly computer without our place
          if (
            beforePlayer.blueSelect &&
            /computer|thinking/i.test(after.status) &&
            after.selectable === 0
          ) {
            illicitPassSkip++;
          }
          lastStatus = after.status;
          if (isEnded(after.status)) {
            outcome = /tie/i.test(after.status)
              ? 'draw'
              : /Red wins/i.test(after.status)
                ? 'ai-win'
                : 'human-win';
            break;
          }
          continue;
        }
      }

      // Measure AI think flash duration roughly
      const thinkStart = Date.now();
      let sawThink = false;
      for (let i = 0; i < 40; i++) {
        const flash = await page.evaluate(() => {
          const status =
            document.querySelector('.ramrod-status')?.textContent?.trim() ?? '';
          const thinking = !!document.querySelector(
            '.ramrod-computer-thinking'
          );
          return { status, thinking };
        });
        if (/computer|thinking/i.test(flash.status) || flash.thinking) {
          sawThink = true;
          aiThinkSeen.count++;
          break;
        }
        if (isEnded(flash.status)) break;
        if (/Blue's turn/.test(flash.status)) break;
        await page.waitForTimeout(40);
      }
      if (sawThink) {
        // wait until human again
        const endGate = await waitForHumanOrEnd(page, Date.now() + STALL_MS);
        maxAiPauseMs = Math.max(maxAiPauseMs, Date.now() - thinkStart);
        lastStatus = endGate.status;
        if (endGate.kind === 'ended') {
          outcome = /tie/i.test(endGate.status)
            ? 'draw'
            : /Red wins/i.test(endGate.status)
              ? 'ai-win'
              : 'human-win';
          break;
        }
        if (endGate.kind === 'stall') {
          outcome = 'stall';
          break;
        }
      } else {
        const post = await page.locator('.ramrod-status').textContent().catch(() => '');
        lastStatus = post?.trim() ?? '';
        if (isEnded(lastStatus)) {
          outcome = /tie/i.test(lastStatus)
            ? 'draw'
            : /Red wins/i.test(lastStatus)
              ? 'ai-win'
              : 'human-win';
          break;
        }
      }

      // Tablet AI thinking screenshot once
      if (
        viewport.name === 'tablet' &&
        difficulty === 'medium' &&
        gameIndex === 0 &&
        sawThink &&
        !fs.existsSync(path.join(OUT, 'tablet-ai-thinking.png'))
      ) {
        // Already past think — capture on next handoff mid-wait
      }
    }

    if (outcome === 'unknown' && turns >= MAX_HUMAN_TURNS) outcome = 'turn-budget';

    if (gameIndex === 0) {
      const shot = path.join(OUT, `${viewport.name}-${difficulty}-end.png`);
      await page.screenshot({ path: shot, fullPage: false });
      fs.copyFileSync(
        shot,
        path.join(ART, `ramrod-${viewport.name}-${difficulty}-end.png`)
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
    lastStatus,
    consoleErrors: [...new Set(consoleErrors)].slice(0, 20),
    pageErrors: [...new Set(pageErrors)].slice(0, 10),
    measures,
    aiThinkSeen: aiThinkSeen.count,
    illicitPassSkip,
    maxAiPauseMs,
  };
}

async function captureAiThinkingShot(browser) {
  const vp = VIEWPORTS[0];
  const context = await browser.newContext({ ...vp, locale: 'en-US' });
  const page = await context.newPage();
  try {
    await startVsAi(page, 'medium');
    // Place one blue move quickly then catch thinking
    const rod = page.locator('.ramrod-rod-wrapper.selectable').first();
    if (await rod.isVisible()) {
      await rod.click({ force: true });
      const slot = page.locator('.ramrod-slot.valid').first();
      if (await slot.isVisible()) {
        await slot.click({ force: true });
        await page
          .locator('.ramrod-computer-thinking')
          .waitFor({ state: 'attached', timeout: 2000 })
          .catch(() => {});
        const shot = path.join(OUT, 'tablet-ai-thinking.png');
        await page.screenshot({ path: shot, fullPage: false });
        fs.copyFileSync(shot, path.join(ART, 'ramrod-tablet-ai-thinking.png'));
      }
    }
  } catch {
    /* best-effort */
  }
  await context.close();
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const results = [];
  console.log(
    `Deep playtest Ramrod — ${GAMES_PER_DIFF} games × ${DIFFS.length} diffs × ${VIEWPORTS.length} viewports`
  );

  await captureAiThinkingShot(browser);

  for (const vp of VIEWPORTS) {
    for (const diff of DIFFS) {
      for (let g = 0; g < GAMES_PER_DIFF; g++) {
        const r = await runOneGame(browser, vp, diff, g);
        results.push(r);
        const errN = r.consoleErrors.length + r.pageErrors.length;
        console.log(
          `[${r.viewport}/${r.difficulty}#${g}] ${r.outcome} turns=${r.turns} ${r.ms}ms think=${r.aiThinkSeen} illicitPass=${r.illicitPassSkip} maxAiPause=${r.maxAiPauseMs}ms errs=${errN} :: ${r.lastStatus.slice(0, 80)}`
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
    illicitPasses: results.filter((r) => r.illicitPassSkip > 0),
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
  fs.writeFileSync(
    path.join(ART, 'ramrod-deep-results.json'),
    JSON.stringify(summary, null, 2)
  );
  console.log('\nSummary by outcome:', summary.byOutcome);
  console.log('Stalls/budget:', summary.stalls.length);
  console.log('Illicit passes:', summary.illicitPasses.length);
  console.log('Wrote', jsonPath);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
