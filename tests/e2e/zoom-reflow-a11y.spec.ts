/**
 * WCAG 1.4.4 / 1.4.10 zoom + reflow audit (report-only).
 *
 * Modes (Chromium):
 * - browser-zoom-200: desktop viewport + CSS zoom 200%
 * - text-scale-200: desktop viewport + root font-size 200%
 * - reflow-320: 320×568 CSS px viewport (1.4.10)
 *
 * Checks: page-level horizontal overflow, clipped/overlapping shell chrome,
 * off-screen focusable chrome. Dense board geometry exceptions are tagged
 * (not treated as shell bugs).
 *
 * Writes `test-results/zoom-reflow/<mode>/<screenId>.json` and regenerates
 * `test-results/zoom-reflow/summary.md`. Screenshots under
 * `test-results/zoom-reflow/screenshots/`.
 *
 * Suite stays green unless `ZOOM_REFLOW_ENFORCE=1`. Not part of required CI
 * chromium e2e (dedicated project + optional report-only job).
 *
 * Task: burn-1008-mp-zoom-reflow. Does not duplicate #457/#486 (mobile tap),
 * #491 (keyboard), or #469 (axe contrast/ARIA).
 */
import { test, expect, type Page } from '@playwright/test';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { GAMES, type GameInfo } from '../../src/core/game-registry';
import { dismissOwl } from './helpers/page';

const AVAILABLE_GAMES = GAMES.filter((g) => g.available);
const REPORT_ROOT = path.join(process.cwd(), 'test-results', 'zoom-reflow');
const ENFORCE = process.env.ZOOM_REFLOW_ENFORCE === '1';

/** Shell / menu chrome — not dense board cells. */
const CHROME_FOCUSABLE = [
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
  '.division-tab',
  '.accordion-header',
  '.game-card[role="button"]',
  '.hero-progress-link',
  'a.skip-link',
].join(', ');

/** Boards known to need 2D layout (WCAG 1.4.10 exceptions / documented). */
const BOARD_EXCEPTIONS = new Set([
  'hex', // pinned 801px SVG for ≥44px cells; scroll contained in .hex-game-area
  'kings-quadraphages',
  'queens-guards',
  'fiar',
  'kwatro-sinko',
  'pent-em-in',
  'sum-dominoes',
  'star-track',
  'hex-a-gone',
]);

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

type ModeId = 'browser-zoom-200' | 'text-scale-200' | 'reflow-320';

type IssueKind =
  | 'horizontal-scroll'
  | 'clipped-control'
  | 'overlapping-controls'
  | 'off-screen-focusable';

type Issue = {
  kind: IssueKind;
  detail: string;
  /** True when the finding is a documented board-geometry exception. */
  boardException?: boolean;
};

type ScreenReport = {
  screenId: string;
  mode: ModeId;
  viewport: { width: number; height: number };
  zoom: number | null;
  textScale: number | null;
  ok: boolean;
  issues: Issue[];
  overflowX: number;
  screenshot: string | null;
};

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

async function applyMode(page: Page, mode: ModeId) {
  if (mode === 'reflow-320') {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.evaluate(() => {
      document.documentElement.style.zoom = '';
      document.documentElement.style.fontSize = '';
      document.documentElement.removeAttribute('data-zoom-reflow-text');
      document.documentElement.removeAttribute('data-zoom-reflow-zoom');
    });
    return;
  }

  await page.setViewportSize({ width: 1280, height: 800 });
  if (mode === 'browser-zoom-200') {
    await page.evaluate(() => {
      document.documentElement.style.fontSize = '';
      document.documentElement.removeAttribute('data-zoom-reflow-text');
      // Marker so zoom-reflow.css can apply without changing default baselines.
      document.documentElement.setAttribute('data-zoom-reflow-zoom', '200');
      // Chromium supports CSS zoom; approximates browser page zoom for layout.
      (document.documentElement.style as CSSStyleDeclaration & { zoom?: string }).zoom =
        '200%';
    });
    return;
  }

  // text-scale-200: enlarge rem/em text without shrinking the layout viewport.
  await page.evaluate(() => {
    (document.documentElement.style as CSSStyleDeclaration & { zoom?: string }).zoom =
      '';
    document.documentElement.removeAttribute('data-zoom-reflow-zoom');
    document.documentElement.style.fontSize = '200%';
    document.documentElement.setAttribute('data-zoom-reflow-text', '200');
  });
}

