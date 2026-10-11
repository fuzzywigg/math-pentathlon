/**
 * @vitest-environment node
 *
 * Hermetic coverage for report-lint-buckets argv (q-mp-870 value hygiene;
 * q-mp-943 unknown-flag rejection; q-mp-968 non-positive / non-integer --top
 * + empty --rule=; q-mp-1360 duplicate --top/--rule rejection). Does not
 * spawn the eslint probe (full report stays integration-only).
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

describe('report-lint-buckets parseArgs --top/--rule value hygiene (q-mp-968)', () => {
  it('rejects --top 0 (does not keep default)', () => {
    const got = parseArgs(['--top', '0']);
    expect(got.ok).toBe(false);
    if (!got.ok) {
      expect(got.message).toMatch(/Missing or invalid value for --top/);
    }
  });

  it('rejects --top=0', () => {
    const got = parseArgs(['--top=0']);
    expect(got.ok).toBe(false);
  });

  it('rejects --top=abc', () => {
    const got = parseArgs(['--top=abc']);
    expect(got.ok).toBe(false);
    if (!got.ok) {
      expect(got.message).toMatch(/Missing or invalid value for --top/);
    }
  });

  it('rejects non-integer --top 1.5 (no parseInt truncation)', () => {
    const got = parseArgs(['--top', '1.5']);
    expect(got.ok).toBe(false);
    if (!got.ok) {
      expect(got.message).toMatch(/Missing or invalid value for --top/);
    }
  });

  it('rejects empty --rule=', () => {
    const got = parseArgs(['--rule=']);
    expect(got.ok).toBe(false);
    if (!got.ok) {
      expect(got.message).toMatch(/Missing or invalid value for --rule/);
    }
  });

  it('still accepts valid --top 5 and --rule=curly', () => {
    const top = parseArgs(['--top', '5']);
    expect(top.ok).toBe(true);
    if (top.ok) expect(top.top).toBe(5);
    const rule = parseArgs(['--rule=curly']);
    expect(rule.ok).toBe(true);
    if (rule.ok) expect(rule.rule).toBe('curly');
  });
});

describe('report-lint-buckets parseArgs duplicate --top/--rule (q-mp-1360)', () => {
  it('rejects --top 2 --top 9 (no last-wins)', () => {
    const got = parseArgs(['--top', '2', '--top', '9']);
    expect(got).toEqual({ ok: false, message: 'Duplicate --top' });
  });

  it('rejects --top=2 --top=9 mixed equals form', () => {
    const got = parseArgs(['--top=2', '--top=9']);
    expect(got).toEqual({ ok: false, message: 'Duplicate --top' });
  });

  it('rejects --top 2 --top=9 space then equals', () => {
    const got = parseArgs(['--top', '2', '--top=9']);
    expect(got).toEqual({ ok: false, message: 'Duplicate --top' });
  });

  it('rejects --rule a --rule b (no last-wins)', () => {
    const got = parseArgs(['--rule', 'a', '--rule', 'b']);
    expect(got).toEqual({ ok: false, message: 'Duplicate --rule' });
  });

  it('rejects --rule=a --rule=b equals form', () => {
    const got = parseArgs(['--rule=a', '--rule=b']);
    expect(got).toEqual({ ok: false, message: 'Duplicate --rule' });
  });

  it('still accepts a single --top and a single --rule together', () => {
    const got = parseArgs(['--top', '5', '--rule', 'curly', '--json']);
    expect(got.ok).toBe(true);
    if (got.ok) {
      expect(got.top).toBe(5);
      expect(got.rule).toBe('curly');
      expect(got.json).toBe(true);
    }
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

describe('report-lint-buckets.mjs CLI --top/--rule value hygiene (q-mp-968)', () => {
  it('--top 0 exits 2 with usage before probing', () => {
    const r = spawnSync(process.execPath, [SCRIPT, '--top', '0'], {
      encoding: 'utf8',
    });
    expect(r.status).toBe(2);
    const text = `${r.stdout}\n${r.stderr}`;
    expect(text).toMatch(/Missing or invalid value for --top/);
    expect(text).toMatch(/Usage:/);
    expect(text).not.toMatch(/Lint bucket summary/);
  });

  it('--top=abc exits 2 with usage before probing', () => {
    const r = spawnSync(process.execPath, [SCRIPT, '--top=abc'], {
      encoding: 'utf8',
    });
    expect(r.status).toBe(2);
    const text = `${r.stdout}\n${r.stderr}`;
    expect(text).toMatch(/Missing or invalid value for --top/);
    expect(text).toMatch(/Usage:/);
    expect(text).not.toMatch(/Lint bucket summary/);
  });

  it('--top 1.5 exits 2 with usage before probing', () => {
    const r = spawnSync(process.execPath, [SCRIPT, '--top', '1.5'], {
      encoding: 'utf8',
    });
    expect(r.status).toBe(2);
    const text = `${r.stdout}\n${r.stderr}`;
    expect(text).toMatch(/Missing or invalid value for --top/);
    expect(text).toMatch(/Usage:/);
    expect(text).not.toMatch(/Lint bucket summary/);
  });

  it('--rule= exits 2 with usage before probing', () => {
    const r = spawnSync(process.execPath, [SCRIPT, '--rule='], {
      encoding: 'utf8',
    });
    expect(r.status).toBe(2);
    const text = `${r.stdout}\n${r.stderr}`;
    expect(text).toMatch(/Missing or invalid value for --rule/);
    expect(text).toMatch(/Usage:/);
    expect(text).not.toMatch(/Lint bucket summary/);
  });
});

describe('report-lint-buckets.mjs CLI duplicate --top/--rule (q-mp-1360)', () => {
  it('--top 2 --top 9 exits 2 with Duplicate before probing', () => {
    const r = spawnSync(
      process.execPath,
      [SCRIPT, '--top', '2', '--top', '9'],
      {
        encoding: 'utf8',
      }
    );
    expect(r.status).toBe(2);
    const text = `${r.stdout}\n${r.stderr}`;
    expect(text).toMatch(/Duplicate --top/);
    expect(text).toMatch(/Usage:/);
    expect(text).not.toMatch(/Lint bucket summary/);
  });

  it('--rule a --rule b exits 2 with Duplicate before probing', () => {
    const r = spawnSync(
      process.execPath,
      [SCRIPT, '--rule', 'a', '--rule', 'b'],
      {
        encoding: 'utf8',
      }
    );
    expect(r.status).toBe(2);
    const text = `${r.stdout}\n${r.stderr}`;
    expect(text).toMatch(/Duplicate --rule/);
    expect(text).toMatch(/Usage:/);
    expect(text).not.toMatch(/Lint bucket summary/);
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
