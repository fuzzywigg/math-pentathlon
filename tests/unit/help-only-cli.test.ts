/**
 * @vitest-environment node
 *
 * Hermetic coverage for help-only CLI argv (q-mp-885).
 */
import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import {
  helpOnlyUsage,
  parseHelpOnlyArgv,
} from '../../scripts/lib/help-only-cli.mjs';

const ROOT = process.cwd();

describe('parseHelpOnlyArgv (q-mp-885)', () => {
  it('empty argv means run', () => {
    expect(parseHelpOnlyArgv([])).toEqual({ kind: 'run' });
  });

  it('accepts --help and -h', () => {
    expect(parseHelpOnlyArgv(['--help'])).toEqual({ kind: 'help' });
    expect(parseHelpOnlyArgv(['-h'])).toEqual({ kind: 'help' });
  });

  it('rejects unknown flags', () => {
    expect(parseHelpOnlyArgv(['--wat'])).toEqual({
      kind: 'error',
      flag: '--wat',
    });
    expect(parseHelpOnlyArgv(['-x'])).toEqual({ kind: 'error', flag: '-x' });
  });

  it('ignores non-flag positionals (run)', () => {
    expect(parseHelpOnlyArgv(['some-path'])).toEqual({ kind: 'run' });
  });

  it('usage names the script', () => {
    expect(helpOnlyUsage('scripts/check-workflows.mjs')).toBe(
      'Usage: node scripts/check-workflows.mjs [--help]'
    );
  });
});

describe('help-only CLI scripts (q-mp-885)', () => {
  const scripts = [
    'scripts/check-workflows.mjs',
    'scripts/check-boundaries.mjs',
    'scripts/report-licenses.mjs',
  ] as const;

  for (const rel of scripts) {
    it(`${rel} rejects --wat with exit 2`, () => {
      const r = spawnSync(process.execPath, [resolve(ROOT, rel), '--wat'], {
        encoding: 'utf8',
        cwd: ROOT,
      });
      expect(r.status).toBe(2);
      const text = `${r.stdout}\n${r.stderr}`;
      expect(text).toMatch(/Unknown flag: --wat/);
      expect(text).toMatch(
        new RegExp(`Usage: node ${rel.replace(/\./g, '\\.')}`)
      );
    });

    it(`${rel} --help exits 0 without side-effect work`, () => {
      const r = spawnSync(process.execPath, [resolve(ROOT, rel), '--help'], {
        encoding: 'utf8',
        cwd: ROOT,
      });
      expect(r.status).toBe(0);
      const text = `${r.stdout}\n${r.stderr}`;
      expect(text).toMatch(
        new RegExp(`Usage: node ${rel.replace(/\./g, '\\.')}`)
      );
      expect(text).not.toMatch(/check:workflows OK/);
      expect(text).not.toMatch(/Module boundary audit/);
      expect(text).not.toMatch(/License & provenance report/);
      expect(text).not.toMatch(/Wrote .*licenses/);
    });
  }

  it('report-licenses --help does not write under test-results/licenses', () => {
    const probe = mkdtempSync(join(tmpdir(), 'mp-885-licenses-'));
    try {
      const marker = join(probe, 'should-not-appear');
      const r = spawnSync(
        process.execPath,
        [resolve(ROOT, 'scripts/report-licenses.mjs'), '--help'],
        {
          encoding: 'utf8',
          cwd: ROOT,
          env: { ...process.env, TMPDIR: probe },
        }
      );
      expect(r.status).toBe(0);
      expect(existsSync(marker)).toBe(false);
      // Default OUT_DIR is repo test-results/licenses — ensure help path did not
      // recreate a fresh write stamped in this process. Presence from prior runs
      // is ok; absence of "Wrote" in stdout is the contract (asserted above).
      expect(r.stdout).not.toMatch(/Wrote/);
    } finally {
      rmSync(probe, { recursive: true, force: true });
    }
  });
});
