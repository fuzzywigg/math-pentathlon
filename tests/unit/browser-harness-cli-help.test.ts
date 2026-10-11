/**
 * @vitest-environment node
 *
 * Hermetic coverage for browser harness early --help (q-mp-900).
 */
import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { parseBrowserHarnessArgs } from '../../scripts/lib/browser-harness-cli.mjs';
import {
  mobileAuditOutUsage,
  resolveMobileAuditOutPath,
} from '../../scripts/lib/mobile-audit-out-path.mjs';

const HELP_ONLY_SCRIPTS = [
  'scripts/console-sweep.mjs',
  'scripts/nav-away-sweep.mjs',
  'scripts/memory-leak-audit.mjs',
  'scripts/runtime-perf.mjs',
  'scripts/render-perf.mjs',
] as const;

function runScript(script: string, flag: string) {
  return spawnSync(process.execPath, [resolve(process.cwd(), script), flag], {
    encoding: 'utf8',
    timeout: 15_000,
    env: { ...process.env },
  });
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

describe('browser harness scripts early --help (q-mp-900)', () => {
  for (const script of HELP_ONLY_SCRIPTS) {
    it(`${script} --help prints usage and exits 0 without browser launch`, () => {
      const r = runScript(script, '--help');
      expect(r.status).toBe(0);
      const text = `${r.stdout}\n${r.stderr}`;
      expect(text).toMatch(/Usage: node scripts\//);
      expect(text).toMatch(/-h, --help/);
      expect(text).not.toMatch(/browserType\.launch|Executable doesn't exist/i);
      expect(text).not.toMatch(/→ http:\/\/|games × \d+ cycles @/);
    });

    it(`${script} --wat exits non-zero without browser launch`, () => {
      const r = runScript(script, '--wat');
      expect(r.status).toBe(2);
      const text = `${r.stdout}\n${r.stderr}`;
      expect(text).toMatch(/Unknown flag: --wat/);
      expect(text).toMatch(/Usage: node scripts\//);
      expect(text).not.toMatch(/browserType\.launch|Executable doesn't exist/i);
    });
  }

  it('mobile-audit.mjs --help prints usage and exits 0 without browser launch', () => {
    const r = runScript('scripts/mobile-audit.mjs', '--help');
    expect(r.status).toBe(0);
    const text = `${r.stdout}\n${r.stderr}`;
    expect(text).toMatch(/Usage: node scripts\/mobile-audit\.mjs/);
    expect(text).toMatch(/-h, --help/);
    expect(text).toMatch(/--out/);
    expect(text).not.toMatch(/browserType\.launch|Executable doesn't exist/i);
  });

  it('mobile-audit.mjs --wat exits non-zero without browser launch', () => {
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
