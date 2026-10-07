/**
 * Config for regenerating docs/gallery tablet screenshots.
 *
 *   npx playwright test -c playwright.gallery.config.ts
 *
 * Not used by CI — docs assets are committed; re-run only when UI changes.
 */
import { defineConfig, devices } from '@playwright/test';

/** Representative tablet landscape (matches docs/screenshots/mp3d tablet-landscape). */
const TABLET = { width: 1024, height: 768 } as const;

export default defineConfig({
  testDir: './scripts',
  testMatch: 'capture-gallery.spec.ts',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 120_000,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'off',
    browserName: 'chromium',
    viewport: TABLET,
    // Keep Desktop Chrome channel defaults without inheriting its 1280×720 viewport.
    deviceScaleFactor: devices['Desktop Chrome'].deviceScaleFactor,
    isMobile: false,
    hasTouch: false,
  },
  projects: [{ name: 'chromium' }],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
