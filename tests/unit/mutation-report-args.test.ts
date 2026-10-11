/**
 * @vitest-environment node
 *
 * Hermetic coverage for mutation-report argv validation
 * (q-mp-867 / q-mp-868 / q-mp-892 / q-mp-967 / q-mp-1064 / q-mp-1217 /
 * q-mp-1232).
 *
 * Argv reject paths assert via parseMutationReportArgs /
 * resolveMutationReportGames in-process (q-mp-1064 wall-time cut).
 * Thin spawnSync smokes remain for mutation-report.mjs --help and
 * --dry-run plan wiring only — leave empty-argv product (#1232/967)
 * and lib main-entry (#1235/975) alone.
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
const USAGE_LINE = MUTATION_REPORT_USAGE.split('\n')[0];

function parse(argv: string[]) {
  return parseMutationReportArgs(argv, { defaultJsonOut: DEFAULT_JSON });
}

/** CLI usageExit(message) prints message then MUTATION_REPORT_USAGE. */
function expectParseReject(argv: string[], messageRe: RegExp) {
  const got = parse(argv);
  expect(got.ok).toBe(false);
  if (!got.ok) {
    expect(got.message).toMatch(messageRe);
    expect(USAGE_LINE).toMatch(/Usage: node scripts\/mutation-report\.mjs/);
  }
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

  it('rejects non-integer --max (q-mp-1217)', () => {
    const got = parse(['--max=2.9']);
    expect(got.ok).toBe(false);
    if (!got.ok) {
      expect(got.message).toMatch(/Invalid --max/);
      expect(got.message).toMatch(/integer/);
      expect(got.message).toMatch(/2\.9/);
    }
  });

  it('rejects non-integer --timeout (q-mp-1217)', () => {
    const got = parse(['--timeout=5000.5']);
    expect(got.ok).toBe(false);
    if (!got.ok) {
      expect(got.message).toMatch(/Invalid --timeout/);
      expect(got.message).toMatch(/integer/);
      expect(got.message).toMatch(/5000\.5/);
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

describe('parseMutationReportArgs (q-mp-967 empty values)', () => {
  it('rejects empty --max=', () => {
    const got = parse(['--max=']);
    expect(got.ok).toBe(false);
    if (!got.ok) {
      expect(got.message).toMatch(/Invalid --max/);
    }
  });

  it('rejects whitespace-only --max=', () => {
    const got = parse(['--max=   ']);
    expect(got.ok).toBe(false);
    if (!got.ok) {
      expect(got.message).toMatch(/Invalid --max/);
    }
  });

  it('still accepts --max=0 as all (not empty)', () => {
    const got = parse(['--max=0']);
    expect(got.ok).toBe(true);
    if (got.ok) {
      expect(got.opts.max).toBe(0);
    }
  });

  it('rejects empty --games=', () => {
    const got = parse(['--games=']);
    expect(got.ok).toBe(false);
    if (!got.ok) {
      expect(got.message).toMatch(/Invalid --games/);
    }
  });

  it('rejects comma-only --games=,,,', () => {
    const got = parse(['--games=,,,']);
    expect(got.ok).toBe(false);
    if (!got.ok) {
      expect(got.message).toMatch(/Invalid --games/);
    }
  });

  it('rejects whitespace-only --games=', () => {
    const got = parse(['--games=  ,  ']);
    expect(got.ok).toBe(false);
    if (!got.ok) {
      expect(got.message).toMatch(/Invalid --games/);
    }
  });

  it('rejects empty --json=', () => {
    const got = parse(['--json=']);
    expect(got.ok).toBe(false);
    if (!got.ok) {
      expect(got.message).toMatch(/Invalid --json/);
    }
  });

  it('rejects whitespace-only --json=', () => {
    const got = parse(['--json=   ']);
    expect(got.ok).toBe(false);
    if (!got.ok) {
      expect(got.message).toMatch(/Invalid --json/);
    }
  });

  it('accepts valid --games=calla and --json=path', () => {
    const got = parse(['--games=calla', '--json=/tmp/out.json']);
    expect(got.ok).toBe(true);
    if (got.ok) {
      expect(got.opts.games).toEqual(['calla']);
      expect(got.opts.jsonOut).toBe('/tmp/out.json');
    }
  });

  it('skips empty-value validation when --help is present', () => {
    const got = parse(['--help', '--max=', '--games=', '--json=']);
    expect(got.ok).toBe(true);
    if (got.ok) {
      expect(got.opts.help).toBe(true);
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

  it('dedupes requested games preserving first-seen order (q-mp-1232)', () => {
    expect(resolveMutationReportGames(['hex', 'hex'], ['hex', 'fiar'])).toEqual(
      {
        ok: true,
        games: ['hex'],
      },
    );
    expect(
      resolveMutationReportGames(['hex', 'fiar', 'hex', 'calla', 'fiar'], VALID),
    ).toEqual({
      ok: true,
      games: ['hex', 'fiar', 'calla'],
    });
  });

  it('still rejects unknown ids when duplicates are present (q-mp-1232)', () => {
    const got = resolveMutationReportGames(['hex', 'nope', 'hex'], VALID);
    expect(got.ok).toBe(false);
    if (!got.ok) {
      expect(got.message).toMatch(/unknown game\(s\): nope/);
    }
  });
});

describe('mutation-report argv rejects in-process (q-mp-1064)', () => {
  it('rejects empty --max= before any plan or mutation', () => {
    expectParseReject(['--max=', '--dry-run'], /Invalid --max/);
  });

  it('rejects empty --games= before any plan or mutation', () => {
    expectParseReject(['--games=', '--dry-run'], /Invalid --games/);
  });

  it('rejects empty --json= before any plan or mutation', () => {
    expectParseReject(['--json=', '--dry-run'], /Invalid --json/);
  });

  it('rejects non-numeric --max before mutation', () => {
    expectParseReject(['--max=abc'], /Invalid --max/);
  });

  it('rejects non-numeric --timeout before mutation', () => {
    expectParseReject(['--timeout=xyz'], /Invalid --timeout/);
  });

  it('rejects unknown --games ids before rules.ts I/O', () => {
    const parsed = parse(['--games=no-such-game', '--max=1']);
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    const resolved = resolveMutationReportGames(parsed.opts.games, VALID);
    expect(resolved.ok).toBe(false);
    if (!resolved.ok) {
      expect(resolved.message).toMatch(/unknown game\(s\): no-such-game/);
      expect(resolved.message).toMatch(/valid games:/);
      expect(resolved.message).not.toMatch(/ENOENT/);
      expect(resolved.message).not.toMatch(/no-such-game\/rules\.ts/);
    }
  });

  it('rejects unknown flags before mutation', () => {
    expectParseReject(['--wat'], /Unknown flag: --wat/);
  });
});

describe('mutation-report.mjs CLI spawn smoke (q-mp-1064)', () => {
  it('prints usage and exits 0 for --help without mutating', () => {
    const r = spawnSync(process.execPath, [SCRIPT, '--help'], {
      encoding: 'utf8',
    });
    expect(r.status).toBe(0);
    expect(r.stdout).toContain(USAGE_LINE);
    expect(r.stdout).toMatch(/--dry-run/);
    expect(r.stdout).not.toMatch(/Mutation report \(rules engines\)/);
    expect(r.stdout).not.toMatch(/=== calla ===/);
    expect(r.stdout).not.toMatch(/KILLED|SURVIVED/);
  });

  it('lists plan with maxMutantsPerGame=all for --max=0 --dry-run', () => {
    const r = spawnSync(process.execPath, [SCRIPT, '--max=0', '--dry-run'], {
      encoding: 'utf8',
    });
    expect(r.status).toBe(0);
    expect(r.stdout).toMatch(/would mutate \d+ games/);
    expect(r.stdout).toMatch(/maxMutantsPerGame=all/);
    expect(r.stdout).not.toMatch(/KILLED|SURVIVED/);
    expect(r.stdout).not.toMatch(/Wrote /);
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
});
