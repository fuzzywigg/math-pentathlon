import { describe, it, expect } from 'vitest';
import {
  escapeXml,
  normalizeRepoPath,
  aggregateByDirectory,
  heatColor,
  heatTextColor,
  renderCoverageHeatSvg,
  renderCoverageMapMarkdown,
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
    expect(
      normalizeRepoPath('/other/project/src/core/foo.ts', '/workspace')
    ).toBe('src/core/foo.ts');
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
    expect(md).toContain('npm run test:unit:coverage');
    expect(md).toContain('npm run report:coverage-map');
    expect(md).toContain('`src/games/hex`');
  });
});
