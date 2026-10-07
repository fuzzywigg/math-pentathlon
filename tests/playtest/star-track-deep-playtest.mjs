/**
 * Star Track deep playtest — 60 full HvA games.
 * Matrix: desktop + tablet Chromium × Easy/Medium/Hard × 10.
 *
 * Usage (dev server on :5173):
 *   node tests/playtest/star-track-deep-playtest.mjs
 *
 * Writes JSON + PNGs under docs/playtest/ and /opt/cursor/artifacts/star-track-playtest/
 */
import { chromium, devices } from '@playwright/test';
import { mkdirSync, writeFileSync, copyFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '../..');
const DOCS = join(ROOT, 'docs/playtest');
const ARTIFACTS = '/opt/cursor/artifacts/star-track-playtest';
const BASE = process.env.PLAYTEST_BASE_URL ?? 'http://127.0.0.1:5173';
const STALL_MS = 12_000;
const GAME_TIMEOUT_MS = 90_000;

mkdirSync(DOCS, { recursive: true });
mkdirSync(join(DOCS, 'screenshots'), { recursive: true });
mkdirSync(ARTIFACTS, { recursive: true });

const VIEWPORTS = {
  desktop: { width: 1280, height: 800, isMobile: false, hasTouch: false },
  tablet: {
    ...devices['iPad Mini'],
    // Force Chromium + touch for tablet matrix (device defaults to webkit).
    defaultBrowserType: undefined,
  },
};

const DIFFICULTIES = ['easy', 'medium', 'hard'];
const GAMES_PER_CELL = 10;

async function dismissOwl(page) {
  await page.evaluate(() => {
    const el = document.getElementById('ollie-owl');
    if (el) (el).style.pointerEvents = 'none';
  });
}

async function waitGameReady(page) {
  await page.getByTestId('game-loading').waitFor({ state: 'hidden', timeout: 15_000 }).catch(() => {});
  await page.locator('#new-game-btn').waitFor({ state: 'visible', timeout: 15_000 });
}

async function startVsAi(page, difficulty) {
  await waitGameReady(page);
  await dismissOwl(page);
  await page.locator('#new-game-btn').click();
  const modal = page.locator('#new-game-modal');
  await modal.waitFor({ state: 'visible', timeout: 10_000 });
  await page.locator('.mode-option[data-mode="human-vs-ai"]').click();
  await page.locator(`.difficulty-btn.${difficulty}`).click();
  await page.locator('#start-game-btn').click();
  await expectHidden(modal);
  await dismissOwl(page);
}

async function expectHidden(locator) {
  await locator.waitFor({ state: 'hidden', timeout: 10_000 }).catch(async () => {
    // Modal uses .hidden class rather than display:none in some builds
    const cls = await locator.getAttribute('class');
    if (!cls?.includes('hidden')) throw new Error('modal still open');
  });
}

