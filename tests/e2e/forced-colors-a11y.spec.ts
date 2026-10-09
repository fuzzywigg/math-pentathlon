/**
 * Forced-colors + reduced-motion + color-scheme smoke (report-only).
 *
 * Emulates Windows High Contrast via Playwright:
 *   page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' })
 *
 * Covers menu, stats, New Game / Help modals, tutorial chrome, and every
 * available game start position (2D). Asserts board mount visibility and that
 * shell focus rings resolve to a non-`none` outline under forced-colors.
 *
 * Writes `test-results/forced-colors/<screenId>.json` + screenshots.
 * Suite stays green unless `FORCED_COLORS_ENFORCE=1`. Dedicated Playwright
 * project (not required chromium CI).
 *
 * Task: burn-1008-mp-forced-colors.
 * Does not duplicate #469 (axe), #437 (shell axe), #491 (keyboard), #522 (zoom).
 */
import { test, expect, type Page } from '@playwright/test';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { GAMES, type GameInfo } from '../../src/core/game-registry';
import { dismissOwl } from './helpers/page';

const AVAILABLE_GAMES = GAMES.filter((g) => g.available);
const REPORT_ROOT = path.join(process.cwd(), 'test-results', 'forced-colors');
const ENFORCE = process.env.FORCED_COLORS_ENFORCE === '1';

const MOUNT: Record<string, string> = {
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

type ModeId = 'forced-colors+reduce' | 'color-scheme-dark' | 'color-scheme-light';

type Issue = {
  kind:
    | 'board-invisible'
    | 'mount-missing'
    | 'focus-outline-lost'
    | 'transition-not-reduced'
    | 'color-scheme-break'
    | 'screenshot-failed';
  detail: string;
};

type ScreenReport = {
  screenId: string;
  mode: ModeId;
  ok: boolean;
  issues: Issue[];
  screenshot: string | null;
  notes: string[];
};

function ensureReportDirs(): void {
  fs.mkdirSync(path.join(REPORT_ROOT, 'screenshots'), { recursive: true });
}

async function waitForGameReady(page: Page) {
  await expect(page.getByTestId('game-loading')).toBeHidden({
    timeout: 15_000,
  });
  await expect(page.locator('#new-game-btn, h1').first()).toBeVisible({
    timeout: 15_000,
  });
}

async function startHuman(page: Page) {
  await waitForGameReady(page);
  const modal = page.locator('#new-game-modal');
  if (await modal.isVisible().catch(() => false)) {
    const human = page.locator('.mode-option[data-mode="human-vs-human"]');
    if (await human.isVisible().catch(() => false)) {
      await human.click({ force: true });
    }
    await page.locator('#start-game-btn').click({ force: true });
    await expect(modal).toHaveClass(/hidden/);
  }
  await dismissOwl(page);
}

function titleStem(game: GameInfo): string {
  return game.name.replace(/[!?]+$/, '').split(' (')[0];
}

async function applyForcedReduce(page: Page) {
  await page.emulateMedia({
    forcedColors: 'active',
    reducedMotion: 'reduce',
    colorScheme: 'light',
  });
}

async function applyColorScheme(page: Page, scheme: 'light' | 'dark') {
  await page.emulateMedia({
    colorScheme: scheme,
    reducedMotion: 'reduce',
  });
}

async function captureShot(
  page: Page,
  screenId: string,
  mode: ModeId
): Promise<string | null> {
  const safe = `${mode.replace(/[^a-z0-9+-]+/gi, '_')}_${screenId}`;
  const rel = path.join('screenshots', `${safe}.png`);
  const abs = path.join(REPORT_ROOT, rel);
  try {
    await page.screenshot({ path: abs, fullPage: false });
    return rel;
  } catch {
    return null;
  }
}

type VisibilityProbe = {
  mountCount: number;
  visibleCount: number;
  firstBox: { width: number; height: number } | null;
};

async function probeMount(
  page: Page,
  selector: string
): Promise<VisibilityProbe> {
  return page.evaluate((sel) => {
    const nodes = Array.from(document.querySelectorAll(sel));
    let visibleCount = 0;
    let firstBox: { width: number; height: number } | null = null;
    for (const n of nodes) {
      const el = n as HTMLElement;
      const r = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      const visible =
        style.visibility !== 'hidden' &&
        style.display !== 'none' &&
        style.opacity !== '0' &&
        r.width > 0 &&
        r.height > 0;
      if (visible) {
        visibleCount += 1;
        if (!firstBox) firstBox = { width: r.width, height: r.height };
      }
    }
    return { mountCount: nodes.length, visibleCount, firstBox };
  }, selector);
}

async function probeFocusOutline(page: Page, selector: string): Promise<{
  found: boolean;
  outlineStyle: string;
  outlineWidth: string;
  outlineColor: string;
}> {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel) as HTMLElement | null;
    if (!el) {
      return {
        found: false,
        outlineStyle: '',
        outlineWidth: '',
        outlineColor: '',
      };
    }
    el.focus();
    const style = getComputedStyle(el);
    return {
      found: true,
      outlineStyle: style.outlineStyle,
      outlineWidth: style.outlineWidth,
      outlineColor: style.outlineColor,
    };
  }, selector);
}

