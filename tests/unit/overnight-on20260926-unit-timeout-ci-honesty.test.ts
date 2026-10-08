/**
 * Unit CI budget honesty — tip fold suite (~3k files) targets ~8 minute runs
 * on GHA (AI benches skipped under CI). No heartbeat workaround.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('unit timeout CI honesty', () => {
  it('ci.yml unit job keeps tight timeouts, no heartbeat, no continue-on-error', () => {
    const ci = readFileSync(
      resolve(process.cwd(), '.github/workflows/ci.yml'),
      'utf8'
    );
    const docs = readFileSync(
      resolve(process.cwd(), 'docs/wiki/development.md'),
      'utf8'
    );

    const unitJob = ci.match(/^ {2}unit:\n(?: {4}.+\n)+/m)?.[0];
    expect(unitJob).toBeTruthy();
    expect(unitJob!).toMatch(/timeout-minutes:\s*14/);
    expect(unitJob!).toMatch(/timeout-minutes:\s*12/);
    expect(unitJob!).toContain('npm run test:unit');
    expect(unitJob!).not.toMatch(/continue-on-error:\s*true/);
    expect(unitJob!).not.toMatch(/heartbeat/i);
    expect(unitJob!).not.toContain('::notice::');

    expect(docs).toMatch(
      /under 8 minutes|under ~8 minutes|about \*\*under 8 minutes\*\*/i
    );
    expect(docs).toMatch(/timeout-minutes:\s*14/);
    expect(docs).toMatch(/timeout-minutes:\s*12/);
    expect(docs).not.toMatch(/heartbeat/i);
  });
});
