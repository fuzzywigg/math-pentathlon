/**
 * @vitest-environment node
 *
 * Hermetic argv / write-guard coverage for report-coverage-map
 * (q-mp-906 unknown flags; q-mp-977 --dry-run).
 * Spawns the script only for help/unknown/dry-run — no doc writes on those paths.
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path, { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  OUT_MD,
  OUT_SVG,
  parseArgs,
  USAGE,
  writeReport,
} from '../../scripts/report-coverage-map.mjs';

const SCRIPT = resolve(process.cwd(), 'scripts/report-coverage-map.mjs');
const MD_PATH = resolve(process.cwd(), OUT_MD);
const SVG_PATH = resolve(process.cwd(), OUT_SVG);

function runScript(argv: string[]) {
  return spawnSync(process.execPath, [SCRIPT, ...argv], {
    encoding: 'utf8',
    env: { ...process.env },
    timeout: 15_000,
  });
}

describe('report-coverage-map CLI argv (q-mp-906 / q-mp-977)', () => {
  it('parseArgs recognizes --help / -h / --dry-run, path, and unknown flags', () => {
    expect(parseArgs([])).toEqual({
      ok: true,
      help: false,
      dryRun: false,
      summaryPath: undefined,
    });
    expect(parseArgs(['--help'])).toEqual({
      ok: true,
      help: true,
      dryRun: false,
      summaryPath: undefined,
    });
    expect(parseArgs(['-h'])).toEqual({
      ok: true,
      help: true,
      dryRun: false,
      summaryPath: undefined,
    });
    expect(parseArgs(['--dry-run'])).toEqual({
      ok: true,
      help: false,
      dryRun: true,
      summaryPath: undefined,
    });
    expect(parseArgs(['--dry-run', 'coverage/coverage-summary.json'])).toEqual({
      ok: true,
      help: false,
      dryRun: true,
      summaryPath: 'coverage/coverage-summary.json',
    });
    expect(parseArgs(['coverage/coverage-summary.json'])).toEqual({
      ok: true,
      help: false,
      dryRun: false,
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

  it('USAGE documents help, dry-run, and optional summary path', () => {
    expect(USAGE).toMatch(/--help/);
    expect(USAGE).toMatch(/--dry-run/);
    expect(USAGE).toMatch(/coverage-summary\.json/);
    expect(USAGE).toMatch(/coverage-map/);
  });

  it('--help prints usage and exits 0 without path lookup', () => {
    const result = runScript(['--help']);
    expect(result.status).toBe(0);
    const combined = `${result.stdout}${result.stderr}`;
    expect(combined).toMatch(/Usage: node scripts\/report-coverage-map\.mjs/);
    expect(combined).toMatch(/--help/);
    expect(combined).toMatch(/--dry-run/);
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

  it('writeReport({ dryRun: true }) skips writeFileSync', () => {
    const mdBefore = fs.statSync(MD_PATH).mtimeMs;
    const svgBefore = fs.statSync(SVG_PATH).mtimeMs;
    const result = writeReport({
      dryRun: true,
      now: '2026-10-11T00:00:00.000Z',
      root: '/workspace',
      summary: {
        total: {
          lines: { total: 10, covered: 5, pct: 50 },
          branches: { total: 4, covered: 2, pct: 50 },
          functions: { total: 2, covered: 1, pct: 50 },
          statements: { total: 10, covered: 5, pct: 50 },
        },
        '/workspace/src/games/hex/rules.ts': {
          lines: { total: 10, covered: 5, pct: 50 },
          branches: { total: 4, covered: 2, pct: 50 },
          functions: { total: 2, covered: 1, pct: 50 },
          statements: { total: 10, covered: 5, pct: 50 },
        },
      },
    });
    expect(result.dryRun).toBe(true);
    expect(result.rows).toHaveLength(1);
    expect(result.rows[0]?.dir).toBe('src/games/hex');
    expect(result.svg).toContain('<svg');
    expect(result.md).toContain('# Unit coverage map');
    expect(fs.statSync(MD_PATH).mtimeMs).toBe(mdBefore);
    expect(fs.statSync(SVG_PATH).mtimeMs).toBe(svgBefore);
  });

  it('CLI --dry-run exits 0, prints counts, and does not write docs', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cov-map-dry-'));
    const summaryPath = path.join(tmpDir, 'coverage-summary.json');
    fs.writeFileSync(
      summaryPath,
      JSON.stringify({
        total: {
          lines: { total: 10, covered: 5, pct: 50 },
          branches: { total: 4, covered: 2, pct: 50 },
          functions: { total: 2, covered: 1, pct: 50 },
          statements: { total: 10, covered: 5, pct: 50 },
        },
        [`${process.cwd()}/src/games/hex/rules.ts`]: {
          lines: { total: 10, covered: 5, pct: 50 },
          branches: { total: 4, covered: 2, pct: 50 },
          functions: { total: 2, covered: 1, pct: 50 },
          statements: { total: 10, covered: 5, pct: 50 },
        },
      }),
      'utf8'
    );
    const mdBefore = fs.statSync(MD_PATH).mtimeMs;
    const svgBefore = fs.statSync(SVG_PATH).mtimeMs;
    const result = runScript(['--dry-run', summaryPath]);
    expect(result.status).toBe(0);
    expect(result.stdout).toMatch(/dry-run; not writing/);
    expect(result.stdout).toMatch(/would write/);
    expect(result.stdout).toMatch(/director/);
    expect(result.stdout).not.toMatch(/^\s*wrote /m);
    expect(fs.statSync(MD_PATH).mtimeMs).toBe(mdBefore);
    expect(fs.statSync(SVG_PATH).mtimeMs).toBe(svgBefore);
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });
});
