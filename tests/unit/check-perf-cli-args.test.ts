/**
 * @vitest-environment node
 *
 * Hermetic argv coverage for check:perf early --help / unknown flags (q-mp-917).
 * Spawns the script only — no build, no Lighthouse, no summary writes on help.
 */
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const SCRIPT = resolve(process.cwd(), 'scripts/check-perf.mjs');

function runScript(argv: string[]) {
  return spawnSync(process.execPath, [SCRIPT, ...argv], {
    encoding: 'utf8',
    env: { ...process.env },
    timeout: 15_000,
  });
}

describe('check-perf CLI argv (q-mp-917)', () => {
  it('--help prints usage (missing dist/ exit 2 + report-only) and exits 0', () => {
    const result = runScript(['--help']);
    expect(result.status).toBe(0);
    const text = `${result.stdout}\n${result.stderr}`;
    expect(text).toMatch(/Usage: node scripts\/check-perf\.mjs/);
    expect(text).toMatch(/missing dist\//i);
    expect(text).toMatch(/exit 2/);
    expect(text).toMatch(/report-only/i);
    expect(text).not.toMatch(/dist\/ not found/);
    expect(text).not.toMatch(/Wrote /);
  });

  it('-h matches --help (no dist/ check)', () => {
    const result = runScript(['-h']);
    expect(result.status).toBe(0);
    const text = `${result.stdout}\n${result.stderr}`;
    expect(text).toMatch(/Usage: node scripts\/check-perf\.mjs/);
    expect(text).not.toMatch(/dist\/ not found/);
  });

  it('unknown flags exit 2 with usage before dist/ check', () => {
    const result = runScript(['--wat']);
    expect(result.status).toBe(2);
    const text = `${result.stdout}\n${result.stderr}`;
    expect(text).toMatch(/Unknown flag: --wat/);
    expect(text).toMatch(/Usage: node scripts\/check-perf\.mjs/);
    expect(text).not.toMatch(/dist\/ not found/);
    expect(text).not.toMatch(/Wrote /);
  });
});
