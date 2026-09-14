/**
 * Wave 56 leftover after #256 — existing CI workflow still runs unit + chromium e2e.
 * Asserts on code that already exists (.github/workflows/ci.yml). Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 56 CI workflow — kings/hex/par gate', () => {
  it('ci.yml keeps unit + e2e chromium jobs', () => {
    const yml = readFileSync(
      resolve(__dirname, '../../.github/workflows/ci.yml'),
      'utf8'
    );
    expect(yml).toMatch(/^\s+unit:\s*$/m);
    expect(yml).toMatch(/npm run test:unit/);
    expect(yml).toMatch(/^\s+e2e:\s*$/m);
    expect(yml).toMatch(/npm run test:e2e -- --project=chromium/);
    expect(yml).toMatch(/npx playwright install --with-deps chromium/);
  });
});
