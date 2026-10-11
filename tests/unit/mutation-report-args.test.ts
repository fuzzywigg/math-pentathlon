/**
 * @vitest-environment node
 *
 * Hermetic coverage for mutation-report argv validation
 * (q-mp-867 / q-mp-868 / q-mp-892).
 */
import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import {
  MUTATION_REPORT_USAGE,
  parseMutationReportArgs,
  resolveMutationReportGames,
} from '../../scripts/lib/mutation-report-args.mjs';

const SCRIPT = resolve(process.cwd(), 'scripts/mutation-report.mjs');
const DEFAULT_JSON = resolve('/tmp', 'mutation-report-default.json');
const VALID = ['calla', 'hex', 'fiar'];

function parse(argv: string[]) {
  return parseMutationReportArgs(argv, { defaultJsonOut: DEFAULT_JSON });
}

describe('parseMutationReportArgs (q-mp-867)', () => {
  it('keeps defaults when no numeric flags are provided', () => {
    const got = parse([]);
    expect(got.ok).toBe(true);
    if (got.ok) {
      expect(got.opts.max).toBe(35);
      expect(got.opts.timeoutMs).toBe(45_000);
      expect(got.opts.games).toBeNull();
      expect(got.opts.jsonOut).toBe(DEFAULT_JSON);
      expect(got.opts.quietTests).toBe(true);
      expect(got.opts.help).toBe(false);
      expect(got.opts.dryRun).toBe(false);
    }
  });

  it('accepts --max=0 (all mutants) and valid --timeout', () => {
    const got = parse(['--max=0', '--timeout=5000', '--games=calla']);
    expect(got.ok).toBe(true);
    if (got.ok) {
      expect(got.opts.max).toBe(0);
      expect(got.opts.timeoutMs).toBe(5000);
      expect(got.opts.games).toEqual(['calla']);
    }
  });

  it('rejects non-numeric --max', () => {
    const got = parse(['--max=abc']);
    expect(got.ok).toBe(false);
    if (!got.ok) {
      expect(got.message).toMatch(/Invalid --max/);
      expect(got.message).toMatch(/abc/);
    }
  });

  it('rejects negative --max', () => {
    const got = parse(['--max=-1']);
    expect(got.ok).toBe(false);
    if (!got.ok) {
      expect(got.message).toMatch(/Invalid --max/);
    }
  });

  it('rejects non-numeric --timeout', () => {
    const got = parse(['--timeout=xyz']);
    expect(got.ok).toBe(false);
    if (!got.ok) {
      expect(got.message).toMatch(/Invalid --timeout/);
      expect(got.message).toMatch(/xyz/);
    }
  });

  it('rejects --timeout below 5000', () => {
    const got = parse(['--timeout=4999']);
    expect(got.ok).toBe(false);
    if (!got.ok) {
      expect(got.message).toMatch(/Invalid --timeout/);
    }
  });
});

describe('parseMutationReportArgs (q-mp-892 help / dry-run / unknown)', () => {
  it('accepts --help and -h without validating numeric flags', () => {
    for (const flag of ['--help', '-h'] as const) {
      const got = parse([flag, '--max=abc']);
      expect(got.ok).toBe(true);
      if (got.ok) {
        expect(got.opts.help).toBe(true);
      }
    }
  });

  it('accepts --dry-run with other valid flags', () => {
    const got = parse(['--dry-run', '--games=calla', '--max=1']);
    expect(got.ok).toBe(true);
    if (got.ok) {
      expect(got.opts.dryRun).toBe(true);
      expect(got.opts.games).toEqual(['calla']);
      expect(got.opts.max).toBe(1);
    }
  });

  it('rejects unknown flags', () => {
    const got = parse(['--wat']);
    expect(got.ok).toBe(false);
    if (!got.ok) {
      expect(got.message).toMatch(/Unknown flag: --wat/);
    }
  });

  it('rejects unexpected bare arguments', () => {
    const got = parse(['calla']);
    expect(got.ok).toBe(false);
    if (!got.ok) {
      expect(got.message).toMatch(/Unexpected argument: calla/);
    }
  });
});

