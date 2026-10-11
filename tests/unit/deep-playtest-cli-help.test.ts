/**
 * @vitest-environment node
 *
 * Hermetic coverage for deep-playtest early --help (q-mp-910).
 * q-mp-1062: prefer in-process parse/usage; keep thin spawn smokes.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  applyDeepPlaytestCli,
  parseDeepPlaytestArgs,
} from '../../scripts/lib/deep-playtest-cli.mjs';

const SCRIPTS = [
  'scripts/calla-deep-playtest.mjs',
  'scripts/ramrod-deep-playtest.mjs',
  'scripts/sum-dominoes-deep-playtest.mjs',
  'scripts/stars-bars-deep-playtest.mjs',
  'scripts/par-55-deep-playtest.mjs',
] as const;

const SMOKE_SCRIPT = SCRIPTS[0];

function readScriptSource(script: string): string {
  return readFileSync(resolve(process.cwd(), script), 'utf8');
}

/** Extract the template-literal body of `const USAGE = \`...\`;`. */
function readUsage(script: string): string {
  const src = readScriptSource(script);
  const m = src.match(/const USAGE = `([\s\S]*?)`;/);
  if (!m) {
    throw new Error(`USAGE template missing in ${script}`);
  }
  return m[1];
}

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

describe('applyDeepPlaytestCli in-process (q-mp-1062)', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('--help logs usage and exits 0', () => {
    const usage = 'Usage: node scripts/example-deep-playtest.mjs\n-h, --help';
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    const exit = vi
      .spyOn(process, 'exit')
      .mockImplementation((() => undefined) as never);

    applyDeepPlaytestCli(['--help'], usage);

    expect(log).toHaveBeenCalledWith(usage);
    expect(exit).toHaveBeenCalledWith(0);
  });

  it('--wat logs error + usage and exits 2', () => {
    const usage = 'Usage: node scripts/example-deep-playtest.mjs\n-h, --help';
    const err = vi.spyOn(console, 'error').mockImplementation(() => {});
    const exit = vi
      .spyOn(process, 'exit')
      .mockImplementation((() => undefined) as never);

    applyDeepPlaytestCli(['--wat'], usage);

    expect(err).toHaveBeenCalledWith('Unknown flag: --wat');
    expect(err).toHaveBeenCalledWith(usage);
    expect(exit).toHaveBeenCalledWith(2);
  });

  it('run mode returns without exiting', () => {
    const exit = vi
      .spyOn(process, 'exit')
      .mockImplementation((() => undefined) as never);

    applyDeepPlaytestCli([], 'Usage: unused');

    expect(exit).not.toHaveBeenCalled();
  });
});

describe('deep-playtest scripts usage wiring (q-mp-1062)', () => {
  for (const script of SCRIPTS) {
    it(`${script} USAGE + early CLI wiring cover --help / unknown`, () => {
      const src = readScriptSource(script);
      const usage = readUsage(script);

      expect(usage).toMatch(/Usage: node scripts\//);
      expect(usage).toMatch(/-h, --help/);
      expect(usage).not.toMatch(
        /browserType\.launch|Executable doesn't exist/i
      );
      expect(usage).not.toMatch(
        /deep playtest →|=== desktop ===|=== tablet ===/i
      );

      expect(src).toMatch(
        /applyDeepPlaytestCli\(\s*process\.argv\.slice\(2\)\s*,\s*USAGE\s*\)/
      );
      const applyIdx = src.indexOf(
        'applyDeepPlaytestCli(process.argv.slice(2), USAGE)'
      );
      const mkdirIdx = src.indexOf('fs.mkdirSync');
      expect(applyIdx).toBeGreaterThan(-1);
      expect(mkdirIdx).toBeGreaterThan(applyIdx);

      expect(parseDeepPlaytestArgs(['--help'])).toEqual({ mode: 'help' });
      expect(parseDeepPlaytestArgs(['--wat'])).toEqual({
        mode: 'error',
        message: 'Unknown flag: --wat',
      });
    });
  }
});

describe('deep-playtest spawn smoke (q-mp-1062)', () => {
  it(`${SMOKE_SCRIPT} --help prints usage and exits 0 without browser`, () => {
    const r = runCli(SMOKE_SCRIPT, '--help');
    expect(r.status).toBe(0);
    const text = `${r.stdout}\n${r.stderr}`;
    expect(text).toMatch(/Usage: node scripts\//);
    expect(text).toMatch(/-h, --help/);
    expect(text).not.toMatch(/browserType\.launch|Executable doesn't exist/i);
    expect(text).not.toMatch(/deep playtest →|=== desktop ===|=== tablet ===/i);
  });

  it(`${SMOKE_SCRIPT} --wat exits non-zero without browser`, () => {
    const r = runCli(SMOKE_SCRIPT, '--wat');
    expect(r.status).toBeGreaterThan(0);
    const text = `${r.stdout}\n${r.stderr}`;
    expect(text).toMatch(/Unknown flag: --wat/);
    expect(text).toMatch(/Usage: node scripts\//);
    expect(text).not.toMatch(/browserType\.launch|Executable doesn't exist/i);
  });
});