type LayoutAudit = {
  overflowX: number;
  clipped: Array<{ sel: string; id: string | null; className: string; reason: string }>;
  overlapping: Array<{ a: string; b: string; area: number }>;
  offScreen: Array<{
    sel: string;
    id: string | null;
    className: string;
    top: number;
    left: number;
    bottom: number;
    right: number;
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
    const clipped: LayoutAudit['clipped'] = [];
    const offScreen: LayoutAudit['offScreen'] = [];
    const boxes: Array<{
      el: Element;
      label: string;
      r: DOMRect;
      inModal: boolean;
    }> = [];

    const labelOf = (el: Element) => {
      const id = el.id || null;
      const className =
        typeof (el as HTMLElement).className === 'string'
          ? String((el as HTMLElement).className).slice(0, 80)
          : (el.getAttribute('class') ?? '').slice(0, 80);
      return {
        sel: id ? `#${id}` : el.tagName.toLowerCase(),
        id,
        className,
      };
    };

    /** True when an ancestor clips this element without offering a scrollport. */
    const isUnreachablyClipped = (el: Element, r: DOMRect): boolean => {
      let node: Element | null = el.parentElement;
      while (node && node !== document.documentElement) {
        const st = getComputedStyle(node);
        const ox = st.overflowX;
        const oy = st.overflowY;
        const clipsX = ox === 'hidden' || ox === 'clip';
        const clipsY = oy === 'hidden' || oy === 'clip';
        const scrollsX = ox === 'auto' || ox === 'scroll';
        const scrollsY = oy === 'auto' || oy === 'scroll';
        if (clipsX || clipsY || scrollsX || scrollsY) {
          const pr = node.getBoundingClientRect();
          const outsideX = r.right < pr.left - 1 || r.left > pr.right + 1;
          const outsideY = r.bottom < pr.top - 1 || r.top > pr.bottom + 1;
          if ((outsideX && (clipsX || scrollsX)) || (outsideY && (clipsY || scrollsY))) {
            // Scrollports can still bring the control into view.
            if (scrollsX || scrollsY) return false;
            return true;
          }
        }
        node = node.parentElement;
      }
      return false;
    };

    const openModal = document.querySelector('.modal:not(.hidden)');

    const seen = new Set<Element>();
    for (const el of document.querySelectorAll(chromeSel)) {
      if (seen.has(el)) continue;
      seen.add(el);
      // Collapsed accordion panels (and any inert/aria-hidden subtree) leave
      // the tab order — not a zoom/reflow finding.
      if (
        el.closest('[inert]') ||
        el.closest('[aria-hidden="true"]') ||
        (el as HTMLElement).inert
      ) {
        continue;
      }
      const style = getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden') continue;
      if (Number(style.opacity) === 0) continue;
      if (style.pointerEvents === 'none') continue;
      // Skip visually hidden skip-link until focused.
      if (el.classList.contains('skip-link') && document.activeElement !== el) {
        continue;
      }
      const r = el.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) continue;
      const meta = labelOf(el);
      const inModal = Boolean(el.closest('.modal:not(.hidden)'));

      // Below-the-fold / above-fold content is fine if page scrolling can reach it.
      // Flag only horizontally unreachable chrome, or vertical clip by overflow:hidden.
      if (isUnreachablyClipped(el, r)) {
        offScreen.push({
          ...meta,
          top: Math.round(r.top),
          left: Math.round(r.left),
          bottom: Math.round(r.bottom),
          right: Math.round(r.right),
        });
        continue;
      }

      // Horizontal clip against the layout viewport (not vertical scroll).
      const clipPad = 2;
      if (r.left < -clipPad || r.right > vw + clipPad) {
        // Internal board scrollports (e.g. .hex-game-area) are intentional.
        const inHScroll = Boolean(
          el.closest(
            '.hex-game-area, .history-content, [style*="overflow-x"], .modal-content'
          )
        );
        if (!inHScroll) {
          clipped.push({
            ...meta,
            reason: `rect=${Math.round(r.left)},${Math.round(r.top)} ${Math.round(r.width)}×${Math.round(r.height)} vw=${vw}×${vh}`,
          });
        }
      }

      boxes.push({
        el,
        label:
          meta.sel +
          (meta.className ? `.${meta.className.split(' ')[0]}` : ''),
        r,
        inModal,
      });
    }

    /** Visible overlap only — ignore layout boxes clipped by overflow ancestors. */
    const visibleOverlap = (a: DOMRect, elA: Element, b: DOMRect, elB: Element) => {
      const clipVisible = (el: Element, r: DOMRect): DOMRect => {
        let top = r.top;
        let left = r.left;
        let bottom = r.bottom;
        let right = r.right;
        let node: Element | null = el.parentElement;
        while (node && node !== document.documentElement) {
          const st = getComputedStyle(node);
          const ox = st.overflowX;
          const oy = st.overflowY;
          const clips =
            ox === 'hidden' ||
            ox === 'clip' ||
            oy === 'hidden' ||
            oy === 'clip' ||
            ox === 'auto' ||
            oy === 'auto' ||
            ox === 'scroll' ||
            oy === 'scroll';
          if (clips) {
            const pr = node.getBoundingClientRect();
            left = Math.max(left, pr.left);
            top = Math.max(top, pr.top);
            right = Math.min(right, pr.right);
            bottom = Math.min(bottom, pr.bottom);
          }
          node = node.parentElement;
        }
        return new DOMRect(left, top, Math.max(0, right - left), Math.max(0, bottom - top));
      };
      const va = clipVisible(elA, a);
      const vb = clipVisible(elB, b);
      const x1 = Math.max(va.left, vb.left);
      const y1 = Math.max(va.top, vb.top);
      const x2 = Math.min(va.right, vb.right);
      const y2 = Math.min(va.bottom, vb.bottom);
      return { w: x2 - x1, h: y2 - y1 };
    };

    const overlapping: LayoutAudit['overlapping'] = [];
    for (let i = 0; i < boxes.length; i++) {
      for (let j = i + 1; j < boxes.length; j++) {
        const a = boxes[i];
        const b = boxes[j];
        // Ignore nested pairs (button inside mode-option, etc.)
        if (a.el.contains(b.el) || b.el.contains(a.el)) continue;
        // Ignore backdrop-vs-modal pairs when a dialog is open.
        if (openModal && a.inModal !== b.inModal) continue;
        const { w, h } = visibleOverlap(a.r, a.el, b.r, b.el);
        if (w > 4 && h > 4) {
          overlapping.push({
            a: a.label,
            b: b.label,
            area: Math.round(w * h),
          });
        }
      }
    }

    return {
      overflowX,
      clipped: clipped.slice(0, 20),
      overlapping: overlapping.slice(0, 20),
      offScreen: offScreen.slice(0, 20),
    };
  }, CHROME_FOCUSABLE);
}

