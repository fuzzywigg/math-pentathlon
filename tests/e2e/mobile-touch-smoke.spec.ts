/**
 * Touch / mobile smoke (report-only): phone + tablet Chromium emulation.
 *
 * For every available game:
 * 1. Open from route, start human mode
 * 2. Audit layout / chrome tap targets / off-screen controls
 * 3. Make a few legal moves via tap()
 * 4. Open/close New Game + Help menus; toggle move-history badge when present
 * 5. Leave via Back → game list
 *
 * Writes `test-results/mobile/<project>/<gameId>.json` and regenerates
 * `test-results/mobile/summary.md` after each game (merge-safe across workers).
 *
 * Suite stays green unless `MOBILE_TOUCH_ENFORCE=1`. CI job is also
 * `continue-on-error: true` so timeouts cannot fail the workflow.
 *
 * Projects: `mobile-iphone-13`, `mobile-pixel-7`, `mobile-ipad`
 * (see playwright.config.ts).
 */
import { test, expect, type Page, type Locator } from '@playwright/test';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { GAMES, type GameInfo } from '../../src/core/game-registry';
import {
  dismissOwlIfNeeded,
  gotoGame,
  mountLocator,
  startHuman,
} from './helpers/page';

const AVAILABLE_GAMES = GAMES.filter((g) => g.available);
const REPORT_ROOT = path.join(process.cwd(), 'test-results', 'mobile');
const ENFORCE = process.env.MOBILE_TOUCH_ENFORCE === '1';

/** Chrome controls that must meet the 44×44 floor (dense board cells excluded). */
const CHROME_SELECTORS = [
  '#back-btn',
  '#new-game-btn',
  '#help-btn',
  '#tutorial-btn',
  '#start-game-btn',
  '.modal-close',
  '.collapse-toggle',
  '.mode-option',
  '.difficulty-btn',
  '.button-row button',
  '.back-button',
].join(', ');

type Issue = {
  kind:
    | 'overflow'
    | 'tap-target'
    | 'off-screen'
    | 'touch-action'
    | 'hover-only'
    | 'interaction'
    | 'error';
  detail: string;
};

type GameReport = {
  gameId: string;
  project: string;
  viewport: { width: number; height: number };
  ok: boolean;
  issues: Issue[];
  taps: number;
  menus: { newGame: boolean; help: boolean; moveLog: boolean | 'absent' };
  leftGame: boolean;
};

function titleStem(game: GameInfo): string {
  return game.name.replace(/[!?]+$/, '').split(' (')[0];
}

async function safeTap(locator: Locator): Promise<boolean> {
  if ((await locator.count()) === 0) return false;
  const target = locator.first();
  if (!(await target.isVisible().catch(() => false))) return false;
  try {
    await target.tap({ force: true, timeout: 5_000 });
    return true;
  } catch {
    try {
      await target.click({ force: true, timeout: 5_000 });
      return true;
    } catch {
      return false;
    }
  }
}

