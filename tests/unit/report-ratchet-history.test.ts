import { describe, it, expect } from 'vitest';
import {
  extractMetric,
  parseGitLogLines,
  mergeHistory,
  escapeXml,
  renderSvg,
  renderMarkdown,
  collectHistory,
  TRACKED,
} from '../../scripts/report-ratchet-history.mjs';

describe('report-ratchet-history helpers (q-mp-074)', () => {
  it('extracts curly / type / boundary metrics from known JSON shapes', () => {
    expect(
      extractMetric('curly', { rules: { curly: 1320 }, notes: 'x' })
    ).toBe(1320);
    expect(extractMetric('curly', { rules: {} })).toBeNull();
    expect(extractMetric('typePhase2', { outOfScopeErrors: 216 })).toBe(216);
    expect(
      extractMetric('boundaries', {
        ceilings: { cycles: 0, dead_barrels: 8, mixed_ui_barrels: 9 },
      })
    ).toBe(17);
    expect(extractMetric('boundaries', { ceilings: {} })).toBeNull();
    expect(extractMetric('typePhase2', null)).toBeNull();
  });

  it('parses git log tab-separated lines', () => {
    const stdout = [
      'abc123\t2026-10-08T12:00:00Z\tchore: lower curly',
      'def456\t2026-10-07T09:00:00Z\tfeat: add ceilings',
      '',
      'bad-line-without-tabs',
    ].join('\n');
    expect(parseGitLogLines(stdout)).toEqual([
      {
        sha: 'abc123',
        date: '2026-10-08T12:00:00Z',
        subject: 'chore: lower curly',
      },
      {
        sha: 'def456',
        date: '2026-10-07T09:00:00Z',
        subject: 'feat: add ceilings',
      },
    ]);
  });

  it('merges per-file histories, sorts, and forward-fills metrics', () => {
    const rows = mergeHistory({
      curly: [
        {
          sha: 'aaaa',
          date: '2026-10-07T10:00:00Z',
          subject: 'curly 1456',
          value: 1456,
        },
        {
          sha: 'cccc',
          date: '2026-10-08T10:00:00Z',
          subject: 'curly 1320',
          value: 1320,
        },
      ],
      typePhase2: [
        {
          sha: 'bbbb',
          date: '2026-10-07T18:00:00Z',
          subject: 'type 300',
          value: 300,
        },
        {
          sha: 'cccc',
          date: '2026-10-08T10:00:00Z',
          subject: 'type 216',
          value: 216,
        },
      ],
      boundaries: [
        {
          sha: 'aaaa',
          date: '2026-10-07T10:00:00Z',
          subject: 'bound 17',
          value: 17,
        },
      ],
    });

    expect(rows.map((r) => r.sha)).toEqual(['aaaa', 'bbbb', 'cccc']);
    expect(rows[0]).toMatchObject({
      curly: 1456,
      typeOutOfScope: null,
      boundarySum: 17,
    });
    // forward-fill type into later rows; curly into middle row
    expect(rows[1]).toMatchObject({
      curly: 1456,
      typeOutOfScope: 300,
      boundarySum: 17,
    });
    expect(rows[2]).toMatchObject({
      curly: 1320,
      typeOutOfScope: 216,
      boundarySum: 17,
    });
  });

  it('escapes XML special characters', () => {
    expect(escapeXml(`&<>"'`)).toBe('&amp;&lt;&gt;&quot;&apos;');
  });

  it('renders an SVG polyline chart with legend and empty-state', () => {
    const svg = renderSvg([
      {
        sha: 'aaaaaaaa',
        date: '2026-10-07T00:00:00Z',
        subject: 'start',
        curly: 1400,
        typeOutOfScope: 400,
        boundarySum: 17,
      },
      {
        sha: 'bbbbbbbb',
        date: '2026-10-08T00:00:00Z',
        subject: 'lower',
        curly: 1320,
        typeOutOfScope: 216,
        boundarySum: 17,
      },
    ]);
    expect(svg).toContain('<svg');
    expect(svg).toContain('polyline');
    expect(svg).toContain('curly ceiling');
    expect(svg).toContain('type Phase-2 out-of-scope');
    expect(svg).toContain('boundary ceiling sum');
    expect(svg).toContain('aaaaaaaa'.slice(0, 7));

    const empty = renderSvg([]);
    expect(empty).toContain('No history found');
  });

  it('renders a markdown table with tracked file paths', () => {
    const md = renderMarkdown(
      [
        {
          sha: 'deadbeef',
          date: '2026-10-08T12:00:00Z',
          subject: 'Tip fold wave5',
          curly: 1320,
          typeOutOfScope: 216,
          boundarySum: 17,
        },
      ],
      { generatedAt: '2026-10-09T00:00:00.000Z', gitMode: 'git log --all' }
    );
    expect(md).toContain('# Ratchet ceiling history');
    expect(md).toContain('q-mp-074');
    expect(md).toContain(TRACKED.curly);
    expect(md).toContain('| `deadbee` | 2026-10-08 | 1320 | 216 | 17 |');
    expect(md).toContain('./ratchet-ceiling-history.svg');
  });

  it('collectHistory uses injected git runner (no network)', () => {
    const files: Record<string, string> = {
      [TRACKED.curly]: JSON.stringify({ rules: { curly: 1320 } }),
      [TRACKED.typePhase2]: JSON.stringify({ outOfScopeErrors: 216 }),
      [TRACKED.boundaries]: JSON.stringify({
        ceilings: { dead_barrels: 8, mixed_ui_barrels: 9 },
      }),
    };

    const runGit = (args: string[]) => {
      if (args[0] === 'log') {
        const file = args[args.length - 1];
        const sha =
          file === TRACKED.curly
            ? 'c1'
            : file === TRACKED.typePhase2
              ? 't1'
              : 'b1';
        return {
          status: 0,
          stdout: `${sha}\t2026-10-08T12:00:00Z\tseed ${file}\n`,
          stderr: '',
        };
      }
      if (args[0] === 'show') {
        const [shaPath] = args.slice(1);
        const file = shaPath.split(':').slice(1).join(':');
        return { status: 0, stdout: files[file] ?? '{}', stderr: '' };
      }
      return { status: 1, stdout: '', stderr: `unexpected ${args.join(' ')}` };
    };

    const rows = collectHistory(runGit, { firstParent: false });
    expect(rows.length).toBe(3);
    const latest = rows[rows.length - 1];
    expect(latest.curly).toBe(1320);
    expect(latest.typeOutOfScope).toBe(216);
    expect(latest.boundarySum).toBe(17);
  });
});