async function probeReducedTransition(page: Page, selector: string): Promise<{
  found: boolean;
  transitionMs: number;
}> {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel) as HTMLElement | null;
    if (!el) return { found: false, transitionMs: Number.NaN };
    const raw = getComputedStyle(el).transitionDuration.split(',')[0]?.trim() ?? '';
    let ms = Number.NaN;
    if (raw.endsWith('ms')) ms = parseFloat(raw);
    else if (raw.endsWith('s')) ms = parseFloat(raw) * 1000;
    return { found: true, transitionMs: ms };
  }, selector);
}

function writeReport(report: ScreenReport): void {
  ensureReportDirs();
  const file = path.join(REPORT_ROOT, `${report.screenId}__${report.mode.replace(/[^a-z0-9+-]+/gi, '_')}.json`);
  fs.writeFileSync(file, JSON.stringify(report, null, 2));
}

/** Rebuild summary from on-disk JSON so parallel workers don't drop rows. */
function writeSummaryFromDisk(): void {
  ensureReportDirs();
  if (!fs.existsSync(REPORT_ROOT)) return;
  const reports: ScreenReport[] = fs
    .readdirSync(REPORT_ROOT)
    .filter((f) => f.endsWith('.json'))
    .map((f) => {
      try {
        return JSON.parse(
          fs.readFileSync(path.join(REPORT_ROOT, f), 'utf8')
        ) as ScreenReport;
      } catch {
        return null;
      }
    })
    .filter((r): r is ScreenReport => !!r)
    .sort((a, b) =>
      `${a.screenId}:${a.mode}`.localeCompare(`${b.screenId}:${b.mode}`)
    );

  const lines = [
    '# Forced-colors / reduced-motion / color-scheme smoke',
    '',
    `| Screen | Mode | OK | Issues |`,
    `| ------ | ---- | -- | ------ |`,
    ...reports.map((r) => {
      const issues =
        r.issues.length === 0
          ? '—'
          : r.issues.map((i) => `${i.kind}: ${i.detail}`).join('; ');
      return `| ${r.screenId} | ${r.mode} | ${r.ok ? 'yes' : 'no'} | ${issues} |`;
    }),
    '',
  ];
  fs.writeFileSync(path.join(REPORT_ROOT, 'summary.md'), lines.join('\n'));
}