/** Make a few legal human taps without waiting for AI. */
async function playLegalTaps(page: Page, gameId: string): Promise<number> {
  let taps = 0;
  const tap = async (sel: string) => {
    if (await safeTap(page.locator(sel))) taps += 1;
  };

  switch (gameId) {
    case 'kings-quadraphages': {
      // Blue king at (1,5) → (2,5), then place a quad.
      if (await safeTap(page.locator('.cell[data-row="1"][data-col="5"]')))
        taps += 1;
      if (await safeTap(page.locator('.cell[data-row="2"][data-col="5"]')))
        taps += 1;
      if (await safeTap(page.locator('.cell[data-row="5"][data-col="5"]')))
        taps += 1;
      break;
    }
    case 'hex': {
      await tap('.hex-cell-group[data-row="5"][data-col="5"]');
      await tap('.hex-cell-group[data-row="4"][data-col="5"]');
      break;
    }
    case 'star-track': {
      await tap('.star-track-draw-btn');
      await tap('.star-track-chain-btn');
      break;
    }
    case 'hex-a-gone': {
      await tap('.hex-a-gone-block-btn:not(.empty)');
      if (await page.locator('.hex-a-gone-confirm-btn').isVisible().catch(() => false)) {
        await tap('.hex-a-gone-confirm-btn');
      }
      await tap('.hex-a-gone-board [data-q], .hex-a-gone-cell');
      break;
    }
    case 'calla': {
      if (!(await safeTap(page.locator('.calla-pit-valid')))) {
        await tap('.calla-pit');
      } else {
        taps += 1;
      }
      break;
    }
    case 'sum-dominoes': {
      await tap('.sd-roll-btn');
      if ((await page.locator('.sd-hand-domino-playable').count()) > 0) {
        await tap('.sd-hand-domino-playable');
        await tap('.sd-cell-valid');
      } else {
        await tap('.sd-pass-btn');
      }
      break;
    }
    case 'par-55': {
      await tap('.par55-hand-block.clickable');
      await tap('.par55-valid-base');
      break;
    }
    case 'ramrod': {
      const rod = page.locator('.ramrod-rod-wrapper.selectable').first();
      if (await rod.count()) {
        await rod.evaluate((el) => (el as HTMLElement).click());
        taps += 1;
        await tap('.ramrod-slot.valid');
      }
      break;
    }
    case 'kwatro-sinko': {
      await tap('.kwa-selectable-chip');
      await tap('.kwa-valid-node');
      break;
    }
    case 'fiar': {
      await tap(
        '[data-node-id]:has(.pulse-highlight), .fiar-board-container [data-node-id]'
      );
      break;
    }
    case 'juggle': {
      await dismissOwlIfNeeded(page);
      await tap('.juggle-roll-btn');
      await tap('.juggle-die.selectable');
      await tap('.juggle-shape-option');
      const cell = page.locator(
        '.juggle-board.player1 .juggle-cell[data-row="0"][data-col="0"]'
      );
      if (await cell.count()) {
        await cell.evaluate((el) => (el as HTMLElement).click());
        taps += 1;
      }
      break;
    }
    case 'contig-60': {
      await tap('.contig-roll-btn');
      if ((await page.locator('.contig-cell-valid').count()) > 0) {
        await tap('.contig-cell-valid');
      } else {
        await tap('.contig-pass-btn');
      }
      break;
    }
    case 'stars-bars': {
      await tap('.stars-card:not(.disabled)');
      await tap('.stars-cell.valid');
      break;
    }
    case 'fab-a-diffy': {
      await tap('.fab-bar-wrapper:not(.fab-bar-disabled)');
      await tap('.fab-op-valid, .fab-op-btn:not(.fab-op-disabled)');
      break;
    }
    case 'queens-guards': {
      await tap('[data-cell-key="5-7"]');
      await tap('[data-cell-key][aria-label*="valid move"]');
      break;
    }
    case 'prime-gold': {
      await tap('.pg-roll-btn, .prime-roll-btn');
      if ((await page.locator('.pg-cell.valid, .prime-cell.valid').count()) > 0) {
        await tap('.pg-cell.valid, .prime-cell.valid');
      } else {
        await tap('.pg-btn-secondary, .pg-pass-btn, button:has-text("Pass")');
      }
      break;
    }
    case 'remainder-islands': {
      await tap('.remainder-btn-roll, button:has-text("Roll")');
      const island = page.locator('.island.valid').first();
      if (await island.isVisible().catch(() => false)) {
        await island.evaluate((el) => {
          const hit = el.querySelector('polygon:last-of-type') ?? el;
          hit.dispatchEvent(
            new PointerEvent('pointerdown', {
              bubbles: true,
              cancelable: true,
              pointerType: 'touch',
            })
          );
          hit.dispatchEvent(
            new MouseEvent('click', {
              bubbles: true,
              cancelable: true,
              view: window,
            })
          );
        });
        taps += 1;
      }
      break;
    }
    case 'pent-em-in': {
      await tap('.pent-piece-option');
      await tap('.pent-board .interaction rect, .pent-board rect[data-row]');
      break;
    }
    case 'frac-fact': {
      await tap('.frac-choice-btn');
      await tap('.frac-continue-btn, button:has-text("Continue")');
      break;
    }
    case 'fraction-pinball': {
      await tap('.pinball-choice-btn');
      await tap('.pinball-continue-btn, button:has-text("Continue")');
      break;
    }
    default:
      break;
  }

  return taps;
}

