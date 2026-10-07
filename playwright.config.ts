import { defineConfig, devices } from '@playwright/test';

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
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