describe('resolveMutationReportGames (q-mp-868)', () => {
  it('uses the full valid list when games is null', () => {
    expect(resolveMutationReportGames(null, VALID)).toEqual({
      ok: true,
      games: VALID,
    });
  });

  it('accepts known game ids', () => {
    expect(resolveMutationReportGames(['calla', 'hex'], VALID)).toEqual({
      ok: true,
      games: ['calla', 'hex'],
    });
  });

  it('rejects unknown game ids with a valid-games list', () => {
    const got = resolveMutationReportGames(['no-such-game'], VALID);
    expect(got.ok).toBe(false);
    if (!got.ok) {
      expect(got.message).toMatch(/unknown game\(s\): no-such-game/);
      expect(got.message).toMatch(/valid games: calla, hex, fiar/);
    }
  });
});

describe('mutation-report.mjs CLI argv (q-mp-867 / q-mp-868 / q-mp-892)', () => {
  it('prints usage and exits non-zero for --max=abc without mutating rules.ts', () => {
    const r = spawnSync(process.execPath, [SCRIPT, '--max=abc'], {
      encoding: 'utf8',
    });
    expect(r.status).toBe(2);
    const text = `${r.stdout}\n${r.stderr}`;
    expect(text).toMatch(/Invalid --max/);
    expect(text).toMatch(/Usage: node scripts\/mutation-report\.mjs/);
    expect(text).not.toMatch(/=== calla ===/);
    expect(text).not.toMatch(/Mutation report \(rules engines\)/);
  });

  it('prints usage and exits non-zero for --timeout=xyz without mutating', () => {
    const r = spawnSync(process.execPath, [SCRIPT, '--timeout=xyz'], {
      encoding: 'utf8',
    });
    expect(r.status).toBe(2);
    const text = `${r.stdout}\n${r.stderr}`;
    expect(text).toMatch(/Invalid --timeout/);
    expect(text).toContain(MUTATION_REPORT_USAGE.split('\n')[0]);
    expect(text).not.toMatch(/=== calla ===/);
  });

  it('rejects unknown --games ids without ENOENT stack or rules.ts I/O', () => {
    const r = spawnSync(
      process.execPath,
      [SCRIPT, '--games=no-such-game', '--max=1'],
      { encoding: 'utf8' }
    );
    expect(r.status).toBe(2);
    const text = `${r.stdout}\n${r.stderr}`;
    expect(text).toMatch(/unknown game\(s\): no-such-game/);
    expect(text).toMatch(/valid games:/);
    expect(text).not.toMatch(/ENOENT/);
    expect(text).not.toMatch(/no-such-game\/rules\.ts/);
    expect(text).not.toMatch(/Mutation report \(rules engines\)/);
  });

  it('prints usage and exits 0 for --help without mutating', () => {
    const r = spawnSync(process.execPath, [SCRIPT, '--help'], {
      encoding: 'utf8',
    });
    expect(r.status).toBe(0);
    expect(r.stdout).toContain(MUTATION_REPORT_USAGE.split('\n')[0]);
    expect(r.stdout).toMatch(/--dry-run/);
    expect(r.stdout).not.toMatch(/Mutation report \(rules engines\)/);
    expect(r.stdout).not.toMatch(/=== calla ===/);
    expect(r.stdout).not.toMatch(/KILLED|SURVIVED/);
  });

  it('lists plan and exits 0 for --dry-run without mutating', () => {
    const r = spawnSync(process.execPath, [SCRIPT, '--dry-run', '--max=1'], {
      encoding: 'utf8',
    });
    expect(r.status).toBe(0);
    expect(r.stdout).toMatch(/would mutate \d+ games/);
    expect(r.stdout).toMatch(/games=/);
    expect(r.stdout).toMatch(/maxMutantsPerGame=1/);
    expect(r.stdout).not.toMatch(/=== calla ===/);
    expect(r.stdout).not.toMatch(/KILLED|SURVIVED/);
    expect(r.stdout).not.toMatch(/Wrote /);
  });

  it('rejects unknown flags before mutation', () => {
    const r = spawnSync(process.execPath, [SCRIPT, '--wat'], {
      encoding: 'utf8',
    });
    expect(r.status).toBe(2);
    const text = `${r.stdout}\n${r.stderr}`;
    expect(text).toMatch(/Unknown flag: --wat/);
    expect(text).toMatch(/Usage: node scripts\/mutation-report\.mjs/);
    expect(text).not.toMatch(/Mutation report \(rules engines\)/);
    expect(text).not.toMatch(/=== calla ===/);
  });
});
