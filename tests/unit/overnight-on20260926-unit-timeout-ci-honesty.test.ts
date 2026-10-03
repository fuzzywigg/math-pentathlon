/**
 * Unit CI budget honesty — updated after TOKENMAXX prune.
 * Job/step timeouts target ~5 minute unit runs (no heartbeat workaround).
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
    expect(unitJob!).toMatch(/timeout-minutes:\s*10/);
    expect(unitJob!).toMatch(/timeout-minutes:\s*8/);
    expect(unitJob!).toContain('npm run test:unit');
    expect(unitJob!).not.toMatch(/continue-on-error:\s*true/);
    expect(unitJob!).not.toMatch(/heartbeat/i);
    expect(unitJob!).not.toContain('::notice::');

    expect(docs).toMatch(/under 5 minutes|under ~5 minutes|about \*\*under 5 minutes\*\*/i);
    expect(docs).toMatch(/timeout-minutes:\s*10/);
    expect(docs).toMatch(/timeout-minutes:\s*8/);
    expect(docs).not.toMatch(/heartbeat/i);
  });
});
