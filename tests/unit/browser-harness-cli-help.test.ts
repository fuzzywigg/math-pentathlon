/**
 * @vitest-environment node
 *
 * Hermetic coverage for browser harness early --help (q-mp-900).
 * q-mp-1061: prefer in-process parse/usage; keep thin spawn smokes for wiring.
 */
import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import {
  applyBrowserHarnessCli,
  parseBrowserHarnessArgs,
} from '../../scripts/lib/browser-harness-cli.mjs';
import { HELP_ONLY_BROWSER_HARNESS_USAGES } from '../../scripts/lib/browser-harness-script-usage.mjs';
import {
  mobileAuditOutUsage,
  resolveMobileAuditOutPath,
} from '../../scripts/lib/mobile-audit-out-path.mjs';

function runScript(script: string, flag: string) {
  return spawnSync(process.execPath, [resolve(process.cwd(), script), flag], {
    encoding: 'utf8',
    timeout: 15_000,
    env: { ...process.env },
  });
}

type CliCapture = {
  status: number | undefined;
  stdout: string;
  stderr: string;
};

/**
 * Drive applyBrowserHarnessCli without leaving the process (exit is mocked).
 */
function captureApply(argv: string[], usage: string): CliCapture {
  const logs: string[] = [];
  const errs: string[] = [];
  let status: number | undefined;
  const origLog = console.log;
  const origErr = console.error;
  const origExit = process.exit;
  console.log = (...args: unknown[]) => {
    logs.push(args.map(String).join(' '));
  };
  console.error = (...args: unknown[]) => {
    errs.push(args.map(String).join(' '));
  };
  process.exit = ((code?: number) => {
    status = code ?? 0;
    throw new Error(`__cli_exit__:${status}`);
  }) as typeof process.exit;
  try {
    applyBrowserHarnessCli(argv, usage);
  } catch (e) {
    if (!(e instanceof Error && e.message.startsWith('__cli_exit__:'))) {
      throw e;
    }
  } finally {
    console.log = origLog;
    console.error = origErr;
    process.exit = origExit;
  }
  return {
    status,
    stdout: logs.join('\n'),
    stderr: errs.join('\n'),
  };
}

describe('parseBrowserHarnessArgs (q-mp-900)', () => {
  it('treats empty argv as a normal run', () => {
    expect(parseBrowserHarnessArgs([])).toEqual({ mode: 'run' });
  });

  it('recognizes --help and -h', () => {
    expect(parseBrowserHarnessArgs(['--help'])).toEqual({ mode: 'help' });
    expect(parseBrowserHarnessArgs(['-h'])).toEqual({ mode: 'help' });
  });

  it('rejects unknown flags and unexpected positionals', () => {
    expect(parseBrowserHarnessArgs(['--wat'])).toEqual({
      mode: 'error',
      message: 'Unknown flag: --wat',
    });
    expect(parseBrowserHarnessArgs(['extra'])).toEqual({
      mode: 'error',
      message: 'Unexpected argument: extra',
    });
  });
});

describe('browser harness scripts early --help (q-mp-900 / q-mp-1061)', () => {
  for (const { script, usage } of HELP_ONLY_BROWSER_HARNESS_USAGES) {
    it(`${script} usage mentions Usage + --help (in-process)`, () => {
      expect(usage).toMatch(/Usage: node scripts\//);
      expect(usage).toMatch(/-h, --help/);
    });

    it(`${script} --help prints usage and exits 0 without browser launch`, () => {
      const r = captureApply(['--help'], usage);
      expect(r.status).toBe(0);
      const text = `${r.stdout}\n${r.stderr}`;
      expect(text).toMatch(/Usage: node scripts\//);
      expect(text).toMatch(/-h, --help/);
      expect(text).not.toMatch(/browserType\.launch|Executable doesn't exist/i);
      expect(text).not.toMatch(/→ http:\/\/|games × \d+ cycles @/);
    });

    it(`${script} --wat exits non-zero without browser launch`, () => {
      const r = captureApply(['--wat'], usage);
      expect(r.status).toBe(2);
      const text = `${r.stdout}\n${r.stderr}`;
      expect(text).toMatch(/Unknown flag: --wat/);
      expect(text).toMatch(/Usage: node scripts\//);
      expect(text).not.toMatch(/browserType\.launch|Executable doesn't exist/i);
    });
  }

  it('mobile-audit.mjs --help prints usage and exits 0 without browser launch', () => {
    const usage = mobileAuditOutUsage();
    expect(usage).toMatch(/Usage: node scripts\/mobile-audit\.mjs/);
    expect(usage).toMatch(/-h, --help/);
    expect(usage).toMatch(/--out/);
    const parsed = resolveMobileAuditOutPath(
      ['node', 'scripts/mobile-audit.mjs', '--help'],
      resolve('/tmp', 'mobile-audit-default.json')
    );
    expect(parsed).toEqual({ ok: true, help: true });
  });

  it('mobile-audit.mjs --wat exits non-zero without browser launch', () => {
    const parsed = resolveMobileAuditOutPath(
      ['node', 'scripts/mobile-audit.mjs', '--wat'],
      resolve('/tmp', 'mobile-audit-default.json')
    );
    expect(parsed).toEqual({ ok: false, message: 'Unknown flag: --wat' });
    expect(mobileAuditOutUsage()).not.toMatch(
      /browserType\.launch|Executable doesn't exist/i
    );
  });
});

describe('browser harness CLI spawn smoke (q-mp-1061)', () => {
  it('console-sweep.mjs --help still wires applyBrowserHarnessCli', () => {
    const r = runScript('scripts/console-sweep.mjs', '--help');
    expect(r.status).toBe(0);
    const text = `${r.stdout}\n${r.stderr}`;
    expect(text).toMatch(/Usage: node scripts\/console-sweep\.mjs/);
    expect(text).toMatch(/-h, --help/);
    expect(text).not.toMatch(/browserType\.launch|Executable doesn't exist/i);
  });

  it('mobile-audit.mjs --wat still wires resolveMobileAuditOutPath', () => {
    const r = runScript('scripts/mobile-audit.mjs', '--wat');
    expect(r.status).toBe(2);
    const text = `${r.stdout}\n${r.stderr}`;
    expect(text).toMatch(/Unknown flag: --wat/);
    expect(text).not.toMatch(/browserType\.launch|Executable doesn't exist/i);
  });
});

describe('resolveMobileAuditOutPath help / unknown (q-mp-900)', () => {
  const DEFAULT = resolve('/tmp', 'mobile-audit-default.json');

  it('recognizes --help / -h before --out resolution', () => {
    expect(
      resolveMobileAuditOutPath(
        ['node', 'scripts/mobile-audit.mjs', '--help'],
        DEFAULT
      )
    ).toEqual({ ok: true, help: true });
    expect(
      resolveMobileAuditOutPath(
        ['node', 'scripts/mobile-audit.mjs', '-h', '--out', 'x.json'],
        DEFAULT
      )
    ).toEqual({ ok: true, help: true });
  });

  it('rejects unknown flags', () => {
    expect(
      resolveMobileAuditOutPath(
        ['node', 'scripts/mobile-audit.mjs', '--wat'],
        DEFAULT
      )
    ).toEqual({ ok: false, message: 'Unknown flag: --wat' });
  });

  it('usage mentions --help', () => {
    expect(mobileAuditOutUsage()).toMatch(/-h, --help/);
    expect(mobileAuditOutUsage()).toMatch(/--out <path>/);
  });
});
