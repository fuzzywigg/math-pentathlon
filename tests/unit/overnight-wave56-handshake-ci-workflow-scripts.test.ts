/**
 * Wave 56 leftover after #255/#256 — reversible CI workflow assertions.
 * Existing ci.yml + package.json only. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 56 handshake — fab/fiar CI workflow', () => {
  it('ci.yml unit/e2e jobs still invoke package test scripts', () => {
    const ci = readFileSync(
      resolve(process.cwd(), '.github/workflows/ci.yml'),
      'utf8'
    );
    const pkg = JSON.parse(
      readFileSync(resolve(process.cwd(), 'package.json'), 'utf8')
    ) as { scripts: Record<string, string> };

    expect(pkg.scripts['test:unit']).toMatch(/vitest/);
    expect(pkg.scripts['test:e2e']).toMatch(/playwright/);
    expect(ci).toContain('npm run test:unit');
    expect(ci).toContain('npm run test:e2e');
    expect(ci).toContain('npx tsc --noEmit');
    expect(ci).toMatch(/pull_request/);
    expect(ci).toMatch(/\balpha\b/);
  });
});