type LayoutAudit = {
  overflowX: number;
  smallChrome: Array<{
    sel: string;
    w: number;
    h: number;
    id: string | null;
    className: string;
  }>;
  offScreenChrome: Array<{
    sel: string;
    id: string | null;
    className: string;
    top: number;
    left: number;
    bottom: number;
    right: number;
  }>;
  missingTouchAction: Array<{
    sel: string;
    id: string | null;
    className: string;
    touchAction: string;
  }>;
  hoverOnly: Array<{
    sel: string;
    id: string | null;
    className: string;
    opacity: string;
  }>;
};

async function auditLayout(page: Page): Promise<LayoutAudit> {
  return page.evaluate((chromeSel) => {
    const de = document.documentElement;
    const body = document.body;
    const overflowX = Math.max(
      0,
      Math.max(de.scrollWidth, body.scrollWidth) -
        Math.max(de.clientWidth, body.clientWidth)
    );
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const smallChrome: LayoutAudit['smallChrome'] = [];
    const offScreenChrome: LayoutAudit['offScreenChrome'] = [];
    const missingTouchAction: LayoutAudit['missingTouchAction'] = [];
    const hoverOnly: LayoutAudit['hoverOnly'] = [];

    const seen = new Set<Element>();
    for (const el of document.querySelectorAll(chromeSel)) {
      if (seen.has(el)) continue;
      seen.add(el);
      const style = getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden') continue;
      const r = el.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) continue;
      const id = el.id || null;
      const className =
        typeof (el as HTMLElement).className === 'string'
          ? String((el as HTMLElement).className).slice(0, 80)
          : (el.getAttribute('class') ?? '').slice(0, 80);
      const sel = id ? `#${id}` : el.tagName.toLowerCase();

      // Fully outside the viewport → hidden/off-screen control
      const fullyOff =
        r.bottom < 0 || r.top > vh || r.right < 0 || r.left > vw;
      if (fullyOff) {
        offScreenChrome.push({
          sel,
          id,
          className,
          top: Math.round(r.top),
          left: Math.round(r.left),
          bottom: Math.round(r.bottom),
          right: Math.round(r.right),
        });
        continue;
      }

      if (Number(style.opacity) === 0) {
        hoverOnly.push({
          sel,
          id,
          className,
          opacity: style.opacity,
        });
      }

      if (r.width < 44 || r.height < 44) {
        smallChrome.push({
          sel,
          w: Math.round(r.width * 10) / 10,
          h: Math.round(r.height * 10) / 10,
          id,
          className,
        });
      }

      // Primary action buttons should opt into touch-action: manipulation
      // (or none for intentional drag surfaces). Auto is a smell on chrome.
      if (
        el.matches(
          '#back-btn, #new-game-btn, #help-btn, #tutorial-btn, .button-row button, .collapse-toggle, .back-button'
        )
      ) {
        const ta = style.touchAction || 'auto';
        if (ta === 'auto') {
          missingTouchAction.push({
            sel,
            id,
            className,
            touchAction: ta,
          });
        }
      }
    }

    return {
      overflowX,
      smallChrome: smallChrome.slice(0, 20),
      offScreenChrome: offScreenChrome.slice(0, 12),
      missingTouchAction: missingTouchAction.slice(0, 12),
      hoverOnly: hoverOnly.slice(0, 12),
    };
  }, CHROME_SELECTORS);
}

function projectName(testInfoProject: string): string {
  return testInfoProject || 'mobile';
}

function writeGameReport(report: GameReport) {
  const dir = path.join(REPORT_ROOT, report.project);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    path.join(dir, `${report.gameId}.json`),
    JSON.stringify(report, null, 2)
  );
  rewriteSummaryMd();
}

