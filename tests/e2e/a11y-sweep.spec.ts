/**
 * Automated accessibility sweep (axe-core) over shared shell surfaces:
 * menu, progress/settings-adjacent, help/rules, and each game's New Game start modal.
 *
 * Asserts serious/critical only. Game board interiors are excluded so per-game
 * playtest agents can own board-level a11y without this suite blocking them.
 */
import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { GAMES } from '../../src/core/game-registry';

const AVAILABLE_GAMES = GAMES.filter((g) => g.available);

/** Shell chrome + modals — exclude live boards / 3D / owl overlay. */
const BOARD_EXCLUDES = [
  '#board',
  '[id$="-board"]',
  '.game-area',
  '.hex-game-area',
  '#ollie-owl',
  '[class*="-a11y-grid"]',
  '[class*="-a11y-track"]',
];

type AxeViolation = {
  id: string;
  impact?: string | null;
  description: string;
  helpUrl?: string;
  nodes: { target: string[]; html: string }[];
};

function formatViolations(violations: AxeViolation[]): string {
  return violations
    .map((v) => {
      const targets = v.nodes
        .slice(0, 5)
        .map((n) => `    - ${n.target.join(' ')} | ${n.html.slice(0, 120)}`)
        .join('\n');
      return `[${v.impact}] ${v.id}: ${v.description}\n${targets}`;
    })
    .join('\n\n');
}

async function runAxeSeriousCritical(
  page: Page,
  options?: { include?: string[]; exclude?: string[] }
): Promise<AxeViolation[]> {
  let builder = new AxeBuilder({ page }).withTags([
    'wcag2a',
    'wcag2aa',
    'wcag21a',
    'wcag21aa',
    'best-practice',
  ]);

  if (options?.include?.length) {
    builder = builder.include(options.include);
  }
  if (options?.exclude?.length) {
    for (const sel of options.exclude) {
      builder = builder.exclude(sel);
    }
  }

  const results = await builder.analyze();
  return (results.violations as AxeViolation[]).filter(
    (v) => v.impact === 'serious' || v.impact === 'critical'
  );
}

async function dismissOwlIfNeeded(page: Page) {
  const dismiss = page.locator(
    '#ollie-owl button[aria-label="Dismiss message"], #ollie-owl .owl-bubble-dismiss'
  );
  if (await dismiss.first().isVisible().catch(() => false)) {
    await dismiss.first().click({ force: true });
  }
  const minimize = page.locator('#ollie-owl .owl-minimize-btn');
  if (await minimize.isVisible().catch(() => false)) {
    await minimize.click({ force: true });
  }
}

async function waitForGameReady(page: Page) {
  await expect(page.getByTestId('game-loading')).toBeHidden({
    timeout: 15_000,
  });
  await expect(page.locator('#new-game-btn, h1').first()).toBeVisible({
    timeout: 15_000,
  });
}

test.describe('A11y sweep (axe serious/critical)', () => {
  test('menu (game selector) has no serious/critical violations', async ({
    page,
  }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Math Pentathlon');
    await expect(page.locator('.game-selector')).toBeVisible();
    await dismissOwlIfNeeded(page);

    const violations = await runAxeSeriousCritical(page, {
      exclude: ['#ollie-owl'],
    });
    expect(violations, formatViolations(violations)).toEqual([]);
  });

  test('settings / progress dashboard has no serious/critical violations', async ({
    page,
  }) => {
    // No dedicated Settings route exists; /stats is the shared secondary shell
    // for user preferences-adjacent chrome (progress). Documented in docs.
    await page.goto('/#/stats');
    await expect(page.locator('h1')).toContainText('Your Progress', {
      timeout: 15_000,
    });
    await expect(page.locator('.stats-dashboard')).toBeVisible();
    await dismissOwlIfNeeded(page);

    const violations = await runAxeSeriousCritical(page, {
      exclude: ['#ollie-owl'],
    });
    expect(violations, formatViolations(violations)).toEqual([]);
  });

  test('help/rules modal (shared shell) has no serious/critical violations', async ({
    page,
  }) => {
    await page.goto('/#/game/hex');
    await waitForGameReady(page);
    await dismissOwlIfNeeded(page);

    await page.locator('#help-btn').click();
    const helpModal = page.locator('#help-modal');
    await expect(helpModal).toBeVisible();
    await expect(helpModal).not.toHaveClass(/hidden/);
    await expect(helpModal).toHaveAttribute('role', 'dialog');

    const violations = await runAxeSeriousCritical(page, {
      include: ['#help-modal', 'header.game-header', 'nav.button-row'],
    });
    expect(violations, formatViolations(violations)).toEqual([]);
  });

  for (const game of AVAILABLE_GAMES) {
    test(`${game.id} start screen (New Game modal) has no serious/critical shell violations`, async ({
      page,
    }) => {
      test.setTimeout(60_000);
      await page.goto(`/#/game/${game.id}`);
      await waitForGameReady(page);
      await dismissOwlIfNeeded(page);

      await page.locator('#new-game-btn').click();
      const modal = page.locator('#new-game-modal');
      await expect(modal).toBeVisible({ timeout: 10_000 });
      await expect(modal).not.toHaveClass(/hidden/);

      const violations = await runAxeSeriousCritical(page, {
        include: [
          '#new-game-modal',
          'header.game-header',
          'nav.button-row',
        ],
        exclude: BOARD_EXCLUDES,
      });
      expect(violations, formatViolations(violations)).toEqual([]);
    });
  }
});
