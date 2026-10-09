/**
 * Guard: mobile touch CI job stays report-only until intentionally promoted.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('mobile-touch CI report-only', () => {
  it('ci.yml has mobile-touch job with continue-on-error and npm script', () => {
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

    expect(pkg.scripts['test:e2e:mobile']).toMatch(/mobile-iphone-13/);
    expect(pkg.scripts['test:e2e:mobile']).toMatch(/mobile-pixel-7/);
    expect(pkg.scripts['test:e2e:mobile']).toMatch(/mobile-ipad/);
    expect(pw).toMatch(/name:\s*'mobile-iphone-13'/);
    expect(pw).toMatch(/name:\s*'mobile-pixel-7'/);
    expect(pw).toMatch(/name:\s*'mobile-ipad'/);
    expect(pw).toMatch(/hasTouch:\s*true/);
    expect(ci).toMatch(/mobile-touch:/);
    expect(ci).toContain('npm run test:e2e:mobile');
    expect(ci).toMatch(/continue-on-error:\s*true/);
    expect(ci).toMatch(/report-only/i);
    // Required e2e stays chromium-only (mobile is a separate report-only job).
    expect(ci).toContain('npm run test:e2e:chromium');
    expect(ci).not.toMatch(
      /test:e2e -- --project=chromium --project=mobile-/
    );
  });
});
