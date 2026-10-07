import { defineConfig, devices } from '@playwright/test';

/**
 * Projects:
 * - `chromium` — default / required CI path (`npm run test:e2e:chromium`)
 * - `mobile-iphone-se`, `mobile-pixel-7` — phone viewport smoke (Chromium emulation)
 * - `firefox`, `webkit`, `ipad-webkit` — cross-browser (CI report-only: firefox+webkit)
 *
 * CI required e2e: chromium + both mobile projects. Cross-browser (report-only in CI):
 *   npm run test:e2e -- --project=firefox --project=webkit
 *   npm run test:e2e:cross   # firefox + webkit + ipad-webkit
 *   CROSS_BROWSER=1 …        # env documented for CI matrices
 *
 * Default `npm run test:e2e` (no --project) runs every registered project. Prefer
 * an explicit `--project=` list, or use the npm scripts below, so Chromium-only
 * CI never accidentally pulls in WebKit/Firefox.
 *
 * Visual regression uses a separate config: `playwright.visual.config.ts`
 * (`npm run test:visual`) — not registered here.
 */

// Cap parallel browsers: each mp3d spec spins WebGL (often software/ANGLE in CI).
// CI stays single-worker; local caps at 2 to avoid GL thrash on shared runners.
const workerLimit = process.env.CI ? 1 : 2;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: workerLimit,
  // Default 30s is tight for multi-viewport 3D play-throughs under software GL.
  timeout: 60_000,
  expect: {
    timeout: 15_000,
  },
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      testIgnore: /mobile-viewport-smoke\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      testIgnore: /mobile-viewport-smoke\.spec\.ts/,
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      testIgnore: /mobile-viewport-smoke\.spec\.ts/,
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'ipad-webkit',
      testIgnore: /mobile-viewport-smoke\.spec\.ts/,
      use: { ...devices['iPad Pro 11'] },
    },
    {
      name: 'mobile-iphone-se',
      testMatch: /mobile-viewport-smoke\.spec\.ts/,
      use: {
        ...devices['iPhone SE'],
        // CI installs Chromium only; keep emulation on Chromium.
        defaultBrowserType: 'chromium',
        viewport: { width: 375, height: 667 },
      },
    },
    {
      name: 'mobile-pixel-7',
      testMatch: /mobile-viewport-smoke\.spec\.ts/,
      use: {
        ...devices['Pixel 7'],
        defaultBrowserType: 'chromium',
        viewport: { width: 412, height: 915 },
      },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
