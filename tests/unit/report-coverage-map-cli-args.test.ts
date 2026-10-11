/**
 * @vitest-environment node
 *
 * Hermetic argv coverage for report-coverage-map flag rejection (q-mp-906).
 * Spawns the script only — no coverage summary / SVG write on help/unknown.
 */
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  parseArgs,
  USAGE,
} from '../../scripts/report-coverage-map.mjs';

const SCRIPT = resolve(process.cwd(), 'scripts/report-coverage-map.mjs');

function runScript(argv: string[]) {
  return spawnSync(process.execPath, [SCRIPT, ...argv], {
    encoding: 'utf8',
    env: { ...process.env },
    timeout: 15_000,
  });
}

describe('report-coverage-map CLI argv (q-mp-906)', () => {
  it('parseArgs recognizes --help / -h, path, and unknown flags', () => {
    expect(parseArgs([])).toEqual({
      ok: true,
      help: false,
      summaryPath: undefined,
    });
    expect(parseArgs(['--help'])).toEqual({
      ok: true,
      help: true,
      summaryPath: undefined,
    });
    expect(parseArgs(['-h'])).toEqual({
      ok: true,
      help: true,
      summaryPath: undefined,
    });
    expect(parseArgs(['coverage/coverage-summary.json'])).toEqual({
      ok: true,
      help: false,
      summaryPath: 'coverage/coverage-summary.json',
    });
    expect(parseArgs(['--wat'])).toEqual({
      ok: false,
      message: 'Unknown flag: --wat',
    });
    expect(parseArgs(['--help', 'extra.json']).ok).toBe(true);
    expect(parseArgs(['a.json', 'b.json'])).toEqual({
      ok: false,
      message: 'Unexpected argument: b.json',
    });
  });

  it('USAGE documents help and optional summary path', () => {
    expect(USAGE).toMatch(/--help/);
    expect(USAGE).toMatch(/coverage-summary\.json/);
  });

  it('--help prints usage and exits 0 without path lookup', () => {
    const result = runScript(['--help']);
    expect(result.status).toBe(0);
    const combined = `${result.stdout}${result.stderr}`;
    expect(combined).toMatch(/Usage: node scripts\/report-coverage-map\.mjs/);
    expect(combined).toMatch(/--help/);
    expect(combined).not.toMatch(/missing coverage summary at --help/);
    expect(combined).not.toMatch(/wrote /);
  });

  it('-h matches --help (no path lookup)', () => {
    const result = runScript(['-h']);
    expect(result.status).toBe(0);
    const combined = `${result.stdout}${result.stderr}`;
    expect(combined).toMatch(/Usage:/i);
    expect(combined).not.toMatch(/missing coverage summary at -h/);
  });

  it('unknown flags exit 2 with usage before path lookup', () => {
    const result = runScript(['--wat']);
    expect(result.status).toBe(2);
    const combined = `${result.stdout}${result.stderr}`;
    expect(combined).toMatch(/Unknown flag:\s*--wat/);
    expect(combined).toMatch(/Usage: node scripts\/report-coverage-map\.mjs/);
    expect(combined).not.toMatch(/missing coverage summary at --wat/);
    expect(combined).not.toMatch(/wrote /);
  });
});
