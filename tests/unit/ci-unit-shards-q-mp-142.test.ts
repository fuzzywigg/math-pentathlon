/**
 * q-mp-142 — CI unit job matrix covers the three vitest.config.ts projects
 * and package.json keeps local full-suite + per-shard scripts.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = process.cwd();

describe('q-mp-142 CI unit shards', () => {
  it('ci.yml unit matrix lists unit-shared / unit-node / unit-isolated', () => {
    const ci = readFileSync(resolve(ROOT, '.github/workflows/ci.yml'), 'utf8');
    const unitJob = ci.match(/^ {2}unit:\n(?: {4}.+\n)+/m)?.[0];
    expect(unitJob).toBeTruthy();
    expect(unitJob!).toMatch(
      /project:\s*\[unit-shared,\s*unit-node,\s*unit-isolated\]/
    );
    expect(unitJob!).toContain('npm run test:unit -- --project ${{ matrix.project }}');
    expect(unitJob!).toMatch(/timeout-minutes:\s*14/);
    expect(unitJob!).toMatch(/timeout-minutes:\s*12/);
    expect(unitJob!).toMatch(/persist-credentials:\s*false/);
    expect(unitJob!).not.toMatch(/timeout-minutes:\s*(1[5-9]|[2-9]\d)/);
  });

  it('package.json exposes full suite plus per-project shard scripts', () => {
    const pkg = JSON.parse(
      readFileSync(resolve(ROOT, 'package.json'), 'utf8')
    ) as { scripts: Record<string, string> };
    expect(pkg.scripts['test:unit']).toBe('vitest run');
    expect(pkg.scripts['test:unit:shared']).toBe(
      'vitest run --project unit-shared'
    );
    expect(pkg.scripts['test:unit:node']).toBe(
      'vitest run --project unit-node'
    );
    expect(pkg.scripts['test:unit:isolated']).toBe(
      'vitest run --project unit-isolated'
    );
  });

  it('vitest.config.ts still declares the three project names', () => {
    const cfg = readFileSync(resolve(ROOT, 'vitest.config.ts'), 'utf8');
    expect(cfg).toContain("name: 'unit-shared'");
    expect(cfg).toContain("name: 'unit-node'");
    expect(cfg).toContain("name: 'unit-isolated'");
  });
});