async function playOneGame(page, { viewport, difficulty, index, consoleErrors }) {
  const started = Date.now();
  const findings = [];
  let moves = 0;
  let winnerText = '';
  let stalled = false;
  let softLock = false;
  let turnCopySamples = [];

  await page.goto(`${BASE}/#/game/star-track`);
  await startVsAi(page, difficulty);

  // Opening screenshot for first game of each cell
  if (index === 1) {
    const shot = `open-${viewport}-${difficulty}.png`;
    const path = join(DOCS, 'screenshots', shot);
    await page.screenshot({ path, fullPage: true });
    copyFileSync(path, join(ARTIFACTS, shot));
  }

  const deadline = Date.now() + GAME_TIMEOUT_MS;
  let lastProgressAt = Date.now();
  let lastFingerprint = '';

  while (Date.now() < deadline) {
    const snap = await page.evaluate(() => {
      const status = document.querySelector('.status-turn')?.textContent || '';
      const draw = document.querySelector('.star-track-draw-btn');
      const chains = [...document.querySelectorAll('.star-track-chain-btn')];
      const thinking = !!document.querySelector('.status-ai-thinking');
      const winner =
        document.querySelector('.star-track-winner')?.textContent || '';
      const progress = [...document.querySelectorAll('.progress-value')].map(
        (e) => e.textContent
      );
      const targets = [...document.querySelectorAll(
        '.star-track-draw-btn, .star-track-chain-btn'
      )].map((el) => {
        const r = el.getBoundingClientRect();
        return {
          w: Math.round(r.width * 10) / 10,
          h: Math.round(r.height * 10) / 10,
          ok: r.width >= 44 && r.height >= 44,
          disabled: /** @type {HTMLButtonElement} */ (el).disabled === true,
        };
      });
      return {
        status,
        thinking,
        winner,
        progress,
        drawDisabled: draw ? /** @type {HTMLButtonElement} */ (draw).disabled : null,
        chainDisabled: chains.map((c) => /** @type {HTMLButtonElement} */ (c).disabled),
        targets,
        area: document.querySelector('.star-track-chain-area')?.innerText || '',
      };
    });

    if (
      /\b(You Win!|AI Wins!|Blue Wins!|Red Wins!)\b/i.test(snap.status) ||
      /It's a draw!/i.test(snap.status) ||
      /reaches the star/i.test(snap.winner) ||
      /draw — chains exhausted/i.test(snap.winner)
    ) {
      winnerText = snap.status || snap.winner;
      break;
    }

    if (/Blue's turn|Red's turn|^Blue:|^Red:/.test(snap.status) && !snap.thinking) {
      turnCopySamples.push(snap.status.trim());
      findings.push({ type: 'confusing_turn_copy', text: snap.status.trim() });
    }

    for (const t of snap.targets) {
      if (!t.ok && !t.disabled) {
        findings.push({ type: 'touch_target_under_44', ...t });
      }
    }

    if (snap.thinking) {
      const thinkStart = Date.now();
      while (true) {
        const still = await page.locator('.status-ai-thinking').count();
        if (!still) break;
        if (Date.now() - thinkStart > STALL_MS) {
          stalled = true;
          findings.push({ type: 'ai_stall', ms: Date.now() - thinkStart });
          break;
        }
        await page.waitForTimeout(50);
      }
      if (stalled) break;
      lastProgressAt = Date.now();
      continue;
    }

    if (snap.drawDisabled === false) {
      // DOM click avoids Playwright actionability hangs on mid-rebuild nodes.
      const clicked = await page.evaluate(() => {
        const btn = document.querySelector(
          '.star-track-draw-btn:not([disabled])'
        );
        if (!btn) return false;
        btn.click();
        return true;
      });
      if (clicked) {
        moves += 1;
        lastProgressAt = Date.now();
        await page
          .waitForFunction(
            () =>
              !document.querySelector('.star-track-draw-btn:not([disabled])'),
            null,
            { timeout: 2000 }
          )
          .catch(() => {});
      }
      continue;
    }

    if (snap.chainDisabled.some((d) => d === false)) {
      const clicked = await page.evaluate(() => {
        const btns = [
          ...document.querySelectorAll('.star-track-chain-btn:not([disabled])'),
        ];
        if (!btns.length) return false;
        let best = 0;
        let bestLen = -1;
        btns.forEach((b, i) => {
          const len = Number(b.querySelector('.chain-length')?.textContent || 0);
          if (len > bestLen) {
            bestLen = len;
            best = i;
          }
        });
        btns[best].click();
        return true;
      });
      if (clicked) {
        moves += 1;
        lastProgressAt = Date.now();
        await page
          .waitForFunction(
            () =>
              !document.querySelector(
                '.star-track-chain-btn:not([disabled])'
              ) || !!document.querySelector('.status-ai-thinking'),
            null,
            { timeout: 2000 }
          )
          .catch(() => {});
      }
      continue;
    }

    const fingerprint = `${snap.status}|${snap.progress}|${snap.area}`;
    if (fingerprint !== lastFingerprint) {
      lastFingerprint = fingerprint;
      lastProgressAt = Date.now();
    } else if (Date.now() - lastProgressAt > STALL_MS) {
      softLock = true;
      findings.push({
        type: 'soft_lock',
        status: snap.status,
        progress: snap.progress,
      });
      break;
    }
    await page.waitForTimeout(40);
  }

  if (!winnerText && !stalled && !softLock) {
    findings.push({ type: 'timeout', ms: Date.now() - started });
  }

  // Mid / end screenshots for first of each difficulty on each viewport
  if (index === 1 || winnerText) {
    const tag = winnerText ? 'end' : 'mid';
    if (index === 1 || (winnerText && index <= 2)) {
      const shot = `${tag}-${viewport}-${difficulty}-g${index}.png`;
      const path = join(DOCS, 'screenshots', shot);
      await page.screenshot({ path, fullPage: true });
      copyFileSync(path, join(ARTIFACTS, shot));
    }
  }

  return {
    viewport,
    difficulty,
    index,
    ms: Date.now() - started,
    moves,
    winnerText: winnerText.trim(),
    stalled,
    softLock,
    findings,
    turnCopySamples,
    consoleErrors: [...consoleErrors],
  };
}

