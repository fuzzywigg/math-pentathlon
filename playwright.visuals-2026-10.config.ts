/**
 * Config for regenerating docs/visuals/2026-10/ iPad screenshots.
 *
 *   npx playwright test -c playwright.visuals-2026-10.config.ts
 *
 * Not used by CI — docs assets are committed; re-run only when UI changes.
 * Distinct from gallery (docs/gallery) and visual-baseline suites.
 */
import { defineConfig, devices } from '@playwright/test';

/** Playwright iPad Pro 11 CSS viewport (portrait). */
const IPAD = devices['iPad Pro 11'];

export default defineConfig({
  testDir: './scripts',
  testMatch: 'capture-visuals-2026-10.spec.ts',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 120_000,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'off',
    // iPad Pro 11 viewport/UA/touch, but Chromium (agent/CI browsers).
    viewport: IPAD.viewport,
    userAgent: IPAD.userAgent,
    deviceScaleFactor: IPAD.deviceScaleFactor,
    isMobile: true,
    hasTouch: true,
    browserName: 'chromium',
  },
  projects: [{ name: 'chromium-ipad' }],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
