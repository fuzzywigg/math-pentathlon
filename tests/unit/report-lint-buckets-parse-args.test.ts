/**
 * @vitest-environment node
 *
 * Hermetic coverage for report-lint-buckets argv (q-mp-870 value hygiene;
 * q-mp-943 unknown-flag rejection). Does not spawn the eslint probe (full
 * report stays integration-only).
 */
import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { parseArgs } from '../../scripts/report-lint-buckets.mjs';

const SCRIPT = resolve(process.cwd(), 'scripts/report-lint-buckets.mjs');

describe('report-lint-buckets parseArgs (q-mp-870)', () => {
  it('accepts --top N and --json together', () => {
    const got = parseArgs(['--top', '5', '--json']);
    expect(got.ok).toBe(true);
    if (got.ok) {
      expect(got.top).toBe(5);
      expect(got.json).toBe(true);
    }
  });

  it('accepts --top=N equals form with --json', () => {
    const got = parseArgs(['--top=3', '--json']);
    expect(got.ok).toBe(true);
    if (got.ok) {
      expect(got.top).toBe(3);
      expect(got.json).toBe(true);
    }
  });

  it('accepts --rule=name equals form', () => {
    const got = parseArgs(['--rule=curly']);
    expect(got.ok).toBe(true);
    if (got.ok) {
      expect(got.rule).toBe('curly');
    }
  });

  it('rejects bare --top without a value', () => {
    const got = parseArgs(['--top']);
    expect(got.ok).toBe(false);
    if (!got.ok) {
      expect(got.message).toMatch(/Missing or invalid value for --top/);
    }
  });

  it('rejects --top when the next token is another flag (does not eat --json)', () => {
    const got = parseArgs(['--top', '--json']);
    expect(got.ok).toBe(false);
    if (!got.ok) {
      expect(got.message).toMatch(/Missing or invalid value for --top/);
    }
  });

  it('rejects bare --rule without a value', () => {
    const got = parseArgs(['--rule']);
    expect(got.ok).toBe(false);
    if (!got.ok) {
      expect(got.message).toMatch(/Missing or invalid value for --rule/);
    }
  });

  it('rejects --rule when the next token is another flag', () => {
    const got = parseArgs(['--rule', '--json']);
    expect(got.ok).toBe(false);
  });
});

describe('report-lint-buckets parseArgs unknown flags (q-mp-943)', () => {
  it('rejects --wat', () => {
    expect(parseArgs(['--wat'])).toEqual({
      ok: false,
      message: 'Unknown flag: --wat',
    });
  });

  it('rejects --jason (typo for --json)', () => {
    expect(parseArgs(['--jason'])).toEqual({
      ok: false,
      message: 'Unknown flag: --jason',
    });
  });

  it('still accepts --help / -h without treating them as unknown', () => {
    const help = parseArgs(['--help']);
    expect(help.ok).toBe(true);
    if (help.ok) expect(help.help).toBe(true);
    const short = parseArgs(['-h']);
    expect(short.ok).toBe(true);
    if (short.ok) expect(short.help).toBe(true);
  });
});

describe('report-lint-buckets.mjs CLI --top/--rule (q-mp-870)', () => {
  it('prints usage and exits non-zero for --top --json without running a text report', () => {
    const r = spawnSync(process.execPath, [SCRIPT, '--top', '--json'], {
      encoding: 'utf8',
    });
    expect(r.status).toBe(2);
    const text = `${r.stdout}\n${r.stderr}`;
    expect(text).toMatch(/Missing or invalid value for --top/);
    expect(text).toMatch(/Usage:/);
    expect(text).not.toMatch(/Lint bucket summary/);
    // Must not look like JSON payload either (flag was not eaten into a run).
    expect(text.trim().startsWith('{')).toBe(false);
  });
});

describe('report-lint-buckets.mjs CLI unknown flags (q-mp-943)', () => {
  it('--wat exits 2 with usage before probing', () => {
    const r = spawnSync(process.execPath, [SCRIPT, '--wat'], {
      encoding: 'utf8',
    });
    expect(r.status).toBe(2);
    const text = `${r.stdout}\n${r.stderr}`;
    expect(text).toMatch(/Unknown flag: --wat/);
    expect(text).toMatch(/Usage:/);
    expect(text).not.toMatch(/Lint bucket summary/);
    expect(text.trim().startsWith('{')).toBe(false);
  });

  it('--jason exits 2 with usage before probing', () => {
    const r = spawnSync(process.execPath, [SCRIPT, '--jason'], {
      encoding: 'utf8',
    });
    expect(r.status).toBe(2);
    const text = `${r.stdout}\n${r.stderr}`;
    expect(text).toMatch(/Unknown flag: --jason/);
    expect(text).toMatch(/Usage:/);
    expect(text).not.toMatch(/Lint bucket summary/);
  });

  it('--help exits 0 with usage and does not probe', () => {
    const r = spawnSync(process.execPath, [SCRIPT, '--help'], {
      encoding: 'utf8',
    });
    expect(r.status).toBe(0);
    expect(r.stdout).toMatch(/Usage:/);
    expect(r.stdout).not.toMatch(/Lint bucket summary/);
  });
});
