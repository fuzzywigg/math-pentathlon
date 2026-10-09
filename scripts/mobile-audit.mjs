/**
 * One-shot mobile layout audit for Math Pentathlon games.
 * Emulates iPhone SE (375×667) and Pixel 7 (412×915) via Playwright.
 * Output: JSON report to stdout (and optionally --out path).
 */
import { chromium, devices } from '@playwright/test';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

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

const MOUNT = {
  'kings-quadraphages': '#board .board .cell, .cell-king',
  hex: '.hex-board',
  'star-track': '.star-track-board',
  'hex-a-gone': '.hex-a-gone-board',
  calla: '.calla-wrapper, .calla-pit',
  'sum-dominoes': '.sd-board',
  'par-55': '.par55-board',
  ramrod: '.ramrod-board',
  'kwatro-sinko': '.kwa-board',
  fiar: '.fiar-board-container',
  juggle: '.juggle-board',
  'contig-60': '.contig-board',
  'stars-bars': '.stars-board',
  'fab-a-diffy': '.fab-bar-pool, .fab-answer-board',
  'queens-guards': '.qg-board-container',
  'prime-gold': '.pg-board, .prime-board',
  'remainder-islands': '.remainder-board',
  'pent-em-in': '.pent-board',
  'frac-fact': '.frac-problem, .frac-choice-btn',
  'fraction-pinball':
    '.pinball-board, .pinball-challenge, .pinball-game-container, .pinball-choice-btn',
};

const VIEWPORTS = [
  {
    name: 'iPhone SE',
    ...devices['iPhone SE'],
    // Playwright device may be portrait; pin exact size from task
    viewport: { width: 375, height: 667 },
  },
  {
    name: 'Pixel 7',
    ...devices['Pixel 7'],
    viewport: { width: 412, height: 915 },
  },
];

const BASE = process.env.BASE_URL ?? 'http://localhost:5173';
const outIdx = process.argv.indexOf('--out');
const outPath =
  outIdx >= 0
    ? resolve(process.argv[outIdx + 1])
    : resolve(__dirname, '../docs/mobile-audit-raw-2026-10-07.json');

async function waitForGameReady(page) {
  await page
    .getByTestId('game-loading')
    .waitFor({ state: 'hidden', timeout: 20_000 })
    .catch(() => {});
  await page.locator('#new-game-btn, h1').first().waitFor({
    state: 'visible',
    timeout: 20_000,
  });
}

async function dismissOwl(page) {
  await page.evaluate(() => {
    const el = document.getElementById('ollie-owl');
    if (el) (el).style.pointerEvents = 'none';
  });
}

async function startHuman(page) {
  await waitForGameReady(page);
  const modal = page.locator('#new-game-modal');
  if (await modal.isVisible().catch(() => false)) {
    const human = page.locator('.mode-option[data-mode="human-vs-human"]');
    if (await human.isVisible().catch(() => false)) {
      await human.click();
    }
    await page.locator('#start-game-btn').click();
    await page.locator('#new-game-modal.hidden').waitFor({ timeout: 10_000 }).catch(() => {});
  }
  await dismissOwl(page);
}

