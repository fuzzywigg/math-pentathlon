/**
 * TOKENMAXX ON-20260926 — unit timeout CI honesty (residual after #347).
 * #347 set job/step timeouts + heartbeat + docs; tip had no permanent assert
 * (unlike #348 engines honesty). Distinct from engines/lockfile residual.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('ON-20260926 — unit timeout CI honesty', () => {
  it('ci.yml unit job keeps 45m/40m timeouts, heartbeat, no continue-on-error', () => {
    const ci = readFileSync(
      resolve(process.cwd(), '.github/workflows/ci.yml'),
      'utf8'
    );
    const docs = readFileSync(
      resolve(process.cwd(), 'docs/wiki/development.md'),
      'utf8'
    );

    const unitJob = ci.match(
      /^ {2}unit:\n(?: {4}.+\n)+/m
    )?.[0];
    expect(unitJob).toBeTruthy();
    expect(unitJob!).toMatch(/timeout-minutes:\s*45/);
    expect(unitJob!).toMatch(/timeout-minutes:\s*40/);
    expect(unitJob!).toContain('::notice::');
    expect(unitJob!).toContain('npm run test:unit');
    expect(unitJob!).not.toMatch(/continue-on-error:\s*true/);

    expect(docs).toMatch(/timeout-minutes:\s*45/);
    expect(docs).toMatch(/timeout-minutes:\s*40/);
    expect(docs).toMatch(/heartbeat/i);
  });
});
