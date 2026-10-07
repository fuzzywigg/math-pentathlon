/**
 * Chromium e2e fixtures — auto-install stability (seeded RNG + no animations).
 */
import { test as base } from '@playwright/test';
import { installE2eStability } from './helpers/stability';

export { expect } from '@playwright/test';

export const test = base.extend({
  page: async ({ page }, use) => {
    await installE2eStability(page);
    await use(page);
  },
});
