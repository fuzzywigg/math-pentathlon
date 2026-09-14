/**
 * Overnight TOKENMAXX HEAVY leftovers after #278 — fab/fiar CI handshake scripts.
 * Existing ci.yml + package.json only. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 59 handshake — fab/fiar CI workflow', () => {
  it('package scripts and ci.yml still wire unit + e2e on PR', () => {
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
    expect(ci).toMatch(/pull_request/);
  });
});