function issuesFromAudit(
  audit: LayoutAudit,
  screenId: string
): Issue[] {
  const issues: Issue[] = [];
  const gameId = screenId.replace(/-(board|new-game-modal|help-modal)$/, '');
  const boardException =
    BOARD_EXCEPTIONS.has(gameId) && /-(board)$/.test(screenId);

  if (audit.overflowX > 2) {
    issues.push({
      kind: 'horizontal-scroll',
      detail: `page overflowX=${audit.overflowX}px`,
      boardException: boardException && audit.overflowX < 520,
    });
  }
  for (const c of audit.clipped) {
    issues.push({
      kind: 'clipped-control',
      detail: `${c.sel} ${c.className} — ${c.reason}`,
    });
  }
  for (const o of audit.overlapping) {
    issues.push({
      kind: 'overlapping-controls',
      detail: `${o.a} ∩ ${o.b} (~${o.area}px²)`,
    });
  }
  for (const off of audit.offScreen) {
    issues.push({
      kind: 'off-screen-focusable',
      detail: `${off.sel} ${off.className} @ (${off.left},${off.top})-(${off.right},${off.bottom})`,
    });
  }
  return issues;
}

function writeReport(report: ScreenReport) {
  const dir = path.join(REPORT_ROOT, report.mode);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    path.join(dir, `${report.screenId}.json`),
    JSON.stringify(report, null, 2)
  );
  rewriteSummaryMd();
}

