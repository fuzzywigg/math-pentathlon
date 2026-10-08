/**
 * Guard: burn-1007 fullgame HvH e2e CI job stays report-only until promoted.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

describe('fullgame CI report-only', () => {
  it('ci.yml has e2e-fullgame job with continue-on-error; required chromium excludes @fullgame', () => {
    const ci = readFileSync(
      resolve(process.cwd(), '.github/workflows/ci.yml'),
      'utf8'
    );
    const pkg = JSON.parse(
      readFileSync(resolve(process.cwd(), 'package.json'), 'utf8')
    ) as { scripts: Record<string, string> };

    expect(pkg.scripts['test:e2e:fullgame']).toMatch(/tests\/e2e\/fullgame/);
    expect(pkg.scripts['test:e2e:fullgame']).toMatch(/--project=chromium/);
    expect(pkg.scripts['test:e2e:chromium']).toMatch(/grep-invert @fullgame/);
    expect(ci).toMatch(/e2e-fullgame:/);
    expect(ci).toContain('npm run test:e2e:fullgame');
    expect(ci).toMatch(/continue-on-error:\s*true/);
    expect(ci).toMatch(/report-only/i);
    expect(ci).toContain('npm run test:e2e:chromium');
    expect(ci).toMatch(/permissions:\s*\n\s*contents:\s*read/);
    expect(ci).toContain('persist-credentials: false');
  });

  it('fullgame directory has one @fullgame spec per available game (20)', () => {
    const dir = resolve(process.cwd(), 'tests/e2e/fullgame');
    const specs = readdirSync(dir).filter((f) => f.endsWith('.spec.ts'));
    expect(specs).toHaveLength(20);
    for (const file of specs) {
      const src = readFileSync(resolve(dir, file), 'utf8');
      expect(src).toMatch(/@fullgame/);
      expect(src).toMatch(/runFullgameMatch/);
    }
  });
});