async function runViewport(viewportName) {
  const results = [];
  const browser = await chromium.launch({ headless: true });
  const contextOptions =
    viewportName === 'tablet'
      ? {
          viewport: { width: 768, height: 1024 },
          hasTouch: true,
          isMobile: true,
          deviceScaleFactor: 2,
          userAgent:
            'Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/118.0.0.0 Mobile/15E148 Safari/604.1',
        }
      : {
          viewport: VIEWPORTS.desktop,
          hasTouch: false,
          isMobile: false,
        };

  const context = await browser.newContext(contextOptions);
  // Emulate coarse pointer for tablet touch-target CSS without breaking other queries
  if (viewportName === 'tablet') {
    await context.addInitScript(() => {
      const original = window.matchMedia.bind(window);
      window.matchMedia = (query) => {
        const q = String(query);
        if (q.includes('pointer: coarse')) {
          return {
            matches: true,
            media: q,
            onchange: null,
            addListener() {},
            removeListener() {},
            addEventListener() {},
            removeEventListener() {},
            dispatchEvent() {
              return false;
            },
          };
        }
        if (q.includes('pointer: fine')) {
          const m = original(q);
          return { ...m, matches: false, media: q };
        }
        return original(query);
      };
    });
  }

  for (const difficulty of DIFFICULTIES) {
    for (let i = 1; i <= GAMES_PER_CELL; i++) {
      const page = await context.newPage();
      const consoleErrors = [];
      page.on('pageerror', (err) => consoleErrors.push(`pageerror: ${err.message}`));
      page.on('console', (msg) => {
        if (msg.type() === 'error') consoleErrors.push(`console: ${msg.text()}`);
      });

      process.stdout.write(
        `[${viewportName}/${difficulty}] game ${i}/${GAMES_PER_CELL}… `
      );
      try {
        const result = await playOneGame(page, {
          viewport: viewportName,
          difficulty,
          index: i,
          consoleErrors,
        });
        results.push(result);
        const flag = result.stalled || result.softLock || result.findings.length
          ? `FINDINGS=${result.findings.length}`
          : 'ok';
        console.log(`${result.winnerText.slice(0, 40) || 'NO_END'} ${result.ms}ms ${flag}`);
      } catch (err) {
        console.log(`FAIL ${err.message}`);
        results.push({
          viewport: viewportName,
          difficulty,
          index: i,
          error: String(err),
          findings: [{ type: 'exception', message: String(err) }],
          consoleErrors,
        });
      }
      await page.close();
    }
  }

  await browser.close();
  return results;
}

async function main() {
  console.log(`Star Track deep playtest → ${BASE}`);
  const all = [];
  all.push(...(await runViewport('desktop')));
  all.push(...(await runViewport('tablet')));

  const summary = {
    date: '2026-10-07',
    totalGames: all.length,
    completed: all.filter((r) => r.winnerText).length,
    stalled: all.filter((r) => r.stalled).length,
    softLocks: all.filter((r) => r.softLock).length,
    withFindings: all.filter((r) => (r.findings || []).length).length,
    consoleErrorGames: all.filter((r) => (r.consoleErrors || []).length).length,
    avgMs: Math.round(
      all.reduce((s, r) => s + (r.ms || 0), 0) / Math.max(all.length, 1)
    ),
    byCell: {},
  };

  for (const r of all) {
    const key = `${r.viewport}/${r.difficulty}`;
    summary.byCell[key] ??= { games: 0, completed: 0, findings: 0 };
    summary.byCell[key].games += 1;
    if (r.winnerText) summary.byCell[key].completed += 1;
    summary.byCell[key].findings += (r.findings || []).length;
  }

  const out = { summary, results: all };
  writeFileSync(join(DOCS, 'star-track-deep-results.json'), JSON.stringify(out, null, 2));
  writeFileSync(join(ARTIFACTS, 'star-track-deep-results.json'), JSON.stringify(out, null, 2));
  console.log('\nSummary:', JSON.stringify(summary, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
