/**
 * Hermetic helpers for scripts/engine-coverage-rank.mjs
 * (q-mp-842 missing-summary UX; q-mp-918 early --help / flag rejection).
 */
import { describe, it, expect, vi } from 'vitest';
import {
  USAGE,
  HELP,
  DEFAULT_SUMMARY_REL,
  parseArgs,
  resolveSummaryPath,
  missingSummaryMessage,
  collectEngineRows,
  formatRankOutput,
  main,
} from '../../scripts/engine-coverage-rank.mjs';

describe('engine-coverage-rank helpers (q-mp-842)', () => {
  it('documents usage and default relative path', () => {
    expect(USAGE).toBe(
      'Usage: node scripts/engine-coverage-rank.mjs <path/to/coverage-summary.json>'
    );
    expect(DEFAULT_SUMMARY_REL).toBe(
      'coverage-engine-baseline/coverage-summary.json'
    );
  });

  it('resolveSummaryPath uses default when arg omitted', () => {
    expect(resolveSummaryPath(undefined, '/repo')).toBe(
      `/repo/${DEFAULT_SUMMARY_REL}`
    );
    expect(resolveSummaryPath('tmp/summary.json', '/repo')).toBe(
      '/repo/tmp/summary.json'
    );
  });

  it('missingSummaryMessage includes Usage and path', () => {
    const msg = missingSummaryMessage('/repo/' + DEFAULT_SUMMARY_REL);
    expect(msg).toContain(USAGE);
    expect(msg).toContain(DEFAULT_SUMMARY_REL);
    expect(msg).toMatch(/^error: coverage summary not found:/);
  });

  it('main exits 2 with usage when summary missing (no throw)', () => {
    const errors: string[] = [];
    const logs: string[] = [];
    const code = main([], {
      cwd: '/repo',
      existsSync: () => false,
      log: (s) => logs.push(s),
      error: (s) => errors.push(s),
    });
    expect(code).toBe(2);
    expect(logs).toEqual([]);
    expect(errors.join('\n')).toContain(USAGE);
    expect(errors.join('\n')).not.toMatch(/ENOENT|Error:/);
    // Missing-summary path still uses the q-mp-842 one-line USAGE, not HELP options.
    expect(errors.join('\n')).toBe(
      missingSummaryMessage(`/repo/${DEFAULT_SUMMARY_REL}`)
    );
  });

  it('ranks engine modules and keeps table shape on valid JSON', () => {
    const raw = {
      total: { lines: { pct: 50 } },
      '/abs/src/games/hex/rules.ts': {
        lines: { pct: 90, covered: 9, total: 10 },
        branches: { pct: 80, covered: 8, total: 10 },
      },
      '/abs/src/games/hex/ai.ts': {
        lines: { pct: 10, covered: 1, total: 10 },
        branches: { pct: 10, covered: 1, total: 10 },
      },
      '/abs/src/games/hex/board.ts': {
        lines: { pct: 70, covered: 7, total: 10 },
        branches: { pct: 60, covered: 6, total: 10 },
      },
      '/abs/src/ui/menu.ts': {
        lines: { pct: 100, covered: 1, total: 1 },
        branches: { pct: 100, covered: 1, total: 1 },
      },
    };
    const rows = collectEngineRows(raw);
    expect(rows.map((r) => r.file)).toEqual([
      'src/games/hex/board.ts',
      'src/games/hex/rules.ts',
    ]);
    const out = formatRankOutput(rows);
    expect(out.split('\n')[0]).toBe(
      'rank\tfile\tline%\tlines\tbranch%\tbranches'
    );
    expect(out).toContain(
      '1\tsrc/games/hex/board.ts\t70.00\t7/10\t60.00\t6/10'
    );
    expect(out).toContain(
      '2\tsrc/games/hex/rules.ts\t90.00\t9/10\t80.00\t8/10'
    );
    expect(out).toContain(
      '--- per-game (rules.ts preferred; companions listed) ---'
    );
    expect(out).toContain(
      'hex\trules-branch 80.00% (8/10)\tline 90.00% (9/10)'
    );
    expect(out).toContain('  + board\tbranch 60.00%\tline 70.00%');
    expect(out).not.toContain('ai.ts');
  });

  it('main prints rank table and exits 0 for readable summary', () => {
    const logs: string[] = [];
    const errors: string[] = [];
    const fixture = JSON.stringify({
      '/x/src/games/calla/rules.ts': {
        lines: { pct: 100, covered: 2, total: 2 },
        branches: { pct: 100, covered: 1, total: 1 },
      },
    });
    const code = main(['/tmp/fixture-summary.json'], {
      existsSync: (p) => p === '/tmp/fixture-summary.json',
      readFileSync: () => fixture,
      log: (s) => logs.push(s),
      error: (s) => errors.push(s),
    });
    expect(code).toBe(0);
    expect(errors).toEqual([]);
    expect(logs.join('\n')).toContain('src/games/calla/rules.ts');
    expect(logs.join('\n')).toContain(
      'rank\tfile\tline%\tlines\tbranch%\tbranches'
    );
  });
});

