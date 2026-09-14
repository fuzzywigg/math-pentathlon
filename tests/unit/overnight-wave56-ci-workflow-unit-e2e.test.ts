/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — CI workflow keeps unit + chromium e2e.
 * Reversible assertion on existing workflow; no template invent. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 56 CI workflow — unit/e2e gates', () => {
  it('ci.yml still runs test:unit and chromium e2e leftover', () => {
    const yml = readFileSync(
      resolve(process.cwd(), '.github/workflows/ci.yml'),
      'utf8'
    );
    expect(yml).toContain('npm run test:unit');
    expect(yml).toContain('npm run test:e2e -- --project=chromium');
    expect(yml).toContain('npx tsc --noEmit');
    expect(yml).toMatch(/branches:\s*\[main, development, alpha\]/);
  });
});
