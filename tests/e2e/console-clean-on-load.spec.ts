/**
 * Every available game route must load without console errors or pageerrors.
 * Complements the 2026-10-07 console sweep (docs/console-sweep-2026-10-07.md).
 */
import { test, expect, type Page } from '@playwright/test';
import { GAMES } from '../../src/core/game-registry';
import {
  waitForGameReady,
} from './helpers/page';

const AVAILABLE_GAMES = GAMES.filter((g) => g.available);

/** Ignore noisy third-party / tooling lines that are not app bugs. */
function isIgnoredConsoleError(text: string): boolean {
  return (
    /Download the React DevTools/i.test(text) ||
    /favicon\.ico/i.test(text) ||
    /\[vite\]/i.test(text) ||
    // WebKit logs Content-Security-Policy-Report-Only without report-to as console.error.
    (/content security policy/i.test(text) &&
      /report-only/i.test(text) &&
      /report-to/i.test(text))
  );
}

test.describe('Console clean on game load', () => {
  for (const game of AVAILABLE_GAMES) {
    test(`${game.id} loads with zero console errors`, async ({ page }) => {
      const errors: string[] = [];

      page.on('console', (msg) => {
        if (msg.type() !== 'error') return;
        const text = msg.text();
        if (!isIgnoredConsoleError(text)) {
          errors.push(`[console.error] ${text}`);
        }
      });
      page.on('pageerror', (err) => {
        errors.push(`[pageerror] ${String(err)}`);
      });

      await page.goto(`/#/game/${game.id}`);
      await waitForGameReady(page);

      // Boundary mount point must not already be showing a crash.
      await expect(page.getByTestId('game-error-boundary')).toHaveCount(0);
      await expect(page.getByTestId('game-load-error')).toHaveCount(0);

      expect(errors, errors.join('\n')).toEqual([]);
    });
  }
});

test.describe('Game error boundary reset', () => {
  test('runtime error on a game route shows Try again', async ({ page }) => {
    await page.goto('/#/game/hex');
    await waitForGameReady(page);

    await page.evaluate(() => {
      // Trigger the installed route boundary (ErrorEvent with .error set).
      window.dispatchEvent(
        new ErrorEvent('error', {
          error: new Error('e2e-boundary-probe'),
          message: 'e2e-boundary-probe',
        })
      );
    });

    const boundary = page.getByTestId('game-error-boundary');
    await expect(boundary).toBeVisible({ timeout: 5_000 });
    await expect(boundary).toContainText(/Something went wrong/i);

    await page.locator('[data-action="reset"]').click();
    await waitForGameReady(page);
    await expect(page.getByTestId('game-error-boundary')).toHaveCount(0);
    await expect(page.locator('h1')).toContainText('Hex');
  });
});
