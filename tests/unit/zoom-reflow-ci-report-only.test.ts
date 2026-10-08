/**
 * Guard: zoom/reflow CI job stays report-only until intentionally promoted.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('zoom-reflow CI report-only', () => {
  it('ci.yml has zoom-reflow job with continue-on-error and npm script', () => {
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

    expect(pkg.scripts['test:e2e:zoom-reflow']).toMatch(/zoom-reflow/);
    expect(pw).toMatch(/name:\s*'zoom-reflow'/);
    expect(pw).toMatch(/zoom-reflow-a11y\.spec\.ts/);
    expect(pw).toMatch(/nonDefaultSpecs/);
    expect(ci).toMatch(/zoom-reflow:/);
    expect(ci).toContain('npm run test:e2e:zoom-reflow');
    expect(ci).toMatch(/continue-on-error:\s*true/);
    expect(ci).toMatch(/report-only/i);
    // Required e2e stays chromium-only (zoom-reflow is a separate report-only job).
    expect(ci).toContain('npm run test:e2e:chromium');
    expect(ci).not.toMatch(
      /test:e2e -- --project=chromium --project=zoom-reflow/
    );
    // Least-privilege workflow posture (hard rule).
    expect(ci).toMatch(/permissions:\s*\n\s*contents:\s*read/);
    expect(ci).toMatch(/persist-credentials:\s*false/);
  });
});