describe('engine-coverage-rank CLI argv (q-mp-918)', () => {
  it('parseArgs recognizes --help / -h, path, and unknown flags', () => {
    expect(parseArgs([])).toEqual({
      ok: true,
      help: false,
      summaryPath: undefined,
    });
    expect(parseArgs(['--help'])).toEqual({
      ok: true,
      help: true,
      summaryPath: undefined,
    });
    expect(parseArgs(['-h'])).toEqual({
      ok: true,
      help: true,
      summaryPath: undefined,
    });
    expect(
      parseArgs(['coverage-engine-baseline/coverage-summary.json'])
    ).toEqual({
      ok: true,
      help: false,
      summaryPath: 'coverage-engine-baseline/coverage-summary.json',
    });
    expect(parseArgs(['--wat'])).toEqual({
      ok: false,
      message: 'Unknown flag: --wat',
    });
    expect(parseArgs(['--help', 'extra.json']).ok).toBe(true);
    expect(parseArgs(['a.json', 'b.json'])).toEqual({
      ok: false,
      message: 'Unexpected argument: b.json',
    });
  });

  it('HELP documents --help and keeps USAGE one-liner stable', () => {
    expect(HELP).toContain(USAGE);
    expect(HELP).toMatch(/-h, --help/);
    expect(USAGE).toBe(
      'Usage: node scripts/engine-coverage-rank.mjs <path/to/coverage-summary.json>'
    );
  });

  it('main --help exits 0 with usage before path lookup', () => {
    const logs: string[] = [];
    const errors: string[] = [];
    const existsSync = vi.fn(() => false);
    const code = main(['--help'], {
      cwd: '/repo',
      existsSync,
      log: (s) => logs.push(s),
      error: (s) => errors.push(s),
    });
    expect(code).toBe(0);
    expect(errors).toEqual([]);
    expect(logs.join('\n')).toContain(USAGE);
    expect(logs.join('\n')).toMatch(/-h, --help/);
    expect(logs.join('\n')).not.toMatch(/coverage summary not found/);
    expect(existsSync).not.toHaveBeenCalled();
  });

  it('main -h matches --help (no path lookup)', () => {
    const logs: string[] = [];
    const existsSync = vi.fn(() => true);
    const code = main(['-h'], {
      existsSync,
      log: (s) => logs.push(s),
      error: () => undefined,
    });
    expect(code).toBe(0);
    expect(logs.join('\n')).toMatch(/Usage:/i);
    expect(existsSync).not.toHaveBeenCalled();
  });

  it('main unknown flags exit 2 with usage before path lookup', () => {
    const errors: string[] = [];
    const logs: string[] = [];
    const existsSync = vi.fn(() => false);
    const code = main(['--wat'], {
      cwd: '/repo',
      existsSync,
      log: (s) => logs.push(s),
      error: (s) => errors.push(s),
    });
    expect(code).toBe(2);
    expect(logs).toEqual([]);
    expect(errors.join('\n')).toMatch(/Unknown flag:\s*--wat/);
    expect(errors.join('\n')).toContain(USAGE);
    expect(errors.join('\n')).not.toMatch(/coverage summary not found/);
    expect(existsSync).not.toHaveBeenCalled();
  });
});
