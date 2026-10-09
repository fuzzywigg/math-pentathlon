#!/usr/bin/env node
/**
 * Ratchet ceiling history report (q-mp-074).
 *
 * Reads git history for:
 *   - docs/dev/lint-ratchet-ceilings.json        → curly ceiling
 *   - docs/dev/type-ratchet-phase2-baseline.json → Phase-2 outOfScopeErrors
 *   - docs/dev/module-boundaries-ceilings.json   → sum of boundary ceilings
 *
 * Writes an SVG line chart + markdown table under docs/dev/.
 *
 * Usage: node scripts/report-ratchet-history.mjs
 *
 * No new dependencies. Git is the only external command.
 */

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(__dirname, '..');

export const TRACKED = {
  curly: {
    path: 'docs/dev/lint-ratchet-ceilings.json',
    label: 'curly ceiling',
    key: 'curly',
  },
  typePhase2: {
    path: 'docs/dev/type-ratchet-phase2-baseline.json',
    label: 'type Phase-2 baseline',
    key: 'typePhase2',
  },
  boundaries: {
    path: 'docs/dev/module-boundaries-ceilings.json',
    label: 'boundary ceilings (sum)',
    key: 'boundaries',
  },
};

export const OUT_SVG = 'docs/dev/ratchet-history.svg';
export const OUT_MD = 'docs/dev/ratchet-history.md';

/**
 * @param {string[]} args
 * @param {{ cwd?: string, git?: (args: string[], cwd: string) => { status: number, stdout: string, stderr: string } }} [opts]
 */
export function runGit(args, opts = {}) {
  const cwd = opts.cwd ?? ROOT;
  if (opts.git) return opts.git(args, cwd);
  const r = spawnSync('git', args, {
    cwd,
    encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024,
  });
  return {
    status: r.status ?? 1,
    stdout: r.stdout ?? '',
    stderr: r.stderr ?? '',
  };
}

/**
 * Extract the three tracked metrics from a ceiling/baseline JSON blob.
 * Returns nulls for missing / unparseable fields (caller may skip).
 * @param {string} filePath repo-relative path
 * @param {string} raw JSON text
 * @returns {{ curly: number | null, typePhase2: number | null, boundaries: number | null }}
 */
export function extractMetrics(filePath, raw) {
  /** @type {{ curly: number | null, typePhase2: number | null, boundaries: number | null }} */
  const out = { curly: null, typePhase2: null, boundaries: null };
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    return out;
  }

  if (filePath === TRACKED.curly.path) {
    const n = data?.rules?.curly;
    out.curly = typeof n === 'number' && Number.isFinite(n) ? n : null;
    return out;
  }

  if (filePath === TRACKED.typePhase2.path) {
    const n = data?.outOfScopeErrors;
    out.typePhase2 = typeof n === 'number' && Number.isFinite(n) ? n : null;
    return out;
  }

  if (filePath === TRACKED.boundaries.path) {
    const ceilings = data?.ceilings;
    if (!ceilings || typeof ceilings !== 'object') return out;
    let sum = 0;
    let saw = false;
    for (const v of Object.values(ceilings)) {
      if (typeof v === 'number' && Number.isFinite(v)) {
        sum += v;
        saw = true;
      }
    }
    out.boundaries = saw ? sum : null;
    return out;
  }

  return out;
}

/**
 * @typedef {{ sha: string, short: string, date: string, subject: string, curly: number | null, typePhase2: number | null, boundaries: number | null }} HistoryRow
 */

/**
 * List commits that touched a path (newest first). Uses --all so squash-orphaned
 * tip history still surfaces when those commits remain reachable via other refs.
 * @param {string} filePath
 * @param {{ cwd?: string, git?: Function }} [opts]
 * @returns {Array<{ sha: string, short: string, date: string, subject: string }>}
 */
export function listCommitsForPath(filePath, opts = {}) {
  const r = runGit(
    [
      'log',
      '--all',
      '--follow',
      '--date=iso-strict',
      '--pretty=format:%H\t%h\t%cI\t%s',
      '--',
      filePath,
    ],
    opts
  );
  if (r.status !== 0 || !r.stdout.trim()) return [];
  return r.stdout
    .trim()
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const [sha, short, date, ...rest] = line.split('\t');
      return { sha, short, date, subject: rest.join('\t') };
    });
}

/**
 * @param {string} sha
 * @param {string} filePath
 * @param {{ cwd?: string, git?: Function }} [opts]
 * @returns {string | null}
 */
export function gitShowFile(sha, filePath, opts = {}) {
  const r = runGit(['show', `${sha}:${filePath}`], opts);
  if (r.status !== 0) return null;
  return r.stdout;
}

/**
 * Build chronological history (oldest → newest) with forward-filled metrics.
 * A commit that only touches one file fills that metric; others carry forward.
 * @param {{ cwd?: string, git?: Function }} [opts]
 * @returns {HistoryRow[]}
 */
