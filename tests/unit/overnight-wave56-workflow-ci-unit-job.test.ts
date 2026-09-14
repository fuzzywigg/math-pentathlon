/**
 * Overnight HEAVY leftover after #256 — CI workflow still gates unit/lint/e2e.
 * Reversible assertion on existing `.github/workflows/ci.yml` only. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 56 workflow — CI unit job', () => {
  it('ci.yml declares lint audit build unit e2e with test:unit', () => {
    const yml = readFileSync(
      resolve(process.cwd(), '.github/workflows/ci.yml'),
      'utf8'
    );
    expect(yml).toMatch(/^name:\s*CI\b/m);
    expect(yml).toMatch(/^\s+lint:\s*$/m);
    expect(yml).toMatch(/^\s+audit:\s*$/m);
    expect(yml).toMatch(/^\s+build:\s*$/m);
    expect(yml).toMatch(/^\s+unit:\s*$/m);
    expect(yml).toMatch(/^\s+e2e:\s*$/m);
    expect(yml).toMatch(/npm run test:unit/);
    expect(yml).toMatch(/npm run test:e2e/);
    expect(yml).toMatch(/npx tsc --noEmit/);
    // Slice modules remain in-tree under CI's unit gate
    expect(yml).not.toMatch(/skip.*test:unit/i);
  });
});
