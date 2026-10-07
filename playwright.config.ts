import { defineConfig, devices } from '@playwright/test';

/**
 * Projects:
 * - `chromium` — default / required CI path (`npm run test:e2e:chromium`)
 * - `firefox`, `webkit`, `ipad-webkit` — opt-in cross-browser smoke
 *
 * Opt in locally or in CI:
 *   npm run test:e2e:cross
 *   npm run test:e2e -- --project=webkit --project=firefox --project=ipad-webkit
 *   CROSS_BROWSER=1 npm run test:e2e:cross   # same; env documented for CI matrices
 *
 * Default `npm run test:e2e` (no --project) runs every registered project. Prefer
 * an explicit `--project=` list, or use the npm scripts below, so Chromium-only
 * CI never accidentally pulls in WebKit/Firefox.
 *
 * Opt-in visual suites:
 * - `playwright.visual.config.ts` via `npm run test:visual` (separate config)
 * - `visual-desktop` / `visual-phone` projects via `npm run test:e2e:visual`
 *   (start + openings baselines; ignored by chromium/firefox/webkit/ipad-webkit)
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
  // In-repo PNG baselines (committed). Project keeps desktop/phone apart.
  snapshotPathTemplate:
    '{testDir}/visual-baselines/{projectName}/{testFileName}/{arg}{ext}',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      testIgnore: /visual-baseline\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      testIgnore: /visual-baseline\.spec\.ts/,
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      testIgnore: /visual-baseline\.spec\.ts/,
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'ipad-webkit',
      testIgnore: /visual-baseline\.spec\.ts/,
      use: { ...devices['iPad Pro 11'] },
    },
    {
      name: 'visual-desktop',
      testMatch: /visual-baseline\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
      },
    },
    {
      name: 'visual-phone',
      testMatch: /visual-baseline\.spec\.ts/,
      use: {
        // iPhone 12 viewport/UA, but Chromium so CI need not install WebKit.
        ...devices['iPhone 12'],
        browserName: 'chromium',
      },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