export function collectHistory(opts = {}) {
  /** @type {Map<string, HistoryRow>} */
  const bySha = new Map();

  for (const track of Object.values(TRACKED)) {
    const commits = listCommitsForPath(track.path, opts);
    for (const c of commits) {
      const raw = gitShowFile(c.sha, track.path, opts);
      if (raw == null) continue;
      const metrics = extractMetrics(track.path, raw);
      const value = metrics[/** @type {'curly'|'typePhase2'|'boundaries'} */ (track.key)];
      if (value == null) continue;

      let row = bySha.get(c.sha);
      if (!row) {
        row = {
          sha: c.sha,
          short: c.short,
          date: c.date,
          subject: c.subject,
          curly: null,
          typePhase2: null,
          boundaries: null,
        };
        bySha.set(c.sha, row);
      }
      row[/** @type {'curly'|'typePhase2'|'boundaries'} */ (track.key)] = value;
    }
  }

  const rows = [...bySha.values()].sort((a, b) => {
    if (a.date < b.date) return -1;
    if (a.date > b.date) return 1;
    return a.sha.localeCompare(b.sha);
  });

  /** @type {HistoryRow[]} */
  const filled = [];
  /** @type {{ curly: number | null, typePhase2: number | null, boundaries: number | null }} */
  let last = { curly: null, typePhase2: null, boundaries: null };
  for (const row of rows) {
    const next = {
      ...row,
      curly: row.curly ?? last.curly,
      typePhase2: row.typePhase2 ?? last.typePhase2,
      boundaries: row.boundaries ?? last.boundaries,
    };
    // Skip pure tipSha-refresh noise: no metric changed vs previous filled row.
    if (
      filled.length > 0 &&
      next.curly === last.curly &&
      next.typePhase2 === last.typePhase2 &&
      next.boundaries === last.boundaries
    ) {
      continue;
    }
    filled.push(next);
    last = {
      curly: next.curly,
      typePhase2: next.typePhase2,
      boundaries: next.boundaries,
    };
  }
  return filled;
}

/**
 * @param {number} n
 * @param {number} digits
 */
export function round(n, digits = 2) {
  const p = 10 ** digits;
  return Math.round(n * p) / p;
}

/**
 * Build a simple multi-series SVG line chart (no deps).
 * @param {HistoryRow[]} rows
 * @param {{ width?: number, height?: number, title?: string }} [opts]
 * @returns {string}
 */