function rewriteSummaryMd() {
  fs.mkdirSync(REPORT_ROOT, { recursive: true });
  const modes = fs
    .readdirSync(REPORT_ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory() && d.name !== 'screenshots')
    .map((d) => d.name)
    .sort();

  const lines: string[] = [
    '# Zoom / reflow a11y summary (WCAG 1.4.4 / 1.4.10)',
    '',
    `Generated: ${new Date().toISOString()}`,
    '',
    'Report-only: findings do not fail CI unless `ZOOM_REFLOW_ENFORCE=1`.',
    '',
    'Modes: `browser-zoom-200`, `text-scale-200`, `reflow-320`.',
    '',
  ];

  for (const mode of modes) {
    const dir = path.join(REPORT_ROOT, mode);
    const files = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith('.json'))
      .sort();
    lines.push(`## ${mode}`, '');
    lines.push(
      '| Screen | OK | OverflowX | Issues | Board exception flagged |',
      '| ------ | -- | --------- | ------ | ----------------------- |'
    );
    for (const file of files) {
      const report = JSON.parse(
        fs.readFileSync(path.join(dir, file), 'utf8')
      ) as ScreenReport;
      const actionable = report.issues.filter((i) => !i.boardException);
      const ok = actionable.length === 0;
      const detail =
        report.issues.length === 0
          ? '—'
          : report.issues
              .map((i) => `${i.kind}${i.boardException ? '*' : ''}: ${i.detail}`)
              .join('<br>');
      const be = report.issues.some((i) => i.boardException) ? 'yes' : '—';
      lines.push(
        `| ${report.screenId} | ${ok ? 'yes' : 'no'} | ${report.overflowX} | ${detail} | ${be} |`
      );
    }
    lines.push('');
  }

  fs.writeFileSync(path.join(REPORT_ROOT, 'summary.md'), lines.join('\n'));
}

async function runScreenAudit(
  page: Page,
  mode: ModeId,
  screenId: string,
  setup: () => Promise<void>
): Promise<ScreenReport> {
  await applyMode(page, mode);
  await setup();
  // Settle layout after zoom/font changes.
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      })
  );
  const audit = await auditLayout(page);
  const issues = issuesFromAudit(audit, screenId);
  const actionable = issues.filter((i) => !i.boardException);

  const shotDir = path.join(REPORT_ROOT, 'screenshots', mode);
  fs.mkdirSync(shotDir, { recursive: true });
  const shotPath = path.join(shotDir, `${screenId}.png`);
  await page.screenshot({ path: shotPath, fullPage: true }).catch(() => null);

  const report: ScreenReport = {
    screenId,
    mode,
    viewport: page.viewportSize() ?? { width: 0, height: 0 },
    zoom: mode === 'browser-zoom-200' ? 2 : null,
    textScale: mode === 'text-scale-200' ? 2 : null,
    ok: actionable.length === 0,
    issues,
    overflowX: audit.overflowX,
    screenshot: shotPath,
  };
  writeReport(report);
  return report;
}

