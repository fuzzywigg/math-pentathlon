/**
 * Config for q-mp-146 contributor lifecycle screenshots.
 *
 *   npx playwright test -c playwright.lifecycle-visuals.config.ts
 *
 * Not used by CI — docs assets are committed. Chromium (+ optional SwiftShader
 * via PLAYWRIGHT_SWIFTSHADER=1). Distinct from gallery / visual-baseline /
 * iPad visuals suites.
 */
import { defineConfig, devices } from '@playwright/test';

const useSwiftShader = process.env.PLAYWRIGHT_SWIFTSHADER === '1';

export default defineConfig({
  testDir: './scripts',
  testMatch: 'capture-lifecycle-visuals-q-mp-146.spec.ts',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 120_000,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'off',
    ...devices['Desktop Chrome'],
    browserName: 'chromium',
    launchOptions: useSwiftShader
      ? {
          args: [
            '--use-gl=angle',
            '--use-angle=swiftshader-webgl',
            '--enable-unsafe-swiftshader',
          ],
        }
      : undefined,
  },
  projects: [{ name: 'chromium-lifecycle-visuals' }],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