export function renderSvgChart(rows, opts = {}) {
  const width = opts.width ?? 920;
  const height = opts.height ?? 420;
  const title = opts.title ?? 'Ratchet ceiling history';
  const pad = { top: 48, right: 24, bottom: 72, left: 56 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;

  const series = [
    { key: 'curly', label: 'curly', color: '#0b6e4f' },
    { key: 'typePhase2', label: 'type Phase-2', color: '#1d4e89' },
    { key: 'boundaries', label: 'boundaries sum', color: '#a33b20' },
  ];

  const values = [];
  for (const row of rows) {
    for (const s of series) {
      const v = row[/** @type {'curly'|'typePhase2'|'boundaries'} */ (s.key)];
      if (typeof v === 'number') values.push(v);
    }
  }
  const maxV = values.length ? Math.max(...values, 1) : 1;
  const minV = 0;
  const n = Math.max(rows.length, 1);

  const xAt = (i) =>
    pad.left + (n === 1 ? innerW / 2 : (i / (n - 1)) * innerW);
  const yAt = (v) =>
    pad.top + innerH - ((v - minV) / (maxV - minV || 1)) * innerH;

  const paths = series.map((s) => {
    const pts = [];
    rows.forEach((row, i) => {
      const v = row[/** @type {'curly'|'typePhase2'|'boundaries'} */ (s.key)];
      if (typeof v !== 'number') return;
      pts.push(`${round(xAt(i))},${round(yAt(v))}`);
    });
    if (pts.length === 0) return '';
    return `<polyline fill="none" stroke="${s.color}" stroke-width="2.5" points="${pts.join(' ')}" />`;
  });

  const dots = series.flatMap((s) =>
    rows.map((row, i) => {
      const v = row[/** @type {'curly'|'typePhase2'|'boundaries'} */ (s.key)];
      if (typeof v !== 'number') return '';
      return `<circle cx="${round(xAt(i))}" cy="${round(yAt(v))}" r="3.5" fill="${s.color}"><title>${escapeXml(row.short)} ${s.label}=${v}</title></circle>`;
    })
  );

  const yTicks = 5;
  const grid = [];
  for (let t = 0; t <= yTicks; t++) {
    const v = minV + ((maxV - minV) * t) / yTicks;
    const y = yAt(v);
    grid.push(
      `<line x1="${pad.left}" y1="${round(y)}" x2="${width - pad.right}" y2="${round(y)}" stroke="#d0d7de" stroke-width="1" />`,
      `<text x="${pad.left - 8}" y="${round(y + 4)}" text-anchor="end" font-size="11" fill="#57606a" font-family="ui-sans-serif, system-ui, sans-serif">${Math.round(v)}</text>`
    );
  }

  const xLabels = rows.map((row, i) => {
    const x = xAt(i);
    const label = row.date.slice(0, 10);
    return `<text x="${round(x)}" y="${height - 36}" text-anchor="middle" font-size="10" fill="#57606a" font-family="ui-sans-serif, system-ui, sans-serif" transform="rotate(-35 ${round(x)} ${height - 36})">${escapeXml(label)}</text>`;
  });

  const legend = series.map((s, i) => {
    const x = pad.left + i * 180;
    const y = 22;
    return `<rect x="${x}" y="${y - 8}" width="12" height="12" fill="${s.color}" rx="2" /><text x="${x + 18}" y="${y + 2}" font-size="12" fill="#24292f" font-family="ui-sans-serif, system-ui, sans-serif">${escapeXml(s.label)}</text>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeXml(title)}">
  <rect width="100%" height="100%" fill="#ffffff"/>
  <text x="${pad.left}" y="18" font-size="16" font-weight="600" fill="#24292f" font-family="ui-sans-serif, system-ui, sans-serif">${escapeXml(title)}</text>
  ${legend.join('\n  ')}
  ${grid.join('\n  ')}
  <line x1="${pad.left}" y1="${pad.top}" x2="${pad.left}" y2="${pad.top + innerH}" stroke="#24292f" stroke-width="1.25"/>
  <line x1="${pad.left}" y1="${pad.top + innerH}" x2="${width - pad.right}" y2="${pad.top + innerH}" stroke="#24292f" stroke-width="1.25"/>
  ${paths.filter(Boolean).join('\n  ')}
  ${dots.filter(Boolean).join('\n  ')}
  ${xLabels.join('\n  ')}
</svg>
`;
}

/**
 * @param {string} s
 */
export function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * @param {HistoryRow[]} rows
 * @param {{ generatedAt?: string }} [opts]
 * @returns {string}
 */
export function renderMarkdownTable(rows, opts = {}) {
  const generatedAt = opts.generatedAt ?? new Date().toISOString();
  const header = `| date | sha | curly | type Phase-2 | boundaries sum | subject |
| --- | --- | ---: | ---: | ---: | --- |`;
  const body = rows
    .map((r) => {
      const curly = r.curly == null ? '—' : String(r.curly);
      const type = r.typePhase2 == null ? '—' : String(r.typePhase2);
      const bound = r.boundaries == null ? '—' : String(r.boundaries);
      const subject = r.subject.replace(/\|/g, '\\|');
      return `| ${r.date.slice(0, 10)} | \`${r.short}\` | ${curly} | ${type} | ${bound} | ${subject} |`;
    })
    .join('\n');

  return `# Ratchet ceiling history

Task: \`q-mp-074\`. Regenerated by \`node scripts/report-ratchet-history.mjs\`.

Tracks git history of:

- \`docs/dev/lint-ratchet-ceilings.json\` → \`rules.curly\`
- \`docs/dev/type-ratchet-phase2-baseline.json\` → \`outOfScopeErrors\`
- \`docs/dev/module-boundaries-ceilings.json\` → sum of \`ceilings.*\`

Commits that only refresh tipSha / notes without changing these numbers are omitted. Generated at \`${generatedAt}\`.

## Chart

![Ratchet ceiling history](./ratchet-history.svg)

## Table

${header}
${body || '| — | — | — | — | — | (no history) |'}
`;
}

/**
 * @param {{ cwd?: string, git?: Function, writeFile?: (p: string, data: string) => void, generatedAt?: string }} [opts]
 * @returns {{ rows: HistoryRow[], svgPath: string, mdPath: string, svg: string, md: string }}
 */
export function generateReport(opts = {}) {
  const rows = collectHistory(opts);
  const svg = renderSvgChart(rows);
  const md = renderMarkdownTable(rows, { generatedAt: opts.generatedAt });
  const svgPath = path.join(opts.cwd ?? ROOT, OUT_SVG);
  const mdPath = path.join(opts.cwd ?? ROOT, OUT_MD);
  const write =
    opts.writeFile ??
    ((p, data) => {
      fs.mkdirSync(path.dirname(p), { recursive: true });
      fs.writeFileSync(p, data, 'utf8');
    });
  write(svgPath, svg);
  write(mdPath, md);
  return { rows, svgPath, mdPath, svg, md };
}

function main() {
  const { rows, svgPath, mdPath } = generateReport();
  console.log(
    `ratchet-history: wrote ${rows.length} row(s) → ${path.relative(ROOT, svgPath)}, ${path.relative(ROOT, mdPath)}`
  );
}

const isMain =
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  main();
}
