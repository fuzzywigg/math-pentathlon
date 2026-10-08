/**
 * Guard: forced-colors CI job stays report-only until intentionally promoted.
 * Task: burn-1008-mp-forced-colors
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('forced-colors CI report-only', () => {
  it('ci.yml has forced-colors job with continue-on-error and npm script', () => {
    const ci = readFileSync(
      resolve(process.cwd(), '.github/workflows/ci.yml'),
      'utf8'
    );
    const pkg = JSON.parse(
      readFileSync(resolve(process.cwd(), 'package.json'), 'utf8')
    ) as { scripts: Record<string, string> };
    const pw = readFileSync(
      resolve(process.cwd(), 'playwright.config.ts'),
      'utf8'
    );

    expect(pkg.scripts['test:e2e:forced-colors']).toMatch(/forced-colors/);
    expect(pw).toMatch(/name:\s*'forced-colors'/);
    // Source regex literals escape dots: /forced-colors-a11y\.spec\.ts/
    expect(pw).toMatch(/forced-colors-a11y\\.spec\\.ts/);
    expect(ci).toMatch(/forced-colors:/);
    expect(ci).toContain('npm run test:e2e:forced-colors');
    expect(ci).toMatch(/continue-on-error:\s*true/);
    expect(ci).toMatch(/report-only/i);
    expect(ci).toContain('npm run test:e2e:chromium');
    expect(ci).toMatch(/contents:\s*read/);
    expect(ci).toMatch(/persist-credentials:\s*false/);
  });
});