function rewriteSummaryMd() {
  fs.mkdirSync(REPORT_ROOT, { recursive: true });
  const projects = fs
    .readdirSync(REPORT_ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  const lines: string[] = [
    '# Mobile touch smoke summary',
    '',
    `Generated: ${new Date().toISOString()}`,
    '',
    'Report-only: findings do not fail CI unless `MOBILE_TOUCH_ENFORCE=1`.',
    '',
  ];

  let totalOk = 0;
  let totalFail = 0;
  let totalIssues = 0;

  for (const project of projects) {
    const dir = path.join(REPORT_ROOT, project);
    const files = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith('.json'))
      .sort();
    lines.push(`## ${project}`, '');
    lines.push(
      '| Game | OK | Taps | Menus (NG/Help/Log) | Left | Issues |',
      '| ---- | -- | ---- | ------------------- | ---- | ------ |'
    );
    for (const file of files) {
      const report = JSON.parse(
        fs.readFileSync(path.join(dir, file), 'utf8')
      ) as GameReport;
      if (report.ok) totalOk += 1;
      else totalFail += 1;
      totalIssues += report.issues.length;
      const menus = `${report.menus.newGame ? 'Y' : 'N'}/${report.menus.help ? 'Y' : 'N'}/${
        report.menus.moveLog === 'absent'
          ? '—'
          : report.menus.moveLog
            ? 'Y'
            : 'N'
      }`;
      const issueBrief =
        report.issues.length === 0
          ? 'none'
          : report.issues
              .slice(0, 4)
              .map(
                (i) =>
                  `${i.kind}: ${i.detail
                    .replace(/\u001b\[[0-9;]*m/g, '')
                    .replace(/\s+/g, ' ')
                    .slice(0, 80)}`
              )
              .join('; ')
              .replace(/\|/g, '/');
      lines.push(
        `| ${report.gameId} | ${report.ok ? 'yes' : 'no'} | ${report.taps} | ${menus} | ${
          report.leftGame ? 'yes' : 'no'
        } | ${issueBrief} |`
      );
    }
    lines.push('');
  }

  lines.push(
    '## Totals',
    '',
    `- Game×project rows OK: ${totalOk}`,
    `- Game×project rows with hard failures: ${totalFail}`,
    `- Issue count (all kinds): ${totalIssues}`,
    ''
  );

  fs.writeFileSync(path.join(REPORT_ROOT, 'summary.md'), lines.join('\n'));
}

/** Close a shell modal via real tap (no force — force skips hit-testing and
 *  can miss the × control on phone emulation). Escape is the fallback. */
async function closeShellModal(page: Page, modalSel: string): Promise<void> {
  const modal = page.locator(modalSel);
  if (await modal.evaluate((el) => el.classList.contains('hidden'))) return;
  const close = page.locator(`${modalSel} .modal-close`);
  try {
    await close.tap({ timeout: 3_000 });
  } catch {
    // ignore — Escape below
  }
  if (!(await modal.evaluate((el) => el.classList.contains('hidden')))) {
    await page.keyboard.press('Escape');
  }
  await expect(modal).toHaveClass(/hidden/, { timeout: 5_000 });
}

async function openCloseMenus(page: Page): Promise<{
  newGame: boolean;
  help: boolean;
  moveLog: boolean | 'absent';
  issues: Issue[];
}> {
  const issues: Issue[] = [];
  let newGame = false;
  let help = false;
  let moveLog: boolean | 'absent' = 'absent';

  // New Game modal — real tap (force:true on × drops events in Chromium touch)
  try {
    await page.locator('#new-game-btn').tap();
    const modal = page.locator('#new-game-modal');
    await expect(modal).toBeVisible({ timeout: 5_000 });
    await closeShellModal(page, '#new-game-modal');
    newGame = true;
  } catch (err) {
    issues.push({
      kind: 'interaction',
      detail: `new-game menu: ${String((err as Error).message ?? err)
        .replace(/\u001b\[[0-9;]*m/g, '')
        .slice(0, 160)}`,
    });
    await page.keyboard.press('Escape').catch(() => {});
  }

  // Help modal
  try {
    await page.locator('#help-btn').tap();
    const modal = page.locator('#help-modal');
    await expect(modal).toBeVisible({ timeout: 5_000 });
    await closeShellModal(page, '#help-modal');
    help = true;
  } catch (err) {
    issues.push({
      kind: 'interaction',
      detail: `help menu: ${String((err as Error).message ?? err)
        .replace(/\u001b\[[0-9;]*m/g, '')
        .slice(0, 160)}`,
    });
    await page.keyboard.press('Escape').catch(() => {});
  }

  // Move-log badge (shared shell collapse toggle — Kings today)
  const toggle = page.locator('.collapse-toggle');
  if ((await toggle.count()) > 0) {
    try {
      const panel = page.locator('#move-history, .move-history').first();
      await toggle.first().tap();
      await expect(panel).toHaveClass(/collapsed/, { timeout: 3_000 });
      await toggle.first().tap();
      await expect(panel).not.toHaveClass(/collapsed/, { timeout: 3_000 });
      moveLog = true;
    } catch (err) {
      moveLog = false;
      issues.push({
        kind: 'interaction',
        detail: `move-log badge: ${String((err as Error).message ?? err)
          .replace(/\u001b\[[0-9;]*m/g, '')
          .slice(0, 160)}`,
      });
    }
  }

  return { newGame, help, moveLog, issues };
}

