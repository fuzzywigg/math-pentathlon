import { defineConfig, devices } from '@playwright/test';

/**
 * Projects:
 * - `chromium` — default / required CI path (`npm run test:e2e:chromium`)
 * - `mobile-iphone-13`, `mobile-pixel-7`, `mobile-ipad` — touch smoke
 *   (Chromium device emulation; report-only CI via `npm run test:e2e:mobile`)
 * - `firefox`, `webkit`, `ipad-webkit` — opt-in cross-browser smoke
 * - `visual-desktop`, `visual-phone` — start + openings baselines (`npm run test:e2e:visual`)
 *
 * CI required e2e runs chromium only. Opt in cross-browser locally or in CI:
 *   npm run test:e2e:cross
 *   npm run test:e2e -- --project=webkit --project=firefox --project=ipad-webkit
 *   CROSS_BROWSER=1 npm run test:e2e:cross   # same; env documented for CI matrices
 *
 * Mobile touch smoke (phone + tablet, report-only):
 *   npm run test:e2e:mobile
 *
 * Default `npm run test:e2e` (no --project) runs every registered project. Prefer
 * an explicit `--project=` list, or use the npm scripts below, so Chromium-only
 * CI never accidentally pulls in WebKit/Firefox/mobile.
 *
 * Opt-in visual suites:
 * - `playwright.visual.config.ts` via `npm run test:visual` (separate config)
 * - `visual-desktop` / `visual-phone` projects via `npm run test:e2e:visual`
 *   (ignored by chromium/firefox/webkit/ipad-webkit/mobile projects)
 */

// Cap parallel browsers: each mp3d spec spins WebGL (often software/ANGLE in CI).
// CI stays single-worker; local caps at 2 to avoid GL thrash on shared runners.
const workerLimit = process.env.CI ? 1 : 2;

/** Specs that belong only to dedicated projects (not chromium/cross-browser). */
const nonDefaultSpecs =
  /mobile-touch-smoke\.spec\.ts|mobile-viewport-smoke\.spec\.ts|visual-baseline\.spec\.ts/;

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
      testIgnore: nonDefaultSpecs,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      testIgnore: nonDefaultSpecs,
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      testIgnore: nonDefaultSpecs,
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'ipad-webkit',
      testIgnore: nonDefaultSpecs,
      use: { ...devices['iPad Pro 11'] },
    },
    {
      name: 'mobile-iphone-13',
      testMatch: /mobile-touch-smoke\.spec\.ts/,
      use: {
        ...devices['iPhone 13'],
        // CI installs Chromium only; keep emulation on Chromium.
        defaultBrowserType: 'chromium',
        hasTouch: true,
        isMobile: true,
      },
    },
    {
      name: 'mobile-pixel-7',
      testMatch: /mobile-touch-smoke\.spec\.ts/,
      use: {
        ...devices['Pixel 7'],
        defaultBrowserType: 'chromium',
        hasTouch: true,
        isMobile: true,
      },
    },
    {
      name: 'mobile-ipad',
      testMatch: /mobile-touch-smoke\.spec\.ts/,
      use: {
        ...devices['iPad Pro 11'],
        defaultBrowserType: 'chromium',
        hasTouch: true,
        isMobile: true,
      },
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
