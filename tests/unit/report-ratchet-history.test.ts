/**
 * @vitest-environment node
 *
 * Pure-helper coverage for scripts/report-ratchet-history.mjs (q-mp-074).
 * Git is injected — no network / no live repo dependency.
 */
import { describe, it, expect } from 'vitest';
import {
  extractMetrics,
  renderSvgChart,
  renderMarkdownTable,
  escapeXml,
  collectHistory,
  generateReport,
  TRACKED,
} from '../../scripts/report-ratchet-history.mjs';

describe('report-ratchet-history helpers', () => {
  it('extractMetrics reads curly / Phase-2 / boundary-sum fields', () => {
    expect(
      extractMetrics(
        TRACKED.curly.path,
        JSON.stringify({ rules: { curly: 1320 } })
      )
    ).toEqual({ curly: 1320, typePhase2: null, boundaries: null });

    expect(
      extractMetrics(
        TRACKED.typePhase2.path,
        JSON.stringify({ outOfScopeErrors: 216 })
      )
    ).toEqual({ curly: null, typePhase2: 216, boundaries: null });

    expect(
      extractMetrics(
        TRACKED.boundaries.path,
        JSON.stringify({
          ceilings: { cycles: 0, dead_barrels: 8, mixed_ui_barrels: 9 },
        })
      )
    ).toEqual({ curly: null, typePhase2: null, boundaries: 17 });
  });

  it('extractMetrics tolerates invalid JSON and missing fields', () => {
    expect(extractMetrics(TRACKED.curly.path, 'not-json{')).toEqual({
      curly: null,
      typePhase2: null,
      boundaries: null,
    });
    expect(
      extractMetrics(TRACKED.typePhase2.path, JSON.stringify({ tipSha: 'x' }))
    ).toEqual({ curly: null, typePhase2: null, boundaries: null });
  });

  it('escapeXml escapes markup-sensitive characters', () => {
    expect(escapeXml(`a<b>&"c`)).toBe('a&lt;b&gt;&amp;&quot;c');
  });

  it('collectHistory merges per-file commits, forward-fills, skips no-op refreshes', () => {
    const blobs: Record<string, string> = {
      'aaaa1111:docs/dev/lint-ratchet-ceilings.json': JSON.stringify({
        rules: { curly: 1456 },
      }),
      'bbbb2222:docs/dev/lint-ratchet-ceilings.json': JSON.stringify({
        rules: { curly: 1320 },
      }),
      'bbbb2222:docs/dev/type-ratchet-phase2-baseline.json': JSON.stringify({
        outOfScopeErrors: 520,
      }),
      'cccc3333:docs/dev/type-ratchet-phase2-baseline.json': JSON.stringify({
        outOfScopeErrors: 216,
      }),
      'dddd4444:docs/dev/module-boundaries-ceilings.json': JSON.stringify({
        ceilings: { dead_barrels: 8, mixed_ui_barrels: 9 },
      }),
      // tipSha-only refresh — same curly as previous
      'eeee5555:docs/dev/lint-ratchet-ceilings.json': JSON.stringify({
        rules: { curly: 1320 },
        notes: 'refresh only',
      }),
    };

    const logByPath: Record<string, string> = {
      [TRACKED.curly.path]: [
        'eeee5555\teeee555\t2026-10-08T18:00:00Z\trefresh curly tipSha',
        'bbbb2222\tbbbb222\t2026-10-08T12:00:00Z\tlower curly',
        'aaaa1111\taaaa111\t2026-10-08T08:00:00Z\tintroduce curly',
      ].join('\n'),
      [TRACKED.typePhase2.path]: [
        'cccc3333\tcccc333\t2026-10-08T14:00:00Z\tlower phase2',
        'bbbb2222\tbbbb222\t2026-10-08T12:00:00Z\tintroduce phase2',
      ].join('\n'),
      [TRACKED.boundaries.path]:
        'dddd4444\tdddd444\t2026-10-08T10:00:00Z\tintroduce boundaries',
    };

    const git = (args: string[]) => {
      if (args[0] === 'log') {
        const file = args[args.length - 1];
        return { status: 0, stdout: logByPath[file] ?? '', stderr: '' };
      }
      if (args[0] === 'show') {
        const key = args[1];
        const raw = blobs[key];
        if (raw == null) return { status: 128, stdout: '', stderr: 'missing' };
        return { status: 0, stdout: raw, stderr: '' };
      }
      return { status: 1, stdout: '', stderr: `unexpected ${args.join(' ')}` };
    };

    const rows = collectHistory({ git });
    expect(rows.map((r) => r.short)).toEqual([
      'aaaa111',
      'dddd444',
      'bbbb222',
      'cccc333',
    ]);
    expect(rows[0]).toMatchObject({ curly: 1456, typePhase2: null, boundaries: null });
    expect(rows[1]).toMatchObject({ curly: 1456, boundaries: 17 });
    expect(rows[2]).toMatchObject({ curly: 1320, typePhase2: 520, boundaries: 17 });
    expect(rows[3]).toMatchObject({ curly: 1320, typePhase2: 216, boundaries: 17 });
    // eeee tipSha refresh omitted
    expect(rows.some((r) => r.short === 'eeee555')).toBe(false);
  });

  it('renderSvgChart emits a multi-series SVG with legend and polylines', () => {
    const svg = renderSvgChart([
      {
        sha: 'a'.repeat(40),
        short: 'aaaa111',
        date: '2026-10-08T08:00:00Z',
        subject: 'start',
        curly: 1400,
        typePhase2: 500,
        boundaries: 17,
      },
      {
        sha: 'b'.repeat(40),
        short: 'bbbb222',
        date: '2026-10-08T18:00:00Z',
        subject: 'lower',
        curly: 1320,
        typePhase2: 216,
        boundaries: 17,
      },
    ]);
    expect(svg).toContain('<svg');
    expect(svg).toContain('polyline');
    expect(svg).toContain('curly');
    expect(svg).toContain('type Phase-2');
    expect(svg).toContain('boundaries sum');
    expect(svg).toContain('#0b6e4f');
  });

  it('renderMarkdownTable includes chart link and numeric rows', () => {
    const md = renderMarkdownTable(
      [
        {
          sha: 'a'.repeat(40),
          short: 'aaaa111',
          date: '2026-10-08T08:00:00Z',
          subject: 'start | pipe',
          curly: 1400,
          typePhase2: 500,
          boundaries: 17,
        },
      ],
      { generatedAt: '2026-10-09T00:00:00.000Z' }
    );
    expect(md).toContain('./ratchet-history.svg');
    expect(md).toContain('| `aaaa111` | 1400 | 500 | 17 |');
    expect(md).toContain('start \\| pipe');
    expect(md).toContain('2026-10-09T00:00:00.000Z');
  });

  it('generateReport writes SVG + markdown via injected writer', () => {
    const written = new Map<string, string>();
    const git = (args: string[]) => {
      if (args[0] === 'log') {
        const file = args[args.length - 1];
        if (file === TRACKED.curly.path) {
          return {
            status: 0,
            stdout:
              'aaaa1111\taaaa111\t2026-10-08T08:00:00Z\tintroduce curly',
            stderr: '',
          };
        }
        return { status: 0, stdout: '', stderr: '' };
      }
      if (args[0] === 'show' && args[1]?.endsWith(TRACKED.curly.path)) {
        return {
          status: 0,
          stdout: JSON.stringify({ rules: { curly: 100 } }),
          stderr: '',
        };
      }
      return { status: 128, stdout: '', stderr: 'missing' };
    };

    const result = generateReport({
      git,
      generatedAt: '2026-10-09T01:02:03.000Z',
      writeFile: (p, data) => {
        written.set(p, data);
      },
    });

    expect(result.rows).toHaveLength(1);
    expect(result.rows[0]?.curly).toBe(100);
    expect(written.size).toBe(2);
    const svg = [...written.values()].find((v) => v.includes('<svg'));
    const md = [...written.values()].find((v) => v.includes('# Ratchet'));
    expect(svg).toBeTruthy();
    expect(md).toContain('2026-10-09T01:02:03.000Z');
  });
});
