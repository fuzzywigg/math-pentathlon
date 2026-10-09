/**
 * Config for capturing iPad-size start + HvH mid-game screenshots into
 * docs/visuals/2026-10/. Not used by CI — docs assets are committed.
 *
 *   npx playwright test -c playwright.visuals-2026-10.config.ts
 */
import { defineConfig, devices } from '@playwright/test';

/** Playwright iPad Pro 11 viewport (portrait); Chromium for local/CI parity. */
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
    browserName: 'chromium',
    viewport: IPAD.viewport,
    // Keep PNG sizes manageable for docs (gallery uses DSF 1 as well).
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true,
    userAgent: IPAD.userAgent,
    launchOptions: {
      args: [
        '--use-gl=angle',
        '--use-angle=swiftshader-webgl',
        '--enable-unsafe-swiftshader',
      ],
    },
  },
  projects: [{ name: 'chromium' }],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
