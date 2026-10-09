import { describe, it, expect } from 'vitest';
import {
  extractMetric,
  extractLintMetrics,
  parseGitLogLines,
  mergeHistory,
  escapeXml,
  renderSvg,
  renderMarkdown,
  collectHistory,
  TRACKED,
  LINT_RULE_KEYS,
} from '../../scripts/report-ratchet-history.mjs';

describe('report-ratchet-history helpers (q-mp-074 / q-mp-236 / q-mp-290)', () => {
  it('extracts curly / void / nnnull / dup / type / boundary metrics', () => {
    const lint = {
      rules: {
        curly: 538,
        [LINT_RULE_KEYS.voidExpression]: 118,
        [LINT_RULE_KEYS.nnnull]: 254,
        [LINT_RULE_KEYS.dupImports]: 99,
      },
      notes: 'x',
    };
    expect(extractLintMetrics(lint)).toEqual({
      curly: 538,
      voidExpression: 118,
      nnnull: 254,
      dupImports: 99,
    });
    expect(extractMetric('curly', lint)).toBe(538);
    expect(extractMetric('voidExpression', lint)).toBe(118);
    expect(extractMetric('nnnull', lint)).toBe(254);
    expect(extractMetric('dupImports', lint)).toBe(99);
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
      lint: [
        {
          sha: 'aaaa',
          date: '2026-10-07T10:00:00Z',
          subject: 'lint seed',
          curly: 1456,
          voidExpression: 183,
          nnnull: 268,
          dupImports: 122,
        },
        {
          sha: 'cccc',
          date: '2026-10-08T10:00:00Z',
          subject: 'lint lower',
          curly: 538,
          voidExpression: 118,
          nnnull: 254,
          dupImports: 99,
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
      voidExpression: 183,
      nnnull: 268,
      dupImports: 122,
      typeOutOfScope: null,
      boundarySum: 17,
    });
    // forward-fill lint + type into middle row
    expect(rows[1]).toMatchObject({
      curly: 1456,
      voidExpression: 183,
      nnnull: 268,
      dupImports: 122,
      typeOutOfScope: 300,
      boundarySum: 17,
    });
    expect(rows[2]).toMatchObject({
      curly: 538,
      voidExpression: 118,
      nnnull: 254,
      dupImports: 99,
      typeOutOfScope: 216,
      boundarySum: 17,
    });
  });

  it('escapes XML special characters', () => {
    expect(escapeXml(`&<>"'`)).toBe('&amp;&lt;&gt;&quot;&apos;');
  });

  it('renders an SVG polyline chart with lint series and empty-state', () => {
    const svg = renderSvg([
      {
        sha: 'aaaaaaaa',
        date: '2026-10-07T00:00:00Z',
        subject: 'start',
        curly: 1400,
        voidExpression: 183,
        nnnull: 268,
        dupImports: 122,
        typeOutOfScope: 400,
        boundarySum: 17,
      },
      {
        sha: 'bbbbbbbb',
        date: '2026-10-08T00:00:00Z',
        subject: 'lower',
        curly: 538,
        voidExpression: 118,
        nnnull: 254,
        dupImports: 99,
        typeOutOfScope: 216,
        boundarySum: 17,
      },
    ]);
    expect(svg).toContain('<svg');
    expect(svg).toContain('polyline');
    expect(svg).toContain('curly');
    expect(svg).toContain('void');
    expect(svg).toContain('nnnull');
    expect(svg).toContain('dup-imports');
    expect(svg).toContain('type Phase-2 oos');
    expect(svg).toContain('boundary Σ');
    expect(svg).toContain('aaaaaaaa'.slice(0, 7));

    const empty = renderSvg([]);
    expect(empty).toContain('No history found');
  });

  it('renders a markdown table with live tip snapshot and lint columns', () => {
    const md = renderMarkdown(
      [
        {
          sha: 'deadbeef',
          date: '2026-10-08T12:00:00Z',
          subject: 'Tip fold wave5',
          curly: 538,
          voidExpression: 118,
          nnnull: 254,
          dupImports: 99,
          typeOutOfScope: 216,
          boundarySum: 17,
        },
      ],
      {
        generatedAt: '2026-10-09T00:00:00.000Z',
        gitMode: 'git log --all',
        tipSha: '23926935deadbeef',
        liveLint: {
          curly: 538,
          voidExpression: 118,
          nnnull: 254,
          dupImports: 99,
          nullish: 65,
        },
      }
    );
    expect(md).toContain('# Ratchet ceiling history');
    expect(md).toContain('q-mp-236');
    expect(md).toContain('q-mp-290');
    expect(md).toContain(TRACKED.lintCeilings);
    expect(md).toContain('Live tip snapshot (`2392693`)');
    expect(md).toContain('| curly | 538 |');
    expect(md).toContain(
      '| prefer-nullish-coalescing (HOLD; not charted) | 65 |'
    );
    expect(md).toContain(
      '| `deadbee` | 2026-10-08 | 538 | 118 | 254 | 99 | 216 | 17 |'
    );
    expect(md).toContain('./ratchet-ceiling-history.svg');
  });

  it('collectHistory uses injected git runner (no network)', () => {
    const files: Record<string, string> = {
      [TRACKED.lintCeilings]: JSON.stringify({
        rules: {
          curly: 538,
          [LINT_RULE_KEYS.voidExpression]: 118,
          [LINT_RULE_KEYS.nnnull]: 254,
          [LINT_RULE_KEYS.dupImports]: 99,
        },
      }),
      [TRACKED.typePhase2]: JSON.stringify({ outOfScopeErrors: 216 }),
      [TRACKED.boundaries]: JSON.stringify({
        ceilings: { dead_barrels: 8, mixed_ui_barrels: 9 },
      }),
    };

    const runGit = (args: string[]) => {
      if (args[0] === 'log') {
        const file = args[args.length - 1];
        const sha =
          file === TRACKED.lintCeilings
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
    expect(latest.curly).toBe(538);
    expect(latest.voidExpression).toBe(118);
    expect(latest.nnnull).toBe(254);
    expect(latest.dupImports).toBe(99);
    expect(latest.typeOutOfScope).toBe(216);
    expect(latest.boundarySum).toBe(17);
  });
});
