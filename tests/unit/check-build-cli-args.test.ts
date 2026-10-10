import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parseCliArgs } from '../../scripts/check-build.mjs';

const SCRIPT = resolve(process.cwd(), 'scripts/check-build.mjs');

function runScript(argv: string[]) {
  return spawnSync(process.execPath, [SCRIPT, ...argv], {
    encoding: 'utf8',
    env: { ...process.env },
    timeout: 15_000,
  });
}

describe('check-build CLI argv (q-mp-874)', () => {
  it('parseCliArgs recognizes --help / -h and unknown flags', () => {
    expect(parseCliArgs([])).toEqual({ help: false, unknown: null });
    expect(parseCliArgs(['--help'])).toEqual({ help: true, unknown: null });
    expect(parseCliArgs(['-h'])).toEqual({ help: true, unknown: null });
    expect(parseCliArgs(['--wat'])).toEqual({ help: false, unknown: '--wat' });
  });

  it('--help prints usage (incl. CHECK_BUILD_SKIP_BUILD) and exits 0 without building', () => {
    const result = runScript(['--help']);
    expect(result.status).toBe(0);
    const combined = `${result.stdout}${result.stderr}`;
    expect(combined).toMatch(/Usage:/i);
    expect(combined).toMatch(/CHECK_BUILD_SKIP_BUILD/);
    expect(combined).not.toMatch(/clean build A/);
    expect(combined).not.toMatch(/tsc && vite build|npm run build/i);
  });

  it('-h matches --help (no build)', () => {
    const result = runScript(['-h']);
    expect(result.status).toBe(0);
    const combined = `${result.stdout}${result.stderr}`;
    expect(combined).toMatch(/Usage:/i);
    expect(combined).not.toMatch(/clean build A/);
  });

  it('unknown flags exit non-zero before spawning builds', () => {
    const result = runScript(['--wat']);
    expect(result.status).not.toBe(0);
    const combined = `${result.stdout}${result.stderr}`;
    expect(combined).toMatch(/Unknown flag:\s*--wat/);
    expect(combined).not.toMatch(/clean build A/);
  });
});
