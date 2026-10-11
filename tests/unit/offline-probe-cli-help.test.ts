/**
 * @vitest-environment node
 *
 * Hermetic coverage for offline probe early --help (q-mp-886 / q-mp-1063).
 * Prefer in-process parse + USAGE extraction over per-script spawnSync.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  applyOfflineProbeCli,
  parseOfflineProbeArgs,
} from '../../scripts/lib/offline-probe-cli.mjs';

const SCRIPTS = [
  'scripts/webkit-offline-probe.mjs',
  'scripts/probe-offline-resilience.mjs',
  'scripts/probe-offline-resilience-dev.mjs',
] as const;

/** Extract the template-literal USAGE body from a probe script source. */
function loadUsage(script: string): string {
  const src = readFileSync(resolve(process.cwd(), script), 'utf8');
  const m = src.match(/const USAGE = `([\s\S]*?)`;/);
  if (!m) {
    throw new Error(`USAGE template not found in ${script}`);
  }
  return m[1];
}

function loadSource(script: string): string {
  return readFileSync(resolve(process.cwd(), script), 'utf8');
}

/**
 * Run applyOfflineProbeCli with process.exit / console stubbed so the
 * help/error paths stay in-process (no child spawn, no probe exit edits).
 */
function runApply(
  argv: string[],
  usage: string
): { code: number; stdout: string; stderr: string } {
  const stdout: string[] = [];
  const stderr: string[] = [];
  const origLog = console.log;
  const origErr = console.error;
  const origExit = process.exit;
  let code: number | undefined;
  try {
    console.log = ((...args: unknown[]) => {
      stdout.push(args.map(String).join(' '));
    }) as typeof console.log;
    console.error = ((...args: unknown[]) => {
      stderr.push(args.map(String).join(' '));
    }) as typeof console.error;
    process.exit = ((exitCode?: number) => {
      code = exitCode ?? 0;
      throw new Error(`__offline_probe_cli_exit__:${code}`);
    }) as typeof process.exit;
    applyOfflineProbeCli(argv, usage);
    throw new Error('applyOfflineProbeCli returned without exiting');
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (!msg.startsWith('__offline_probe_cli_exit__:')) {
      throw e;
    }
  } finally {
    console.log = origLog;
    console.error = origErr;
    process.exit = origExit;
  }
  if (code === undefined) {
    throw new Error('applyOfflineProbeCli did not call process.exit');
  }
  return { code, stdout: stdout.join('\n'), stderr: stderr.join('\n') };
}

describe('parseOfflineProbeArgs (q-mp-886)', () => {
  it('treats empty argv as a normal run', () => {
    expect(parseOfflineProbeArgs([])).toEqual({ mode: 'run' });
  });

  it('recognizes --help and -h', () => {
    expect(parseOfflineProbeArgs(['--help'])).toEqual({ mode: 'help' });
    expect(parseOfflineProbeArgs(['-h'])).toEqual({ mode: 'help' });
  });

  it('rejects unknown flags and unexpected positionals', () => {
    expect(parseOfflineProbeArgs(['--wat'])).toEqual({
      mode: 'error',
      message: 'Unknown flag: --wat',
    });
    expect(parseOfflineProbeArgs(['extra'])).toEqual({
      mode: 'error',
      message: 'Unexpected argument: extra',
    });
  });
});

describe('applyOfflineProbeCli in-process (q-mp-1063)', () => {
  const SAMPLE = `Usage: node scripts/sample-offline-probe.mjs

Options:
  -h, --help       Show this help and exit (no build or browser launch)`;

  it('--help prints usage and exits 0 without build/browser', () => {
    const r = runApply(['--help'], SAMPLE);
    expect(r.code).toBe(0);
    const text = `${r.stdout}\n${r.stderr}`;
    expect(text).toMatch(/Usage: node scripts\//);
    expect(text).toMatch(/-h, --help/);
    expect(text).not.toMatch(/building…|Building production|Dev server at/i);
    expect(text).not.toMatch(/browserType\.launch|Executable doesn't exist/i);
  });

  it('--wat exits non-zero with unknown-flag + usage', () => {
    const r = runApply(['--wat'], SAMPLE);
    expect(r.code).toBeGreaterThan(0);
    const text = `${r.stdout}\n${r.stderr}`;
    expect(text).toMatch(/Unknown flag: --wat/);
    expect(text).toMatch(/Usage: node scripts\//);
    expect(text).not.toMatch(/building…|Building production|Dev server at/i);
  });

  it('run mode returns without exiting', () => {
    const origExit = process.exit;
    let exited = false;
    process.exit = ((..._args: unknown[]) => {
      exited = true;
      throw new Error('unexpected exit');
    }) as typeof process.exit;
    try {
      expect(() => applyOfflineProbeCli([], SAMPLE)).not.toThrow();
      expect(exited).toBe(false);
    } finally {
      process.exit = origExit;
    }
  });
});

describe('offline probe scripts USAGE / wiring in-process (q-mp-1063)', () => {
  for (const script of SCRIPTS) {
    it(`${script} USAGE documents help and is wired via applyOfflineProbeCli`, () => {
      const src = loadSource(script);
      const usage = loadUsage(script);

      expect(src).toMatch(
        /applyOfflineProbeCli\(\s*process\.argv\.slice\(2\)\s*,\s*USAGE\s*\)/
      );

      expect(usage).toMatch(/Usage: node scripts\//);
      expect(usage).toMatch(/-h, --help/);
      expect(usage).not.toMatch(/building…|Building production|Dev server at/i);
      expect(usage).not.toMatch(
        /browserType\.launch|Executable doesn't exist/i
      );
    });

    it(`${script} --help / --wat compose like applyOfflineProbeCli`, () => {
      const usage = loadUsage(script);

      const help = runApply(['--help'], usage);
      expect(help.code).toBe(0);
      const helpText = `${help.stdout}\n${help.stderr}`;
      expect(helpText).toMatch(/Usage: node scripts\//);
      expect(helpText).toMatch(/-h, --help/);
      expect(helpText).not.toMatch(
        /building…|Building production|Dev server at/i
      );
      expect(helpText).not.toMatch(
        /browserType\.launch|Executable doesn't exist/i
      );

      const err = runApply(['--wat'], usage);
      expect(err.code).toBeGreaterThan(0);
      const errText = `${err.stdout}\n${err.stderr}`;
      expect(errText).toMatch(/Unknown flag: --wat/);
      expect(errText).toMatch(/Usage: node scripts\//);
      expect(errText).not.toMatch(
        /building…|Building production|Dev server at/i
      );
    });
  }
});