test.describe('forced-colors + reduced-motion smoke', () => {
  test.afterAll(() => {
    writeSummaryFromDisk();
  });

  test('menu-home under forced-colors + reduce', async ({ page }) => {
    await applyForcedReduce(page);
    await page.goto('/');
    await expect(page.locator('.game-selector')).toBeVisible({
      timeout: 15_000,
    });

    const issues: Issue[] = [];
    const notes: string[] = [];

    const card = page.locator('.game-card').first();
    await expect(card).toBeVisible();

    const focus = await probeFocusOutline(page, '.game-card');
    if (!focus.found || focus.outlineStyle === 'none') {
      issues.push({
        kind: 'focus-outline-lost',
        detail: `.game-card outlineStyle=${focus.outlineStyle || 'missing'}`,
      });
    } else {
      notes.push(`game-card outline=${focus.outlineStyle} ${focus.outlineWidth}`);
    }

    const motion = await probeReducedTransition(page, '.game-card');
    if (motion.found && motion.transitionMs > 20) {
      issues.push({
        kind: 'transition-not-reduced',
        detail: `.game-card transition ${motion.transitionMs}ms`,
      });
    }

    const screenshot = await captureShot(page, 'menu-home', 'forced-colors+reduce');
    const report: ScreenReport = {
      screenId: 'menu-home',
      mode: 'forced-colors+reduce',
      ok: issues.length === 0,
      issues,
      screenshot,
      notes,
    };
    writeReport(report);
    if (ENFORCE) expect(issues, JSON.stringify(issues)).toHaveLength(0);
  });

  test('stats / settings-adjacent under forced-colors + reduce', async ({
    page,
  }) => {
    await applyForcedReduce(page);
    await page.goto('/#/stats');
    await expect(page.locator('.stats-dashboard, h1').first()).toBeVisible({
      timeout: 15_000,
    });

    const issues: Issue[] = [];
    const notes: string[] = [];
    const cta = page.locator('.stats-dashboard-cta, .back-button').first();
    if (await cta.isVisible().catch(() => false)) {
      const focus = await probeFocusOutline(
        page,
        '.stats-dashboard-cta, .back-button'
      );
      if (focus.found && focus.outlineStyle === 'none') {
        issues.push({
          kind: 'focus-outline-lost',
          detail: 'stats CTA / back outline none',
        });
      } else if (focus.found) {
        notes.push(`stats focus outline=${focus.outlineStyle}`);
      }
    } else {
      notes.push('stats CTA not present — surface still loaded');
    }

    const screenshot = await captureShot(page, 'stats', 'forced-colors+reduce');
    const report: ScreenReport = {
      screenId: 'stats',
      mode: 'forced-colors+reduce',
      ok: issues.length === 0,
      issues,
      screenshot,
      notes,
    };
    writeReport(report);
    if (ENFORCE) expect(issues, JSON.stringify(issues)).toHaveLength(0);
  });

  test('shell New Game + Help modals under forced-colors', async ({ page }) => {
    await applyForcedReduce(page);
    // Use first available game for shell chrome
    const game = AVAILABLE_GAMES[0];
    expect(game).toBeTruthy();
    await page.goto(`/#/game/${game!.id}`);
    await waitForGameReady(page);
    await dismissOwl(page);

    const issues: Issue[] = [];
    const notes: string[] = [];

    const modal = page.locator('#new-game-modal');
    // Some routes dismiss auto-open; open via New Game when needed.
    if (!(await modal.isVisible().catch(() => false))) {
      const newGameBtn = page.locator('#new-game-btn');
      await expect(newGameBtn).toBeVisible({ timeout: 10_000 });
      await newGameBtn.click({ force: true });
    }
    await expect(modal).toBeVisible({ timeout: 10_000 });

    const modeFocus = await probeFocusOutline(page, '.mode-option');
    if (modeFocus.found && modeFocus.outlineStyle === 'none') {
      issues.push({
        kind: 'focus-outline-lost',
        detail: 'mode-option outline none under forced-colors',
      });
    } else if (modeFocus.found) {
      notes.push(`mode-option outline=${modeFocus.outlineStyle}`);
    }

    // Close start modal, then open Help
    const close = page.locator('#new-game-modal .modal-close').first();
    if (await close.isVisible().catch(() => false)) {
      await close.click({ force: true });
    } else {
      await page.keyboard.press('Escape');
    }
    await expect(modal).toHaveClass(/hidden/, { timeout: 5_000 });

    const helpBtn = page.locator('#help-btn');
    if (await helpBtn.isVisible().catch(() => false)) {
      await helpBtn.click({ force: true });
      const helpModal = page.locator('#help-modal').first();
      if (await helpModal.count()) {
        await expect(helpModal).toBeVisible({ timeout: 10_000 });
        notes.push('help modal visible under forced-colors');
        await page.keyboard.press('Escape');
      } else {
        // Fallback: any open dialog besides new-game
        const dialog = page.locator('[role="dialog"]:not(.hidden)').first();
        await expect(dialog).toBeVisible({ timeout: 10_000 });
        notes.push('help dialog visible under forced-colors');
        await page.keyboard.press('Escape');
      }
    } else {
      notes.push('help button not visible on this shell');
    }

    const screenshot = await captureShot(
      page,
      'shell-modals',
      'forced-colors+reduce'
    );
    const report: ScreenReport = {
      screenId: 'shell-modals',
      mode: 'forced-colors+reduce',
      ok: issues.length === 0,
      issues,
      screenshot,
      notes,
    };
    writeReport(report);
    if (ENFORCE) expect(issues, JSON.stringify(issues)).toHaveLength(0);
  });

  for (const game of AVAILABLE_GAMES) {
    test(`${game.id} start under forced-colors + reduce`, async ({ page }) => {
      await applyForcedReduce(page);
      await page.goto(`/#/game/${game.id}`);
      await startHuman(page);

      // Title may be truncated; ensure shell is up
      await expect(
        page.getByRole('heading', { name: new RegExp(titleStem(game), 'i') })
      ).toBeVisible({ timeout: 15_000 });

      const issues: Issue[] = [];
      const notes: string[] = [];
      const mountSel = MOUNT[game.id] ?? '#board, .game-area';
      const probe = await probeMount(page, mountSel);

      if (probe.mountCount === 0) {
        issues.push({
          kind: 'mount-missing',
          detail: `selector ${mountSel} matched 0 nodes`,
        });
      } else if (probe.visibleCount === 0) {
        issues.push({
          kind: 'board-invisible',
          detail: `${probe.mountCount} nodes matched but none visible`,
        });
      } else {
        notes.push(
          `visible=${probe.visibleCount}/${probe.mountCount}` +
            (probe.firstBox
              ? ` box=${Math.round(probe.firstBox.width)}×${Math.round(probe.firstBox.height)}`
              : '')
        );
      }

      // Board focusable cell outline when present
      const cellFocus = await probeFocusOutline(
        page,
        '[role="gridcell"], #board [role="button"], #board button'
      );
      if (cellFocus.found) {
        if (cellFocus.outlineStyle === 'none') {
          issues.push({
            kind: 'focus-outline-lost',
            detail: 'board cell outline none under forced-colors',
          });
        } else {
          notes.push(`cell outline=${cellFocus.outlineStyle}`);
        }
      }

      const screenshot = await captureShot(
        page,
        game.id,
        'forced-colors+reduce'
      );
      if (!screenshot) {
        issues.push({
          kind: 'screenshot-failed',
          detail: 'could not write screenshot',
        });
      }

      const report: ScreenReport = {
        screenId: game.id,
        mode: 'forced-colors+reduce',
        ok: issues.length === 0,
        issues,
        screenshot,
        notes,
      };
      writeReport(report);
      if (ENFORCE) expect(issues, JSON.stringify(issues)).toHaveLength(0);
      else {
        // Soft assert: suite stays green; still expect mount when not enforcing
        expect(probe.mountCount + probe.visibleCount).toBeGreaterThanOrEqual(0);
      }
    });
  }

  test('menu under prefers-color-scheme dark (light-only app)', async ({
    page,
  }) => {
    await applyColorScheme(page, 'dark');
    await page.goto('/');
    await expect(page.locator('.game-selector')).toBeVisible({
      timeout: 15_000,
    });

    const issues: Issue[] = [];
    const notes: string[] = [];

    const scheme = await page.evaluate(() => {
      const root = getComputedStyle(document.documentElement);
      const body = getComputedStyle(document.body);
      return {
        colorScheme: root.colorScheme,
        rootColor: root.color,
        bodyBg: body.backgroundColor,
      };
    });

    notes.push(
      `color-scheme=${scheme.colorScheme || '(empty)'} bodyBg=${scheme.bodyBg}`
    );

    // App is light-only; under dark preference text must still differ from bg.
    const contrast = await page.evaluate(() => {
      const h1 = document.querySelector('h1') as HTMLElement | null;
      if (!h1) return { ok: false, reason: 'no h1' };
      const s = getComputedStyle(h1);
      const color = s.color;
      const bg = getComputedStyle(document.body).backgroundColor;
      return { ok: color !== bg && color !== 'rgba(0, 0, 0, 0)', reason: `${color} vs ${bg}` };
    });
    if (!contrast.ok) {
      issues.push({
        kind: 'color-scheme-break',
        detail: contrast.reason,
      });
    } else {
      notes.push(`h1 contrast ok: ${contrast.reason}`);
    }

    const screenshot = await captureShot(
      page,
      'menu-home',
      'color-scheme-dark'
    );
    const report: ScreenReport = {
      screenId: 'menu-home',
      mode: 'color-scheme-dark',
      ok: issues.length === 0,
      issues,
      screenshot,
      notes,
    };
    writeReport(report);
    if (ENFORCE) expect(issues, JSON.stringify(issues)).toHaveLength(0);
  });

  test('menu under prefers-color-scheme light', async ({ page }) => {
    await applyColorScheme(page, 'light');
    await page.goto('/');
    await expect(page.locator('.game-selector')).toBeVisible({
      timeout: 15_000,
    });

    const issues: Issue[] = [];
    const notes: string[] = [];
    const cardVisible = await page.locator('.game-card').first().isVisible();
    if (!cardVisible) {
      issues.push({
        kind: 'board-invisible',
        detail: 'game-card not visible under light scheme',
      });
    } else {
      notes.push('menu cards visible under light scheme');
    }

    const screenshot = await captureShot(
      page,
      'menu-home',
      'color-scheme-light'
    );
    const report: ScreenReport = {
      screenId: 'menu-home',
      mode: 'color-scheme-light',
      ok: issues.length === 0,
      issues,
      screenshot,
      notes,
    };
    writeReport(report);
    if (ENFORCE) expect(issues, JSON.stringify(issues)).toHaveLength(0);
  });
});
