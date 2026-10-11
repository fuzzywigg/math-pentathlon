/**
 * @vitest-environment node
 *
 * Hermetic argv coverage for check:perf early --help / unknown flags (q-mp-917)
 * and --help before PERF_LH_TIMEOUT_MS validation (q-mp-1001).
 * Spawns the script only — no build, no Lighthouse, no summary writes on help.
 */
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const SCRIPT = resolve(process.cwd(), 'scripts/check-perf.mjs');

function runScript(argv: string[], env: NodeJS.ProcessEnv = process.env) {
  return spawnSync(process.execPath, [SCRIPT, ...argv], {
    encoding: 'utf8',
    env: { ...env },
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

describe('check-perf CLI env ordering (q-mp-1001)', () => {
  it('--help exits 0 with usage even when PERF_LH_TIMEOUT_MS is invalid', () => {
    const result = runScript(['--help'], {
      ...process.env,
      PERF_LH_TIMEOUT_MS: 'abc',
    });
    expect(result.status).toBe(0);
    const text = `${result.stdout}\n${result.stderr}`;
    expect(text).toMatch(/Usage: node scripts\/check-perf\.mjs/);
    expect(text).not.toMatch(/Invalid PERF_LH_TIMEOUT_MS/);
    expect(text).not.toMatch(/dist\/ not found/);
  });

  it('-h exits 0 with usage even when PERF_LH_TIMEOUT_MS is invalid', () => {
    const result = runScript(['-h'], {
      ...process.env,
      PERF_LH_TIMEOUT_MS: 'abc',
    });
    expect(result.status).toBe(0);
    const text = `${result.stdout}\n${result.stderr}`;
    expect(text).toMatch(/Usage: node scripts\/check-perf\.mjs/);
    expect(text).not.toMatch(/Invalid PERF_LH_TIMEOUT_MS/);
  });

  it('bare run still rejects invalid PERF_LH_TIMEOUT_MS (exit 2)', () => {
    const result = runScript([], {
      ...process.env,
      PERF_LH_TIMEOUT_MS: 'abc',
    });
    expect(result.status).toBe(2);
    const text = `${result.stdout}\n${result.stderr}`;
    expect(text).toMatch(/Invalid PERF_LH_TIMEOUT_MS="abc"/);
    expect(text).not.toMatch(/Usage: node scripts\/check-perf\.mjs/);
  });
});
