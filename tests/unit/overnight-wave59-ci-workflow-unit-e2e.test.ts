/**
 * Overnight TOKENMAXX HEAVY leftovers after #278 — CI keeps unit + chromium e2e.
 * Wave58 asserted alpha gate; deepen jobs + vitest/playwright scripts. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 59 CI — unit/e2e gates', () => {
  it('ci.yml keeps test:unit, test:e2e, tsc, and alpha PR trigger', () => {
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
    expect(ci).toMatch(/chromium/i);
    expect(ci).toMatch(/\balpha\b/);
  });
});
