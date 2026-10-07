import { defineConfig, devices } from '@playwright/test';

/**
 * Projects:
 * - `chromium` — default / required CI path (`npm run test:e2e -- --project=chromium`)
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
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'ipad-webkit',
      use: { ...devices['iPad Pro 11'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