async function auditPage(page, gameId) {
  return page.evaluate(
    ({ gameId: gid, mountSel }) => {
      const docEl = document.documentElement;
      const body = document.body;
      const overflowX = Math.max(
        0,
        Math.max(docEl.scrollWidth, body.scrollWidth) -
          Math.max(docEl.clientWidth, body.clientWidth)
      );
      const overflowY = Math.max(
        0,
        Math.max(docEl.scrollHeight, body.scrollHeight) -
          Math.max(docEl.clientHeight, body.clientHeight)
      );

      /** Elements that protrude past the right edge of the viewport. */
      const overflowing = [];
      const vw = window.innerWidth;
      const candidates = document.querySelectorAll(
        'button, a, [role="button"], .cell, .hex-cell, input, select, .board, .game-area, svg, canvas, .button-row, .mode-option, .difficulty-btn'
      );
      for (const el of candidates) {
        const r = el.getBoundingClientRect();
        if (r.width < 1 || r.height < 1) continue;
        if (r.right > vw + 1) {
          const cls = typeof el.className === 'string' ? el.className : '';
          overflowing.push({
            tag: el.tagName.toLowerCase(),
            id: el.id || null,
            class: cls.slice(0, 80),
            right: Math.round(r.right),
            width: Math.round(r.width),
            overflowPx: Math.round(r.right - vw),
          });
          if (overflowing.length >= 12) break;
        }
      }

      /** Interactive controls under 44×44 CSS px (visible only). */
      const smallTargets = [];
      const interactive = document.querySelectorAll(
        [
          'button',
          'a[href]',
          '[role="button"]',
          'input',
          'select',
          '.cell',
          '.hex-cell-group',
          '.hex-a-gone-cell',
          '.star-track-space',
          '.calla-pit',
          '.sd-hand-domino',
          '.sd-cell',
          '.par55-hand-block',
          '.par55-base',
          '.ramrod-rod-wrapper',
          '.ramrod-slot',
          '.kwa-chip',
          '.kwa-node',
          '[data-node-id]',
          '.juggle-cell',
          '.juggle-die',
          '.juggle-shape-option',
          '.contig-cell',
          '.stars-card',
          '.stars-cell',
          '.fab-bar-wrapper',
          '.fab-op-btn',
          '[data-cell-key]',
          '.pg-cell',
          '.prime-cell',
          '.island',
          '.pent-piece-option',
          '.frac-choice-btn',
          '.pinball-choice-btn',
          '.difficulty-btn',
          '.mode-option',
          '.back-button',
          '#new-game-btn',
          '#rules-btn',
          '.owl-minimize-btn',
          '.owl-bubble-dismiss',
        ].join(',')
      );

      for (const el of interactive) {
        const style = window.getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden') continue;
        if (Number(style.opacity) === 0) continue;
        const r = el.getBoundingClientRect();
        if (r.width < 1 || r.height < 1) continue;
        // Skip off-screen / zero-area SVG hit targets that are decorative
        if (r.bottom < 0 || r.top > window.innerHeight) continue;
        if (r.width < 44 || r.height < 44) {
          const cls = typeof el.className === 'string' ? el.className : el.getAttribute('class') || '';
          smallTargets.push({
            tag: el.tagName.toLowerCase(),
            id: el.id || null,
            class: String(cls).slice(0, 100),
            aria: el.getAttribute('aria-label')?.slice(0, 60) ?? null,
            w: Math.round(r.width * 10) / 10,
            h: Math.round(r.height * 10) / 10,
          });
        }
      }

      // Dedupe by class+size, keep first 40
      const seen = new Set();
      const uniqueSmall = [];
      for (const t of smallTargets) {
        const key = `${t.tag}|${t.class}|${t.w}x${t.h}`;
        if (seen.has(key)) continue;
        seen.add(key);
        uniqueSmall.push(t);
        if (uniqueSmall.length >= 40) break;
      }

      /** Mouse-only gesture risk: listeners that look mouse-only in attributes / data. */
      const mouseOnlyHints = [];
      // Static scan of inline on* mouse handlers
      document.querySelectorAll('[onmouseenter],[onmouseleave],[onmousedown],[onmouseup]').forEach((el) => {
        const cls = typeof el.className === 'string' ? el.className : '';
        mouseOnlyHints.push({
          kind: 'inline-mouse-handler',
          tag: el.tagName.toLowerCase(),
          class: cls.slice(0, 80),
        });
      });

      const mount = document.querySelector(mountSel);
      const mountBox = mount
        ? (() => {
            const r = mount.getBoundingClientRect();
            return {
              w: Math.round(r.width),
              h: Math.round(r.height),
              right: Math.round(r.right),
              bottom: Math.round(r.bottom),
            };
          })()
        : null;

      return {
        gameId: gid,
        viewport: { w: window.innerWidth, h: window.innerHeight },
        overflowX,
        overflowY,
        documentScrollWidth: docEl.scrollWidth,
        documentClientWidth: docEl.clientWidth,
        overflowingElements: overflowing,
        smallTapTargets: uniqueSmall,
        smallTapTargetCount: smallTargets.length,
        mouseOnlyHints,
        mountVisible: !!mount,
        mountBox,
        hasHorizontalScroll:
          overflowX > 1 ||
          docEl.scrollWidth > docEl.clientWidth + 1 ||
          body.scrollWidth > body.clientWidth + 1,
      };
    },
    { gameId, mountSel: MOUNT[gameId] ?? '#board, main' }
  );
}

async function auditGesturesStatic() {
  // Code-level gesture notes (mouseenter-only hover previews etc.)
  return {
    'pent-em-in': [
      'Cell hover preview uses mouseenter/mouseleave only (no touch equivalent for preview). Tap/click still places.',
    ],
    juggle: [
      'Cell hover preview uses mouseenter/mouseleave only. Placement uses click.',
    ],
    'queens-guards': [
      'Cell hover highlight uses mouseenter/mouseleave. Moves use click/pointer.',
    ],
    fiar: [
      'Node hover uses mouseenter/mouseleave. Placement uses click.',
    ],
    'remainder-islands': [
      'Uses pointerdown + click for activation (touch-friendly). Hover styles are mouseenter/mouseleave only.',
    ],
  };
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const report = {
    generatedAt: new Date().toISOString(),
    baseUrl: BASE,
    viewports: VIEWPORTS.map((v) => ({
      name: v.name,
      width: v.viewport.width,
      height: v.viewport.height,
    })),
    gestureNotes: await auditGesturesStatic(),
    results: [],
  };

  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({
      ...vp,
      hasTouch: true,
      isMobile: true,
    });
    const page = await context.newPage();

    for (const gameId of GAMES) {
      const entry = { gameId, device: vp.name, ok: false, error: null, audit: null };
      try {
        await page.goto(`${BASE}/#/game/${gameId}`, {
          waitUntil: 'domcontentloaded',
          timeout: 30_000,
        });
        await startHuman(page);
        const sel = MOUNT[gameId] ?? '#board, main';
        await page.locator(sel).first().waitFor({ state: 'visible', timeout: 15_000 });
        // Settle layout
        await page.waitForTimeout(300);
        entry.audit = await auditPage(page, gameId);
        entry.ok = true;
      } catch (err) {
        entry.error = String(err?.message ?? err);
      }
      report.results.push(entry);
      const ox = entry.audit?.overflowX ?? '?';
      const small = entry.audit?.smallTapTargetCount ?? '?';
      console.error(
        `[${vp.name}] ${gameId}: ok=${entry.ok} overflowX=${ox} smallTargets=${small}${entry.error ? ' ERR=' + entry.error : ''}`
      );
    }
    await context.close();
  }

  await browser.close();
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, JSON.stringify(report, null, 2));
  console.log(`Wrote ${outPath}`);
  console.log(
    JSON.stringify(
      {
        total: report.results.length,
        failed: report.results.filter((r) => !r.ok).length,
        withOverflow: report.results.filter((r) => r.audit?.hasHorizontalScroll)
          .length,
        withSmallTargets: report.results.filter(
          (r) => (r.audit?.smallTapTargetCount ?? 0) > 0
        ).length,
      },
      null,
      2
    )
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
