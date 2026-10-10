/**
 * @vitest-environment node
 *
 * Hermetic coverage for offline probe early --help (q-mp-886).
 */
import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { parseOfflineProbeArgs } from '../../scripts/lib/offline-probe-cli.mjs';

const SCRIPTS = [
  'scripts/webkit-offline-probe.mjs',
  'scripts/probe-offline-resilience.mjs',
  'scripts/probe-offline-resilience-dev.mjs',
] as const;

function runHelp(script: string, flag: string) {
  return spawnSync(process.execPath, [resolve(process.cwd(), script), flag], {
    encoding: 'utf8',
    timeout: 15_000,
    env: { ...process.env },
  });
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

describe('offline probe scripts early --help (q-mp-886)', () => {
  for (const script of SCRIPTS) {
    it(`${script} --help prints usage and exits 0 without build/browser`, () => {
      const r = runHelp(script, '--help');
      expect(r.status).toBe(0);
      const text = `${r.stdout}\n${r.stderr}`;
      expect(text).toMatch(/Usage: node scripts\//);
      expect(text).toMatch(/-h, --help/);
      expect(text).not.toMatch(/building…|Building production|Dev server at/i);
      expect(text).not.toMatch(/browserType\.launch|Executable doesn't exist/i);
    });

    it(`${script} --wat exits non-zero without build/browser`, () => {
      const r = runHelp(script, '--wat');
      expect(r.status).toBeGreaterThan(0);
      const text = `${r.stdout}\n${r.stderr}`;
      expect(text).toMatch(/Unknown flag: --wat/);
      expect(text).toMatch(/Usage: node scripts\//);
      expect(text).not.toMatch(/building…|Building production|Dev server at/i);
    });
  }
});
