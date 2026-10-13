/**
 * @vitest-environment node
 *
 * Hermetic argv coverage for check-copy-pins + report-knip unknown-flag
 * rejection (q-mp-873). Spawns scripts only — no knip run / tip-wide scan.
 * --fail cases use CHECK_COPY_PINS_TESTS_DIR + a one-file fixture (q-mp-1457).
 */
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const COPY_PINS = resolve(process.cwd(), 'scripts/check-copy-pins.mjs');
const REPORT_KNIP = resolve(process.cwd(), 'scripts/report-knip.mjs');
/** One-file tree outside tests/ so tip walks never pick it up. */
const FAIL_FIXTURE_DIR = resolve(
  process.cwd(),
  'scripts/fixtures/check-copy-pins-fail-tree'
);

function runScript(
  script: string,
  argv: string[],
  envExtra: Record<string, string> = {}
) {
  return spawnSync(process.execPath, [script, ...argv], {
    encoding: 'utf8',
    env: { ...process.env, ...envExtra },
  });
}

function runCopyPinsFail(argv: string[]) {
  return runScript(COPY_PINS, argv, {
    CHECK_COPY_PINS_TESTS_DIR: FAIL_FIXTURE_DIR,
  });
}

describe('check-copy-pins + report-knip argv (q-mp-873)', () => {
  it('check-copy-pins rejects unknown flags with usage and exit 2', () => {
    const r = runScript(COPY_PINS, ['--wat']);
    expect(r.status).toBe(2);
    const text = `${r.stdout}\n${r.stderr}`;
    expect(text).toMatch(/Unknown flag: --wat/);
    expect(text).toMatch(/Usage: node scripts\/check-copy-pins\.mjs/);
    expect(text).toMatch(/--self-test/);
    expect(text).toMatch(/--fail/);
    expect(text).toMatch(/--json/);
    expect(text).not.toMatch(/tests scanned:/);
  });

  it('check-copy-pins --help prints usage and exits 0 without scanning', () => {
    const r = runScript(COPY_PINS, ['--help']);
    expect(r.status).toBe(0);
    const text = `${r.stdout}\n${r.stderr}`;
    expect(text).toMatch(/Usage: node scripts\/check-copy-pins\.mjs/);
    expect(text).not.toMatch(/tests scanned:/);
  });

  it('check-copy-pins --fail --json does not claim reportOnly when findings force exit 1 (q-mp-1157)', () => {
    const r = runCopyPinsFail(['--fail', '--json']);
    expect(r.status).toBe(1);
    const payload = JSON.parse(r.stdout) as {
      reportOnly: boolean;
      findingCount: number;
    };
    expect(payload.findingCount).toBeGreaterThan(0);
    expect(payload.reportOnly).toBe(false);
  });

  it('check-copy-pins --fail banner agrees with exit 1 when findings exist (q-mp-1157)', () => {
    const r = runCopyPinsFail(['--fail']);
    expect(r.status).toBe(1);
    expect(r.stdout).toMatch(/Fail mode: exit 1/);
    expect(r.stdout).not.toMatch(/Report-only: exit 0/);
  });

  it('report-knip rejects unknown flags with usage and exit 2', () => {
    const r = runScript(REPORT_KNIP, ['--wat']);
    expect(r.status).toBe(2);
    const text = `${r.stdout}\n${r.stderr}`;
    expect(text).toMatch(/Unknown flag: --wat/);
    expect(text).toMatch(/Usage: node scripts\/report-knip\.mjs/);
    expect(text).toMatch(/--json/);
    expect(text).toMatch(/--fail/);
    expect(text).toMatch(/--write-baseline/);
    expect(text).not.toMatch(/running knip@/);
  });

  it('report-knip --help prints usage and exits 0 without running knip', () => {
    const r = runScript(REPORT_KNIP, ['--help']);
    expect(r.status).toBe(0);
    const text = `${r.stdout}\n${r.stderr}`;
    expect(text).toMatch(/Usage: node scripts\/report-knip\.mjs/);
    expect(text).not.toMatch(/running knip@/);
  });
});
