/**
 * Hermetic helpers for scripts/engine-coverage-rank.mjs
 * (q-mp-842 missing-summary UX; q-mp-918 early --help / flag rejection;
 * q-mp-992 empty / non-engine summary reject;
 * q-mp-1018 derive or reject missing/non-numeric pct;
 * q-mp-1033 prefer covered/total over contradictory numeric pct).
 */
import { describe, it, expect, vi } from 'vitest';
import {
  USAGE,
  HELP,
  DEFAULT_SUMMARY_REL,
  parseArgs,
  resolveSummaryPath,
  missingSummaryMessage,
  emptyEngineSummaryMessage,
  invalidMetricMessage,
  InvalidCoverageMetricError,
  resolveMetric,
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

describe('engine-coverage-rank empty / non-engine summaries (q-mp-992)', () => {
  it('emptyEngineSummaryMessage includes Usage and path', () => {
    const msg = emptyEngineSummaryMessage('/tmp/e.json');
    expect(msg).toContain(USAGE);
    expect(msg).toContain('/tmp/e.json');
    expect(msg).toMatch(
      /^error: coverage summary has no matching engine modules:/
    );
    expect(msg).toMatch(/Empty objects|total-only|non-engine/);
  });

  it('collectEngineRows returns [] for empty, total-only, and non-engine', () => {
    expect(collectEngineRows({})).toEqual([]);
    expect(
      collectEngineRows({
        total: { lines: { total: 1, covered: 1, skipped: 0, pct: 100 } },
      })
    ).toEqual([]);
    expect(
      collectEngineRows({
        '/abs/src/main.ts': {
          lines: { pct: 100, covered: 1, total: 1 },
          branches: { pct: 100, covered: 1, total: 1 },
        },
      })
    ).toEqual([]);
  });

  it('main exits 2 for empty {} before printing a rank table', () => {
    const logs: string[] = [];
    const errors: string[] = [];
    const code = main(['/tmp/e.json'], {
      existsSync: (p) => p === '/tmp/e.json',
      readFileSync: () => '{}',
      log: (s) => logs.push(s),
      error: (s) => errors.push(s),
    });
    expect(code).toBe(2);
    expect(logs).toEqual([]);
    expect(errors.join('\n')).toBe(emptyEngineSummaryMessage('/tmp/e.json'));
    expect(errors.join('\n')).not.toMatch(/^rank\t/);
  });

  it('main exits 2 for total-only summary before printing a rank table', () => {
    const logs: string[] = [];
    const errors: string[] = [];
    const fixture = JSON.stringify({
      total: { lines: { total: 1, covered: 1, skipped: 0, pct: 100 } },
    });
    const code = main(['/tmp/t.json'], {
      existsSync: (p) => p === '/tmp/t.json',
      readFileSync: () => fixture,
      log: (s) => logs.push(s),
      error: (s) => errors.push(s),
    });
    expect(code).toBe(2);
    expect(logs).toEqual([]);
    expect(errors.join('\n')).toBe(emptyEngineSummaryMessage('/tmp/t.json'));
  });

  it('main exits 2 for non-engine-only rows before printing a rank table', () => {
    const logs: string[] = [];
    const errors: string[] = [];
    const fixture = JSON.stringify({
      total: { lines: { pct: 100 } },
      '/abs/src/main.ts': {
        lines: { pct: 100, covered: 1, total: 1 },
        branches: { pct: 100, covered: 1, total: 1 },
      },
    });
    const code = main(['/tmp/n.json'], {
      existsSync: (p) => p === '/tmp/n.json',
      readFileSync: () => fixture,
      log: (s) => logs.push(s),
      error: (s) => errors.push(s),
    });
    expect(code).toBe(2);
    expect(logs).toEqual([]);
    expect(errors.join('\n')).toBe(emptyEngineSummaryMessage('/tmp/n.json'));
    expect(errors.join('\n')).not.toContain('src/main.ts');
  });
});

describe('engine-coverage-rank missing / non-numeric pct (q-mp-1018)', () => {
  it('resolveMetric derives from covered/total; pct-only keeps numeric pct', () => {
    expect(resolveMetric(undefined)).toEqual({ pct: 0, covered: 0, total: 0 });
    expect(resolveMetric({ pct: 12.5, covered: 1, total: 8 })).toEqual({
      pct: 12.5,
      covered: 1,
      total: 8,
    });
    expect(resolveMetric({ total: 100, covered: 50, skipped: 0 })).toEqual({
      pct: 50,
      covered: 50,
      total: 100,
    });
    expect(resolveMetric({ total: 0, covered: 0 })).toEqual({
      pct: 100,
      covered: 0,
      total: 0,
    });
    // Pct-only numeric (no covered/total) still accepted.
    expect(resolveMetric({ pct: 12.5 })).toEqual({
      pct: 12.5,
      covered: 0,
      total: 0,
    });
    // String pct with numeric covered/total → derive (do not call toFixed on string).
    expect(
      resolveMetric({ pct: '50', total: 100, covered: 50, skipped: 0 })
    ).toEqual({ pct: 50, covered: 50, total: 100 });
    expect(resolveMetric({ pct: '50' })).toBeNull();
    expect(resolveMetric({ pct: null, covered: 1 })).toBeNull();
    expect(resolveMetric({})).toBeNull();
  });

  it('invalidMetricMessage includes file, summary path, and Usage (no stack tone)', () => {
    const msg = invalidMetricMessage('/tmp/s.json', 'src/games/calla/rules.ts');
    expect(msg).toContain(USAGE);
    expect(msg).toContain('/tmp/s.json');
    expect(msg).toContain('src/games/calla/rules.ts');
    expect(msg).toMatch(
      /^error: coverage summary has missing or non-numeric pct for engine module:/
    );
    expect(msg).toMatch(/numeric pct|derive pct/i);
    expect(msg).not.toMatch(/TypeError|toFixed|at /);
  });

  it('collectEngineRows derives pct when covered/total present without pct', () => {
    const rows = collectEngineRows({
      'src/games/calla/rules.ts': {
        lines: { total: 100, covered: 50, skipped: 0 },
      },
    });
    expect(rows).toHaveLength(1);
    expect(rows[0].linePct).toBe(50);
    expect(rows[0].lineCov).toBe(50);
    expect(rows[0].lineTot).toBe(100);
    expect(rows[0].branchPct).toBe(0);
    const out = formatRankOutput(rows);
    expect(out).toContain(
      '1\tsrc/games/calla/rules.ts\t50.00\t50/100\t0.00\t0/0'
    );
  });

  it('collectEngineRows derives when pct is a string but covered/total are numeric', () => {
    const rows = collectEngineRows({
      'src/games/calla/rules.ts': {
        lines: { total: 100, covered: 50, skipped: 0, pct: '50' },
        branches: { total: 10, covered: 5, skipped: 0, pct: '50' },
      },
    });
    expect(rows).toHaveLength(1);
    expect(rows[0].linePct).toBe(50);
    expect(rows[0].branchPct).toBe(50);
    expect(formatRankOutput(rows)).toContain(
      '1\tsrc/games/calla/rules.ts\t50.00\t50/100\t50.00\t5/10'
    );
  });

  it('collectEngineRows throws InvalidCoverageMetricError for string pct-only', () => {
    expect(() =>
      collectEngineRows({
        'src/games/calla/rules.ts': {
          lines: { pct: '50' },
        },
      })
    ).toThrow(InvalidCoverageMetricError);
    try {
      collectEngineRows({
        'src/games/calla/rules.ts': { lines: { pct: '50' } },
      });
      expect.unreachable('expected throw');
    } catch (err) {
      expect(err).toBeInstanceOf(InvalidCoverageMetricError);
      expect((err as InvalidCoverageMetricError).filePath).toBe(
        'src/games/calla/rules.ts'
      );
    }
  });

  it('main exits 2 with schema message for non-numeric pct (no stack / no table)', () => {
    const logs: string[] = [];
    const errors: string[] = [];
    const fixture = JSON.stringify({
      'src/games/calla/rules.ts': { lines: { pct: '50' } },
    });
    const code = main(['/tmp/cov-rules-strpct.json'], {
      existsSync: (p) => p === '/tmp/cov-rules-strpct.json',
      readFileSync: () => fixture,
      log: (s) => logs.push(s),
      error: (s) => errors.push(s),
    });
    expect(code).toBe(2);
    expect(logs).toEqual([]);
    expect(errors.join('\n')).toBe(
      invalidMetricMessage(
        '/tmp/cov-rules-strpct.json',
        'src/games/calla/rules.ts'
      )
    );
    expect(errors.join('\n')).not.toMatch(/TypeError|toFixed|at /);
    expect(errors.join('\n')).not.toMatch(/^rank\t/);
  });

  it('main derives missing pct from covered/total and exits 0', () => {
    const logs: string[] = [];
    const errors: string[] = [];
    const fixture = JSON.stringify({
      'src/games/calla/rules.ts': {
        lines: { total: 100, covered: 50, skipped: 0 },
      },
    });
    const code = main(['/tmp/cov-rules-nopct.json'], {
      existsSync: (p) => p === '/tmp/cov-rules-nopct.json',
      readFileSync: () => fixture,
      log: (s) => logs.push(s),
      error: (s) => errors.push(s),
    });
    expect(code).toBe(0);
    expect(errors).toEqual([]);
    expect(logs.join('\n')).toContain(
      '1\tsrc/games/calla/rules.ts\t50.00\t50/100\t0.00\t0/0'
    );
  });

  it('valid numeric-pct summaries remain unchanged (byte-stable table shape)', () => {
    const raw = {
      '/abs/src/games/hex/rules.ts': {
        lines: { pct: 90, covered: 9, total: 10 },
        branches: { pct: 80, covered: 8, total: 10 },
      },
    };
    const rows = collectEngineRows(raw);
    expect(formatRankOutput(rows)).toContain(
      '1\tsrc/games/hex/rules.ts\t90.00\t9/10\t80.00\t8/10'
    );
  });
});

describe('engine-coverage-rank contradictory numeric pct (q-mp-1033)', () => {
  it('resolveMetric prefers covered/total over contradictory numeric pct', () => {
    expect(
      resolveMetric({ total: 100, covered: 90, skipped: 0, pct: 10 })
    ).toEqual({ pct: 90, covered: 90, total: 100 });
    expect(
      resolveMetric({ total: 100, covered: 50, skipped: 0, pct: 50 })
    ).toEqual({ pct: 50, covered: 50, total: 100 });
  });

  it('never ranks a 90/100 row below a 50/100 row because stale pct:10 won', () => {
    const rows = collectEngineRows({
      'src/games/calla/rules.ts': {
        lines: { total: 100, covered: 90, skipped: 0, pct: 10 },
        branches: { total: 100, covered: 90, skipped: 0, pct: 10 },
      },
      'src/games/ramrod/rules.ts': {
        lines: { total: 100, covered: 50, skipped: 0, pct: 50 },
        branches: { total: 100, covered: 50, skipped: 0, pct: 50 },
      },
    });
    expect(rows).toHaveLength(2);
    // Lower coverage ranks first (debt order): ramrod 50% before calla 90%.
    expect(rows[0].file).toBe('src/games/ramrod/rules.ts');
    expect(rows[0].linePct).toBe(50);
    expect(rows[1].file).toBe('src/games/calla/rules.ts');
    expect(rows[1].linePct).toBe(90);
    const out = formatRankOutput(rows);
    expect(out).toContain(
      '1\tsrc/games/ramrod/rules.ts\t50.00\t50/100\t50.00\t50/100'
    );
    expect(out).toContain(
      '2\tsrc/games/calla/rules.ts\t90.00\t90/100\t90.00\t90/100'
    );
    expect(out).not.toMatch(/calla\/rules\.ts\t10\.00/);
  });

  it('main derives stale pct from covered/total and exits 0', () => {
    const logs: string[] = [];
    const errors: string[] = [];
    const fixture = JSON.stringify({
      'src/games/calla/rules.ts': {
        lines: { total: 100, covered: 90, skipped: 0, pct: 10 },
        branches: { total: 100, covered: 90, skipped: 0, pct: 10 },
      },
      'src/games/ramrod/rules.ts': {
        lines: { total: 100, covered: 50, skipped: 0, pct: 50 },
        branches: { total: 100, covered: 50, skipped: 0, pct: 50 },
      },
    });
    const code = main(['/tmp/stale-pct.json'], {
      existsSync: (p) => p === '/tmp/stale-pct.json',
      readFileSync: () => fixture,
      log: (s) => logs.push(s),
      error: (s) => errors.push(s),
    });
    expect(code).toBe(0);
    expect(errors).toEqual([]);
    const table = logs.join('\n');
    expect(table.indexOf('src/games/ramrod/rules.ts')).toBeLessThan(
      table.indexOf('src/games/calla/rules.ts')
    );
    expect(table).toContain(
      '1\tsrc/games/ramrod/rules.ts\t50.00\t50/100\t50.00\t50/100'
    );
    expect(table).toContain(
      '2\tsrc/games/calla/rules.ts\t90.00\t90/100\t90.00\t90/100'
    );
  });
});
