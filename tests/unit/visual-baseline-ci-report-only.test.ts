/**
 * Guard: visual regression CI job stays report-only until intentionally promoted.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('visual-baseline CI report-only', () => {
  it('ci.yml has visual-baseline job with continue-on-error and npm script', () => {
    const ci = readFileSync(
      resolve(process.cwd(), '.github/workflows/ci.yml'),
      'utf8'
    );
    const pkg = JSON.parse(
      readFileSync(resolve(process.cwd(), 'package.json'), 'utf8')
    ) as { scripts: Record<string, string> };

    expect(pkg.scripts['test:e2e:visual']).toMatch(/visual-desktop/);
    expect(pkg.scripts['test:e2e:visual']).toMatch(/visual-phone/);
    expect(pkg.scripts['test:e2e:visual:update']).toMatch(/update-snapshots/);
    expect(ci).toMatch(/visual-baseline:/);
    expect(ci).toContain('npm run test:e2e:visual');
    expect(ci).toMatch(/continue-on-error:\s*true/);
    expect(ci).toMatch(/report-only/i);
  });
});