test.describe('Mobile touch smoke (report-only)', () => {
  test.beforeAll(() => {
    fs.mkdirSync(REPORT_ROOT, { recursive: true });
  });

  for (const game of AVAILABLE_GAMES) {
    test(`${game.id}: touch play + chrome`, async ({ page }, testInfo) => {
      test.setTimeout(90_000);
      const project = projectName(testInfo.project.name);
      const issues: Issue[] = [];
      let taps = 0;
      let menus: GameReport['menus'] = {
        newGame: false,
        help: false,
        moveLog: 'absent',
      };
      let leftGame = false;
      let ok = false;

      try {
        await gotoGame(page, game.id);
        await startHuman(page);
        await expect(page.locator('h1').first()).toContainText(titleStem(game), {
          timeout: 10_000,
        });
        await expect(mountLocator(page, game.id)).toBeVisible({
          timeout: 15_000,
        });

        const audit = await auditLayout(page);
        if (audit.overflowX > 1) {
          issues.push({
            kind: 'overflow',
            detail: `horizontal overflow ${audit.overflowX}px`,
          });
        }
        for (const t of audit.smallChrome) {
          const label = t.id ?? (t.className || t.sel);
          issues.push({
            kind: 'tap-target',
            detail: `${label} ${t.w}×${t.h}`,
          });
        }
        for (const t of audit.offScreenChrome) {
          const label = t.id ?? (t.className || t.sel);
          issues.push({
            kind: 'off-screen',
            detail: `${label} box=(${t.left},${t.top})-(${t.right},${t.bottom})`,
          });
        }
        for (const t of audit.missingTouchAction) {
          const label = t.id ?? (t.className || t.sel);
          issues.push({
            kind: 'touch-action',
            detail: `${label} touch-action=${t.touchAction}`,
          });
        }
        for (const t of audit.hoverOnly) {
          const label = t.id ?? (t.className || t.sel);
          issues.push({
            kind: 'hover-only',
            detail: `${label} opacity=${t.opacity}`,
          });
        }

        taps = await playLegalTaps(page, game.id);
        if (taps < 1) {
          issues.push({
            kind: 'interaction',
            detail: 'no legal taps completed',
          });
        }

        const menuResult = await openCloseMenus(page);
        menus = {
          newGame: menuResult.newGame,
          help: menuResult.help,
          moveLog: menuResult.moveLog,
        };
        issues.push(...menuResult.issues);

        // Prefer a real tap; force click is the fallback if the control is
        // momentarily covered (owl is pointer-events:none already).
        try {
          await page.locator('#back-btn').tap({ timeout: 5_000 });
        } catch {
          await page.locator('#back-btn').click({ force: true });
        }
        await expect(
          page.locator('.game-selector, .game-card').first()
        ).toBeVisible({ timeout: 10_000 });
        leftGame = true;
        ok = true;
      } catch (err) {
        issues.push({
          kind: 'error',
          detail: String((err as Error).message ?? err).slice(0, 240),
        });
        ok = false;
      }

      const viewport = page.viewportSize() ?? { width: 0, height: 0 };
      const report: GameReport = {
        gameId: game.id,
        project,
        viewport,
        ok,
        issues,
        taps,
        menus,
        leftGame,
      };
      writeGameReport(report);

      // eslint-disable-next-line no-console
      console.log(
        `[mobile-touch] [${project}] ${game.id}: ok=${ok} taps=${taps} issues=${issues.length}`
      );

      testInfo.annotations.push({
        type: 'mobile-touch',
        description: `${issues.length} issue(s) — see test-results/mobile/${project}/${game.id}.json`,
      });

      if (ENFORCE) {
        expect(issues, JSON.stringify(issues, null, 2)).toEqual([]);
        expect(ok).toBe(true);
      } else {
        // Report-only: always green; report files carry the findings.
        expect(report.gameId).toBe(game.id);
      }
    });
  }
});
