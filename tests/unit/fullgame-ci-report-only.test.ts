/**
 * Guard: fullgame HvH CI job stays report-only until intentionally promoted.
 * Task: burn-1007-mp-e2e-fullgame
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

describe('fullgame CI report-only', () => {
  it('ci.yml has e2e-fullgame job with continue-on-error and npm script', () => {
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

    expect(pkg.scripts['test:e2e:fullgame']).toMatch(/tests\/e2e\/fullgame/);
    expect(pkg.scripts['test:e2e:fullgame']).toMatch(/--project=chromium/);
    // Required chromium path must not pull in @fullgame.
    expect(pkg.scripts['test:e2e:chromium']).toMatch(/grep-invert @fullgame/);
    expect(pw).toMatch(/fullgame/);
    expect(ci).toMatch(/e2e-fullgame:/);
    expect(ci).toContain('npm run test:e2e:fullgame');
    expect(ci).toMatch(/continue-on-error:\s*true/);
    expect(ci).toMatch(/report-only/i);
    expect(ci).toContain('npm run test:e2e:chromium');
    expect(ci).toMatch(/persist-credentials:\s*false/);
    expect(ci).toMatch(/permissions:[\s\S]*contents:\s*read/);
  });

  it('has one fullgame spec per available game (20)', () => {
    const dir = resolve(process.cwd(), 'tests/e2e/fullgame');
    const specs = readdirSync(dir).filter((f) => f.endsWith('.spec.ts'));
    expect(specs.length).toBe(20);
    for (const f of specs) {
      const body = readFileSync(resolve(dir, f), 'utf8');
      expect(body).toMatch(/@fullgame|FULLGAME_TAG/);
      expect(body).toMatch(/runFullgameMatch/);
    }
  });
});
