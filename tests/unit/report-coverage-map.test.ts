import { describe, it, expect } from 'vitest';
import {
  escapeXml,
  normalizeRepoPath,
  aggregateByDirectory,
  readMetric,
  heatColor,
  heatTextColor,
  renderCoverageHeatSvg,
  renderCoverageMapMarkdown,
  missingSummaryMessage,
  writeReport,
  DEFAULT_SUMMARY,
} from '../../scripts/report-coverage-map.mjs';

describe('report-coverage-map helpers (q-mp-075)', () => {
  it('escapes XML special characters', () => {
    expect(escapeXml(`&<>"'`)).toBe('&amp;&lt;&gt;&quot;&apos;');
  });

  it('normalizes absolute coverage keys to repo-relative src paths', () => {
    expect(
      normalizeRepoPath('/workspace/src/games/hex/rules.ts', '/workspace')
    ).toBe('src/games/hex/rules.ts');
    expect(normalizeRepoPath('src/ui/shell.ts', '/workspace')).toBe(
      'src/ui/shell.ts'
    );
  });

  it('uses last /src/ and ignores lone outside-root /src/ (q-mp-1199)', () => {
    // First /src/ used to invent synthetic backup/lib heat prefix.
    expect(normalizeRepoPath('/home/src/backup/lib/foo.ts', '/workspace')).toBe(
      '/home/src/backup/lib/foo.ts'
    );
    // Nested abs key: last /src/ wins.
    expect(
      normalizeRepoPath(
        '/home/src/backup/lib/workspace/src/games/hex/rules.ts',
        '/workspace'
      )
    ).toBe('src/games/hex/rules.ts');
    expect(
      normalizeRepoPath(
        '/home/ubuntu/src/old/repo/src/ui/shell.ts',
        '/workspace'
      )
    ).toBe('src/ui/shell.ts');
    // Under root with embedded /src/: last wins.
    expect(
      normalizeRepoPath(
        '/workspace/vendor/src/old/src/games/hex/rules.ts',
        '/workspace'
      )
    ).toBe('src/games/hex/rules.ts');
    // Lone /src/ outside root stays unparseable (aggregate skips).
    expect(
      normalizeRepoPath('/other/project/src/core/foo.ts', '/workspace')
    ).toBe('/other/project/src/core/foo.ts');
  });

  it('aggregate skips synthetic outside-root /src/ keys (q-mp-1199)', () => {
    const rows = aggregateByDirectory(
      {
        '/home/src/backup/lib/foo.ts': {
          lines: { total: 10, covered: 1, pct: 10 },
          branches: { total: 0, covered: 0, pct: 100 },
          functions: { total: 0, covered: 0, pct: 100 },
          statements: { total: 10, covered: 1, pct: 10 },
        },
        '/home/src/backup/lib/workspace/src/games/hex/rules.ts': {
          lines: { total: 40, covered: 20, pct: 50 },
          branches: { total: 10, covered: 4, pct: 40 },
          functions: { total: 5, covered: 3, pct: 60 },
          statements: { total: 40, covered: 20, pct: 50 },
        },
        '/workspace/src/ui/shell.ts': {
          lines: { total: 20, covered: 19, pct: 95 },
          branches: { total: 8, covered: 7, pct: 87.5 },
          functions: { total: 4, covered: 4, pct: 100 },
          statements: { total: 20, covered: 19, pct: 95 },
        },
      },
      { root: '/workspace' }
    );
    expect(rows.map((r) => r.dir)).toEqual(['src/games/hex', 'src/ui']);
    expect(rows.map((r) => r.dir)).not.toContain('src/backup/lib');
  });

  it('aggregates json-summary entries by parent directory under src/', () => {
    const rows = aggregateByDirectory(
      {
        total: {
          lines: { total: 100, covered: 90, pct: 90 },
          branches: { total: 40, covered: 30, pct: 75 },
          functions: { total: 20, covered: 18, pct: 90 },
          statements: { total: 100, covered: 90, pct: 90 },
        },
        '/workspace/src/games/hex/rules.ts': {
          lines: { total: 40, covered: 20, pct: 50 },
          branches: { total: 10, covered: 4, pct: 40 },
          functions: { total: 5, covered: 3, pct: 60 },
          statements: { total: 40, covered: 20, pct: 50 },
        },
        '/workspace/src/games/hex/board.ts': {
          lines: { total: 10, covered: 10, pct: 100 },
          branches: { total: 2, covered: 2, pct: 100 },
          functions: { total: 2, covered: 2, pct: 100 },
          statements: { total: 10, covered: 10, pct: 100 },
        },
        '/workspace/src/ui/shell.ts': {
          lines: { total: 20, covered: 19, pct: 95 },
          branches: { total: 8, covered: 7, pct: 87.5 },
          functions: { total: 4, covered: 4, pct: 100 },
          statements: { total: 20, covered: 19, pct: 95 },
        },
        '/workspace/README.md': {
          lines: { total: 1, covered: 0, pct: 0 },
        },
      },
      { root: '/workspace' }
    );

    expect(rows.map((r) => r.dir)).toEqual(['src/games/hex', 'src/ui']);
    expect(rows[0]).toMatchObject({
      dir: 'src/games/hex',
      files: 2,
      lines: { covered: 30, total: 50, pct: 60 },
      branches: { covered: 6, total: 12, pct: 50 },
    });
    expect(rows[1].dir).toBe('src/ui');
    expect(rows[1].lines.pct).toBe(95);
  });

  it('readMetric prefers covered/total, honors pct-only, and treats absent as absent (q-mp-1017)', () => {
    expect(readMetric({ total: 8, covered: 1, pct: 12.5 })).toEqual({
      kind: 'counts',
      covered: 1,
      total: 8,
    });
    expect(readMetric({ pct: 12.5 })).toEqual({ kind: 'pct', pct: 12.5 });
    expect(readMetric({ covered: 1 })).toEqual({ kind: 'absent' });
    expect(readMetric({})).toEqual({ kind: 'absent' });
    expect(readMetric(undefined)).toEqual({ kind: 'absent' });
  });

  it('honors pct-only rows and never invents 100% from absent totals (q-mp-1017)', () => {
    const rows = aggregateByDirectory(
      {
        'src/games/calla/board.ts': {
          lines: { pct: 12.5 },
          branches: { pct: 5 },
          functions: { pct: 10 },
          statements: { pct: 12.5 },
        },
        'src/games/ramrod/board.ts': {
          lines: { total: 100, covered: 99, pct: 99 },
          branches: { total: 20, covered: 19, pct: 95 },
          functions: { total: 10, covered: 10, pct: 100 },
          statements: { total: 100, covered: 99, pct: 99 },
        },
      },
      { root: '/workspace' }
    );

    expect(rows.map((r) => r.dir)).toEqual([
      'src/games/calla',
      'src/games/ramrod',
    ]);
    expect(rows[0]).toMatchObject({
      dir: 'src/games/calla',
      files: 1,
      lines: { covered: null, total: null, pct: 12.5 },
      branches: { covered: null, total: null, pct: 5 },
    });
    expect(rows[1]).toMatchObject({
      dir: 'src/games/ramrod',
      files: 1,
      lines: { covered: 99, total: 100, pct: 99 },
    });
  });

  it('prefers line-weighted counts over equal-weight pct-only mix (q-mp-1229)', () => {
    const mixed = aggregateByDirectory(
      {
        'src/games/demo/full.ts': {
          lines: { total: 100, covered: 100, pct: 100 },
          branches: { total: 10, covered: 10, pct: 100 },
          functions: { total: 5, covered: 5, pct: 100 },
          statements: { total: 100, covered: 100, pct: 100 },
        },
        'src/games/demo/pct.ts': {
          lines: { pct: 0 },
          branches: { pct: 0 },
          functions: { pct: 0 },
          statements: { pct: 0 },
        },
      },
      { root: '/workspace' }
    );
    expect(mixed).toHaveLength(1);
    // Must not invent 50% / null totals by equal-weighting file pcts.
    expect(mixed[0]).toMatchObject({
      dir: 'src/games/demo',
      files: 2,
      lines: { covered: 100, total: 100, pct: 100 },
      branches: { covered: 10, total: 10, pct: 100 },
      functions: { covered: 5, total: 5, pct: 100 },
      statements: { covered: 100, total: 100, pct: 100 },
    });

    const pctOnly = aggregateByDirectory(
      {
        'src/games/a/x.ts': {
          lines: { pct: 20 },
          branches: { pct: 10 },
          functions: { pct: 30 },
          statements: { pct: 20 },
        },
        'src/games/a/y.ts': {
          lines: { pct: 40 },
          branches: { pct: 50 },
          functions: { pct: 10 },
          statements: { pct: 40 },
        },
      },
      { root: '/workspace' }
    );
    expect(pctOnly[0]?.lines).toEqual({
      covered: null,
      total: null,
      pct: 30,
    });
  });

  it('keeps explicit 0/0 counts as istanbul 100% (q-mp-1017)', () => {
    const rows = aggregateByDirectory(
      {
        'src/games/hex/empty.ts': {
          lines: { total: 0, covered: 0, pct: 100 },
          branches: { total: 0, covered: 0, pct: 100 },
          functions: { total: 0, covered: 0, pct: 100 },
          statements: { total: 0, covered: 0, pct: 100 },
        },
      },
      { root: '/workspace' }
    );
    expect(rows).toHaveLength(1);
    expect(rows[0]?.lines).toEqual({ total: 0, covered: 0, pct: 100 });
  });

  it('clamps covered > total so display pct stays ≤ 100 (q-mp-1039)', () => {
    const rows = aggregateByDirectory(
      {
        'src/games/calla/board.ts': {
          lines: { total: 100, covered: 120, pct: 120 },
          branches: { total: 10, covered: 10, pct: 100 },
          functions: { total: 5, covered: 5, pct: 100 },
          statements: { total: 100, covered: 120, pct: 120 },
        },
        'src/games/ramrod/board.ts': {
          lines: { total: 100, covered: 50, pct: 50 },
          branches: { total: 10, covered: 5, pct: 50 },
          functions: { total: 5, covered: 2, pct: 40 },
          statements: { total: 100, covered: 50, pct: 50 },
        },
      },
      { root: '/workspace' }
    );

    expect(rows.map((r) => r.dir)).toEqual([
      'src/games/ramrod',
      'src/games/calla',
    ]);
    expect(rows[1]).toMatchObject({
      dir: 'src/games/calla',
      files: 1,
      lines: { covered: 100, total: 100, pct: 100 },
      statements: { covered: 100, total: 100, pct: 100 },
    });
    const md = renderCoverageMapMarkdown(rows);
    expect(md).toContain('| `src/games/calla` | 100.00 |');
    expect(md).not.toMatch(/120\.00/);
  });

  it('clamps pct-only values to [0, 100] for display/rank (q-mp-1085)', () => {
    const rows = aggregateByDirectory(
      {
        'src/games/hex/rules.ts': {
          lines: { pct: 150 },
          branches: { pct: -10 },
          functions: { pct: 150 },
          statements: { pct: 150 },
        },
        'src/games/ramrod/board.ts': {
          lines: { total: 100, covered: 50, pct: 50 },
          branches: { total: 10, covered: 5, pct: 50 },
          functions: { total: 5, covered: 2, pct: 40 },
          statements: { total: 100, covered: 50, pct: 50 },
        },
      },
      { root: '/workspace' }
    );

    expect(rows.map((r) => r.dir)).toEqual([
      'src/games/ramrod',
      'src/games/hex',
    ]);
    expect(rows[1]).toMatchObject({
      dir: 'src/games/hex',
      files: 1,
      lines: { covered: null, total: null, pct: 100 },
      branches: { covered: null, total: null, pct: 0 },
    });
    const md = renderCoverageMapMarkdown(rows);
    expect(md).toContain('| `src/games/hex` | 100.00 | 0.00 | 1 |');
    expect(md).not.toMatch(/150\.00/);
    expect(md).not.toMatch(/-10\.00/);
    // Counts path unchanged (q-mp-1039 already clamps covered>total).
    expect(rows[0]).toMatchObject({
      dir: 'src/games/ramrod',
      lines: { covered: 50, total: 100, pct: 50 },
    });
  });

  it('maps coverage percentages to heat colors', () => {
    expect(heatColor(96)).toBe('#1b7f4a');
    expect(heatColor(91)).toBe('#3d9b5c');
    expect(heatColor(85)).toBe('#7bb05a');
    expect(heatColor(75)).toBe('#c4a035');
    expect(heatColor(60)).toBe('#c4732a');
    expect(heatColor(40)).toBe('#b33a2b');
    expect(heatTextColor(80)).toBe('#1a1a1a');
    expect(heatTextColor(40)).toBe('#f7f5f0');
  });

  it('renders an SVG heat table with directory rows and empty-state', () => {
    const svg = renderCoverageHeatSvg(
      [
        {
          dir: 'src/games/hex',
          files: 2,
          lines: { total: 50, covered: 30, pct: 60 },
          branches: { total: 12, covered: 6, pct: 50 },
          functions: { total: 7, covered: 5, pct: 71.428571 },
          statements: { total: 50, covered: 30, pct: 60 },
        },
        {
          dir: 'src/ui',
          files: 1,
          lines: { total: 20, covered: 19, pct: 95 },
          branches: { total: 8, covered: 7, pct: 87.5 },
          functions: { total: 4, covered: 4, pct: 100 },
          statements: { total: 20, covered: 19, pct: 95 },
        },
      ],
      { generatedAt: '2026-10-09T00:00:00.000Z' }
    );
    expect(svg).toContain('<svg');
    expect(svg).toContain('src/games/hex');
    expect(svg).toContain('src/ui');
    expect(svg).toContain('60.0%');
    expect(svg).toContain('95.0%');
    expect(svg).toContain(heatColor(60));
    expect(svg).toContain(heatColor(95));
    expect(svg).toContain('Unit coverage by directory');

    const empty = renderCoverageHeatSvg([]);
    expect(empty).toContain('No src/ coverage entries found');
  });

  it('renders markdown that embeds the SVG and regen commands', () => {
    const md = renderCoverageMapMarkdown(
      [
        {
          dir: 'src/games/hex',
          files: 2,
          lines: { total: 50, covered: 30, pct: 60 },
          branches: { total: 12, covered: 6, pct: 50 },
          functions: { total: 7, covered: 5, pct: 71.4 },
          statements: { total: 50, covered: 30, pct: 60 },
        },
      ],
      {
        generatedAt: '2026-10-09T00:00:00.000Z',
        summaryPath: DEFAULT_SUMMARY,
      }
    );
    expect(md).toContain('# Unit coverage map (by directory)');
    expect(md).toContain('q-mp-075');
    expect(md).toContain('./coverage-map.svg');
    expect(md).toContain('../wiki/coverage-map.md');
    expect(md).toContain('npm run test:unit:coverage');
    expect(md).toContain('npm run report:coverage-map');
    expect(md).toContain('`src/games/hex`');
  });

  it('formats a friendly missing-summary hint (q-mp-847)', () => {
    const msg = missingSummaryMessage(DEFAULT_SUMMARY);
    expect(msg).toContain(DEFAULT_SUMMARY);
    expect(msg).toContain('npm run test:unit:coverage');
    expect(msg).toContain('npm run report:coverage-map');
    expect(msg).toMatch(/explicit path/i);
    expect(msg).not.toMatch(/ENOENT|readFileSync/);
  });

  it('writeReport throws ENOENT with friendly message when summary is missing', () => {
    const missing = 'coverage/__no-such-summary-q-mp-847__.json';
    try {
      writeReport({ summaryPath: missing });
      expect.fail('expected writeReport to throw');
    } catch (err) {
      expect(err).toMatchObject({ code: 'ENOENT' });
      expect(err).toBeInstanceOf(Error);
      const message = (err as Error).message;
      expect(message).toContain('missing coverage summary');
      expect(message).toContain(missing);
      expect(message).toContain('npm run test:unit:coverage');
      expect(message).not.toMatch(/at Object\.readFileSync/);
    }
  });
});