function assertReportOnly(report: ScreenReport) {
  const actionable = report.issues.filter((i) => !i.boardException);
  // Always annotate for the HTML report.
  test.info().annotations.push({
    type: 'zoom-reflow',
    description: `${report.mode}/${report.screenId}: ${actionable.length} actionable / ${report.issues.length} total — see test-results/zoom-reflow/`,
  });
  // eslint-disable-next-line no-console
  console.log(
    `[zoom-reflow] ${report.mode}/${report.screenId}: overflowX=${report.overflowX} issues=${report.issues.length} actionable=${actionable.length}`
  );
  if (ENFORCE && actionable.length > 0) {
    expect(
      actionable,
      `[zoom-reflow ENFORCE] ${report.mode}/${report.screenId}\n${actionable.map((i) => `${i.kind}: ${i.detail}`).join('\n')}`
    ).toEqual([]);
  } else {
    expect(report.issues).toBeDefined();
  }
}

const MODES: ModeId[] = ['browser-zoom-200', 'text-scale-200', 'reflow-320'];

test.describe('WCAG zoom/reflow audit (report-only)', () => {
  test.beforeAll(() => {
    fs.mkdirSync(REPORT_ROOT, { recursive: true });
  });

  for (const mode of MODES) {
    test.describe(mode, () => {
      test(`menu-home @ ${mode}`, async ({ page }) => {
        test.setTimeout(90_000);
        const report = await runScreenAudit(page, mode, 'menu-home', async () => {
          await page.goto('/#/');
          await expect(
            page.locator('.game-card, .menu-game-card, h1').first()
          ).toBeVisible({ timeout: 15_000 });
          await dismissOwl(page);
        });
        assertReportOnly(report);
      });

      // Shell modals — opened from a representative game (Prime Gold).
      test(`shell-new-game-modal @ ${mode}`, async ({ page }) => {
        test.setTimeout(90_000);
        const report = await runScreenAudit(
          page,
          mode,
          'shell-new-game-modal',
          async () => {
            await page.goto('/#/game/prime-gold');
            await waitForGameReady(page);
            await startHuman(page);
            await page.locator('#new-game-btn').click({ force: true });
            await expect(page.locator('#new-game-modal')).not.toHaveClass(
              /hidden/
            );
            await dismissOwl(page);
          }
        );
        assertReportOnly(report);
      });

      test(`shell-help-modal @ ${mode}`, async ({ page }) => {
        test.setTimeout(90_000);
        const report = await runScreenAudit(
          page,
          mode,
          'shell-help-modal',
          async () => {
            await page.goto('/#/game/prime-gold');
            await waitForGameReady(page);
            await startHuman(page);
            await page.locator('#help-btn').click({ force: true });
            await expect(page.locator('#help-modal')).not.toHaveClass(/hidden/);
            await dismissOwl(page);
          }
        );
        assertReportOnly(report);
      });

      for (const game of AVAILABLE_GAMES) {
        test(`${game.id}-board @ ${mode}`, async ({ page }) => {
          test.setTimeout(90_000);
          const report = await runScreenAudit(
            page,
            mode,
            `${game.id}-board`,
            async () => {
              await page.goto(`/#/game/${game.id}`);
              await startHuman(page);
              await expect(page.locator('h1').first()).toContainText(
                titleStem(game),
                { timeout: 10_000 }
              );
              const mount = MOUNT[game.id] ?? '#board, #game-container, main';
              await expect(page.locator(mount).first()).toBeVisible({
                timeout: 15_000,
              });
            }
          );
          assertReportOnly(report);
        });
      }
    });
  }
});
