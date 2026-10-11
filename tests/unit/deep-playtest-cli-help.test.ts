/**
 * @vitest-environment node
 *
 * Hermetic coverage for deep-playtest early --help (q-mp-910).
 */
import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { parseDeepPlaytestArgs } from '../../scripts/lib/deep-playtest-cli.mjs';

const SCRIPTS = [
  'scripts/calla-deep-playtest.mjs',
  'scripts/ramrod-deep-playtest.mjs',
  'scripts/sum-dominoes-deep-playtest.mjs',
  'scripts/stars-bars-deep-playtest.mjs',
  'scripts/par-55-deep-playtest.mjs',
] as const;

function runCli(script: string, flag: string) {
  return spawnSync(process.execPath, [resolve(process.cwd(), script), flag], {
    encoding: 'utf8',
    timeout: 15_000,
    env: { ...process.env },
  });
}

describe('parseDeepPlaytestArgs (q-mp-910)', () => {
  it('treats empty argv as a normal run', () => {
    expect(parseDeepPlaytestArgs([])).toEqual({ mode: 'run' });
  });

  it('recognizes --help and -h', () => {
    expect(parseDeepPlaytestArgs(['--help'])).toEqual({ mode: 'help' });
    expect(parseDeepPlaytestArgs(['-h'])).toEqual({ mode: 'help' });
  });

  it('rejects unknown flags and unexpected positionals', () => {
    expect(parseDeepPlaytestArgs(['--wat'])).toEqual({
      mode: 'error',
      message: 'Unknown flag: --wat',
    });
    expect(parseDeepPlaytestArgs(['extra'])).toEqual({
      mode: 'error',
      message: 'Unexpected argument: extra',
    });
  });
});

describe('deep-playtest scripts early --help (q-mp-910)', () => {
  for (const script of SCRIPTS) {
    it(`${script} --help prints usage and exits 0 without browser`, () => {
      const r = runCli(script, '--help');
      expect(r.status).toBe(0);
      const text = `${r.stdout}\n${r.stderr}`;
      expect(text).toMatch(/Usage: node scripts\//);
      expect(text).toMatch(/-h, --help/);
      expect(text).not.toMatch(/browserType\.launch|Executable doesn't exist/i);
      expect(text).not.toMatch(
        /deep playtest →|=== desktop ===|=== tablet ===/i
      );
    });

    it(`${script} --wat exits non-zero without browser`, () => {
      const r = runCli(script, '--wat');
      expect(r.status).toBeGreaterThan(0);
      const text = `${r.stdout}\n${r.stderr}`;
      expect(text).toMatch(/Unknown flag: --wat/);
      expect(text).toMatch(/Usage: node scripts\//);
      expect(text).not.toMatch(/browserType\.launch|Executable doesn't exist/i);
    });
  }
});
