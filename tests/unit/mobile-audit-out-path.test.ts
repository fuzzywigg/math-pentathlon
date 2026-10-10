/**
 * @vitest-environment node
 *
 * Hermetic coverage for mobile-audit `--out` validation (q-mp-844).
 */
import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import {
  mobileAuditOutUsage,
  resolveMobileAuditOutPath,
} from '../../scripts/lib/mobile-audit-out-path.mjs';

const DEFAULT = resolve('/tmp', 'mobile-audit-default.json');
const SCRIPT = resolve(process.cwd(), 'scripts/mobile-audit.mjs');

describe('resolveMobileAuditOutPath (q-mp-844)', () => {
  it('omitting --out keeps the default path', () => {
    expect(
      resolveMobileAuditOutPath(['node', 'scripts/mobile-audit.mjs'], DEFAULT)
    ).toEqual({
      ok: true,
      outPath: DEFAULT,
    });
  });

  it('resolves a valid --out path', () => {
    const got = resolveMobileAuditOutPath(
      ['node', 'scripts/mobile-audit.mjs', '--out', 'reports/out.json'],
      DEFAULT
    );
    expect(got.ok).toBe(true);
    if (got.ok) {
      expect(got.outPath).toBe(resolve('reports/out.json'));
    }
  });

  it('rejects missing --out value without calling path.resolve(undefined)', () => {
    const got = resolveMobileAuditOutPath(
      ['node', 'scripts/mobile-audit.mjs', '--out'],
      DEFAULT
    );
    expect(got.ok).toBe(false);
    if (!got.ok) {
      expect(got.message).toMatch(/Missing or invalid value for --out/);
    }
  });

  it('rejects another flag as the --out value', () => {
    const got = resolveMobileAuditOutPath(
      ['node', 'scripts/mobile-audit.mjs', '--out', '--verbose'],
      DEFAULT
    );
    expect(got.ok).toBe(false);
  });

  it('usage string names the script and --out', () => {
    expect(mobileAuditOutUsage()).toBe(
      'Usage: node scripts/mobile-audit.mjs [--out <path>]'
    );
  });
});

describe('mobile-audit.mjs CLI --out (q-mp-844)', () => {
  it('prints usage and exits non-zero without TypeError when --out has no value', () => {
    const r = spawnSync(process.execPath, [SCRIPT, '--out'], {
      encoding: 'utf8',
    });
    expect(r.status).toBeGreaterThan(0);
    const text = `${r.stdout}\n${r.stderr}`;
    expect(text).toMatch(/Missing or invalid value for --out/);
    expect(text).toMatch(/Usage: node scripts\/mobile-audit\.mjs/);
    expect(text).not.toMatch(/ERR_INVALID_ARG_TYPE/);
    expect(text).not.toMatch(/TypeError/);
  });
});
