/**
 * axe-core accessibility scan for every available game screen (2D).
 *
 * Default mode is report-only: violations are logged and written under
 * `test-results/a11y-axe/` but do not fail the suite.
 *
 * Set `A11Y_AXE_ENFORCE=1` to fail on serious/critical violations for rules
 * listed in ENFORCED_RULES (after clear fixes land).
 *
 * No rules/scoring changes — UI / ARIA / CSS only.
 */
import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import type { Result, AxeResults } from 'axe-core';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { GAMES, type GameInfo } from '../../src/core/game-registry';
import {
  dismissOwlIfNeeded,
  gotoGame,
  startHuman,
  waitForGameReady,
  GAME_MOUNT as MOUNT,
} from './helpers/page';

const AVAILABLE_GAMES = GAMES.filter((g) => g.available);
const REPORT_DIR = path.join(process.cwd(), 'test-results', 'a11y-axe');
const ENFORCE = process.env.A11Y_AXE_ENFORCE === '1';

/** Rules we treat as “clear” once fixed — still report-only unless ENFORCE. */
const ENFORCED_RULES = new Set([
  'button-name',
  'link-name',
  'label',
  'image-alt',
  'input-button-name',
  'select-name',
  'aria-command-name',
  'aria-input-field-name',
  'aria-toggle-field-name',
  'aria-progressbar-name',
  'aria-tooltip-name',
  'aria-meter-name',
  'nested-interactive',
  'focus-order-semantics',
  'tabindex',
]);

/** Wait out entrance fades so axe contrast isn't measured mid-animation. */
async function waitForVisualSettle(page: Page) {
  await page.evaluate(async () => {
    const sel = document.querySelector('.game-selector') as HTMLElement | null;
    if (sel) {
      await new Promise<void>((resolve) => {
        const start = performance.now();
        const tick = () => {
          const opacity = Number.parseFloat(getComputedStyle(sel).opacity);
          if (opacity >= 0.99 || performance.now() - start > 2000) {
            resolve();
            return;
          }
          requestAnimationFrame(tick);
        };
        tick();
      });
      sel.style.opacity = '1';
      sel.style.animation = 'none';
    }
    // Allow one frame for layout/CSS vars after Start.
    await new Promise((r) => requestAnimationFrame(() => r(null)));
  });
}

function titleStem(game: GameInfo): string {
  return game.name.replace(/[!?]+$/, '').split(' (')[0];
}

function summarizeViolations(violations: Result[]): string {
  if (violations.length === 0) return 'none';
  return violations
    .map((v) => {
      const nodes = v.nodes
        .slice(0, 5)
        .map((n) => `    - ${n.target.join(' ')}: ${n.failureSummary ?? ''}`)
        .join('\n');
      return `  [${v.impact ?? 'unknown'}] ${v.id} (${v.nodes.length}): ${v.help}\n${nodes}`;
    })
    .join('\n');
}

function writeReport(gameId: string, results: AxeResults) {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  const out = path.join(REPORT_DIR, `${gameId}.json`);
  fs.writeFileSync(
    out,
    JSON.stringify(
      {
        gameId,
        url: results.url,
        timestamp: results.timestamp,
        violationCount: results.violations.length,
        violations: results.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          help: v.help,
          description: v.description,
          tags: v.tags,
          nodes: v.nodes.map((n) => ({
            target: n.target,
            html: n.html.slice(0, 240),
            failureSummary: n.failureSummary,
          })),
        })),
        incomplete: results.incomplete.map((v) => ({
          id: v.id,
          impact: v.impact,
          help: v.help,
          nodeCount: v.nodes.length,
        })),
      },
      null,
      2
    )
  );
}

function enforceableViolations(violations: Result[]): Result[] {
  return violations.filter(
    (v) =>
      ENFORCED_RULES.has(v.id) &&
      (v.impact === 'serious' || v.impact === 'critical')
  );
}

test.describe('axe-core game screen audit (2D, report-only)', () => {
  test.beforeAll(() => {
    fs.mkdirSync(REPORT_DIR, { recursive: true });
  });

  for (const game of AVAILABLE_GAMES) {
    test(`${game.id}: axe scan after Start (human 2D)`, async ({ page }) => {
      test.setTimeout(90_000);
      await gotoGame(page, game.id);
      await startHuman(page);
      await waitForVisualSettle(page);

      await expect(page.locator('h1').first()).toContainText(titleStem(game), {
        timeout: 10_000,
      });
      const mountSel = MOUNT[game.id] ?? '#board, #game-container, main';
      await expect(page.locator(mountSel).first()).toBeVisible({
        timeout: 15_000,
      });

      // Exclude decorative/offscreen chrome that commonly false-positives:
      // minimized owl stack, skip-link (offscreen until focus), 3D canvases.
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'])
        .exclude('#ollie-owl')
        .exclude('canvas')
        .exclude('.skip-link')
        .analyze();

      writeReport(game.id, results);

      const summary = summarizeViolations(results.violations);
      // Always surface findings in the Playwright report / CI log.
      // eslint-disable-next-line no-console
      console.log(
        `[a11y-axe] ${game.id}: ${results.violations.length} violation(s)\n${summary}`
      );

      const blocking = enforceableViolations(results.violations);
      if (ENFORCE && blocking.length > 0) {
        expect(
          blocking,
          `[a11y-axe ENFORCE] ${game.id}:\n${summarizeViolations(blocking)}`
        ).toEqual([]);
      } else {
        // Report-only: suite stays green; attachment proves the scan ran.
        expect(results.violations, summary).toBeDefined();
        test.info().annotations.push({
          type: 'a11y-axe',
          description: `${results.violations.length} violation(s) — see test-results/a11y-axe/${game.id}.json`,
        });
      }
    });
  }

  test('menu home: axe scan', async ({ page }) => {
    await page.goto('/#/');
    await expect(page.locator('.game-card, .menu-game-card, h1').first()).toBeVisible({
      timeout: 15_000,
    });
    await waitForVisualSettle(page);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'])
      .exclude('#ollie-owl')
      .exclude('canvas')
      .exclude('.skip-link')
      .analyze();
    writeReport('menu-home', results);
    // eslint-disable-next-line no-console
    console.log(
      `[a11y-axe] menu-home: ${results.violations.length} violation(s)\n${summarizeViolations(results.violations)}`
    );
    // q-mp-114: tip already dropped duplicate section aria-labelledby (q-mp-057);
    // keep landmark-unique hard-zero so the soft hold cannot regress silently.
    const landmarkUnique = results.violations.filter(
      (v) => v.id === 'landmark-unique'
    );
    expect(
      landmarkUnique,
      `[a11y-axe] menu-home landmark-unique:\n${summarizeViolations(landmarkUnique)}`
    ).toEqual([]);
    expect(results.violations).toBeDefined();
  });
});
