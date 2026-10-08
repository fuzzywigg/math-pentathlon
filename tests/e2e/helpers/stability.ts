/**
 * Shared e2e stability helpers — waits, deterministic seeds, animation suppression.
 * Tests/setup only; no game rules or scoring changes.
 */
import type { Page } from '@playwright/test';
import { browserInstallSeededRandom } from '../../helpers/rng';

/** Mulberry32 seed used across Chromium e2e for dice / deals / AI jitter. */
export const E2E_RNG_SEED = 0xc0ffee;

/**
 * Install before navigation: seeded Math.random + CSS animation/transition kill.
 * Prefer pairing with Playwright `use.reducedMotion: 'reduce'`.
 */
export async function installE2eStability(
  page: Page,
  seed: number = E2E_RNG_SEED
): Promise<void> {
  await page.addInitScript(browserInstallSeededRandom, seed);
  await page.addInitScript(() => {
    const style = document.createElement('style');
    style.setAttribute('data-e2e-stability', '1');
    style.textContent = `
      *, *::before, *::after {
        animation: none !important;
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition: none !important;
        transition-duration: 0s !important;
        caret-color: transparent !important;
      }
      html { scroll-behavior: auto !important; }
    `;
    const mount = () => {
      if (!document.querySelector('style[data-e2e-stability="1"]')) {
        (document.head ?? document.documentElement).appendChild(style);
      }
    };
    if (document.head) mount();
    else document.addEventListener('DOMContentLoaded', mount, { once: true });
  });
}

/** Soft-wait: visible locator, ignore timeout (for optional phase transitions). */
export async function softWaitVisible(
  page: Page,
  selector: string,
  timeoutMs = 8_000
): Promise<void> {
  await page
    .locator(selector)
    .first()
    .waitFor({ state: 'visible', timeout: timeoutMs })
    .catch(() => undefined);
}
