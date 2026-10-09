#!/usr/bin/env node
/**
 * Report-only per-directory coverage heat table (q-mp-075).
 *
 * Reads vitest `json-summary` output (`coverage/coverage-summary.json` by
 * default) and writes:
 *   - docs/dev/coverage-map.svg
 *   - docs/dev/coverage-map.md
 *
 * No new dependencies. Usage:
 *   npm run test:unit:coverage
 *   node scripts/report-coverage-map.mjs
 *   npm run report:coverage-map
 *
 * Optional path:
 *   node scripts/report-coverage-map.mjs path/to/coverage-summary.json
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

export const DEFAULT_SUMMARY = 'coverage/coverage-summary.json';
export const OUT_SVG = 'docs/dev/coverage-map.svg';
export const OUT_MD = 'docs/dev/coverage-map.md';

/**
 * @typedef {{ total: number, covered: number, skipped?: number, pct: number }} CovMetric
 * @typedef {{
 *   lines?: CovMetric,
 *   statements?: CovMetric,
 *   functions?: CovMetric,
 *   branches?: CovMetric,
 * }} FileCov
 * @typedef {{
 *   dir: string,
 *   files: number,
 *   lines: CovMetric,
 *   branches: CovMetric,
 *   functions: CovMetric,
 *   statements: CovMetric,
 * }} DirRow
 */

/**
 * Escape text for SVG / XML text nodes and attributes.
 * @param {string} s
 */
export function escapeXml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Turn an absolute or relative coverage key into a repo-relative POSIX path.
 * @param {string} filePath
 * @param {string} [root]
 */
export function normalizeRepoPath(filePath, root = ROOT) {
  const posix = filePath.replace(/\\/g, '/');
  const rootPosix = root.replace(/\\/g, '/').replace(/\/$/, '');
  if (posix.startsWith(`${rootPosix}/`)) {
    return posix.slice(rootPosix.length + 1);
  }
  const srcIdx = posix.indexOf('/src/');
  if (srcIdx !== -1) {
    return posix.slice(srcIdx + 1);
  }
  if (posix.startsWith('src/')) return posix;
  return posix.replace(/^\.\//, '');
}

/**
 * @param {number} covered
 * @param {number} total
 * @returns {CovMetric}
 */
function metric(covered, total) {
  const t = Math.max(0, total);
  const c = Math.max(0, covered);
  const pct = t === 0 ? 100 : (100 * c) / t;
  return { total: t, covered: c, pct };
}

/**
 * @param {Partial<CovMetric> | undefined} m
 * @returns {{ covered: number, total: number }}
 */
function readMetric(m) {
  if (m == null || typeof m !== 'object') return { covered: 0, total: 0 };
  const covered = typeof m.covered === 'number' ? m.covered : 0;
  const total = typeof m.total === 'number' ? m.total : 0;
  return { covered, total };
}

/**
 * Aggregate file-level json-summary entries into per-directory rows under `src/`.
 * Skips the synthetic `total` key. Directories are parent paths of each file
 * (e.g. `src/games/hex` for `src/games/hex/rules.ts`).
 *
 * @param {Record<string, FileCov>} summary
 * @param {{ root?: string }} [opts]
 * @returns {DirRow[]}
 */
export function aggregateByDirectory(summary, opts = {}) {
  const root = opts.root ?? ROOT;
  /** @type {Map<string, {
   *   files: number,
   *   linesC: number, linesT: number,
   *   branchesC: number, branchesT: number,
   *   functionsC: number, functionsT: number,
   *   statementsC: number, statementsT: number,
   * }>} */
  const byDir = new Map();

  for (const [key, stats] of Object.entries(summary)) {
    if (key === 'total') continue;
    if (stats == null || typeof stats !== 'object') continue;
    const rel = normalizeRepoPath(key, root);
    if (!rel.startsWith('src/')) continue;
    const dir = path.posix.dirname(rel);
    if (!dir || dir === '.') continue;

    let bucket = byDir.get(dir);
    if (!bucket) {
      bucket = {
        files: 0,
        linesC: 0,
        linesT: 0,
        branchesC: 0,
        branchesT: 0,
        functionsC: 0,
        functionsT: 0,
        statementsC: 0,
        statementsT: 0,
      };
      byDir.set(dir, bucket);
    }
    bucket.files += 1;
    const lines = readMetric(stats.lines);
    const branches = readMetric(stats.branches);
    const functions = readMetric(stats.functions);
    const statements = readMetric(stats.statements);
    bucket.linesC += lines.covered;
    bucket.linesT += lines.total;
    bucket.branchesC += branches.covered;
    bucket.branchesT += branches.total;
    bucket.functionsC += functions.covered;
    bucket.functionsT += functions.total;
    bucket.statementsC += statements.covered;
    bucket.statementsT += statements.total;
  }

  /** @type {DirRow[]} */
  const rows = [];
  for (const [dir, b] of byDir) {
    rows.push({
      dir,
      files: b.files,
      lines: metric(b.linesC, b.linesT),
      branches: metric(b.branchesC, b.branchesT),
      functions: metric(b.functionsC, b.functionsT),
      statements: metric(b.statementsC, b.statementsT),
    });
  }

  rows.sort((a, b) => {
    if (a.lines.pct !== b.lines.pct) return a.lines.pct - b.lines.pct;
    return a.dir.localeCompare(b.dir);
  });
  return rows;
}

/**
 * Map a coverage percentage to a heat fill (green = high, amber = mid, red = low).
 * @param {number} pct
 */
export function heatColor(pct) {
  const p = Number.isFinite(pct) ? Math.min(100, Math.max(0, pct)) : 0;
  if (p >= 95) return '#1b7f4a';
  if (p >= 90) return '#3d9b5c';
  if (p >= 80) return '#7bb05a';
  if (p >= 70) return '#c4a035';
  if (p >= 50) return '#c4732a';
  return '#b33a2b';
}

/**
 * Contrast text for a heat cell.
 * @param {number} pct
 */
export function heatTextColor(pct) {
  const p = Number.isFinite(pct) ? pct : 0;
  return p >= 70 ? '#1a1a1a' : '#f7f5f0';
}

/**
 * Build an SVG heat table of per-directory coverage.
 *
 * @param {DirRow[]} rows
 * @param {{ title?: string, generatedAt?: string }} [opts]
 * @returns {string}
 */
export function renderCoverageHeatSvg(rows, opts = {}) {
  const title = opts.title ?? 'Unit coverage by directory';
  const generatedAt = opts.generatedAt ?? '';
  const rowH = 22;
  const headerH = 28;
  const padT = 52;
  const padB = 36;
  const padL = 16;
  const padR = 16;
  const dirW = 280;
  const metricW = 88;
  const filesW = 56;
  const cols = ['lines', 'branches', 'functions', 'statements'];
  const width =
    padL + dirW + cols.length * metricW + filesW + padR;
  const height = padT + headerH + Math.max(rows.length, 1) * rowH + padB;

  const parts = [];
  parts.push(
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeXml(title)}">`,
    `<title>${escapeXml(title)}</title>`,
    `<desc>Per-directory unit coverage heat table from vitest json-summary (lines, branches, functions, statements).</desc>`,
    `<rect width="100%" height="100%" fill="#f7f5f0"/>`,
    `<text x="${padL}" y="28" font-family="Georgia, 'Times New Roman', serif" font-size="18" fill="#1a1a1a">${escapeXml(title)}</text>`
  );
  if (generatedAt) {
    parts.push(
      `<text x="${padL}" y="44" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="11" fill="#555">Generated ${escapeXml(generatedAt)} · sorted by lines % ascending</text>`
    );
  } else {
    parts.push(
      `<text x="${padL}" y="44" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="11" fill="#555">Sorted by lines % ascending</text>`
    );
  }

  const tableY = padT;
  const headers = [
    { label: 'Directory', x: padL, w: dirW, anchor: 'start' },
    ...cols.map((c, i) => ({
      label: c,
      x: padL + dirW + i * metricW + metricW / 2,
      w: metricW,
      anchor: 'middle',
    })),
    {
      label: 'files',
      x: padL + dirW + cols.length * metricW + filesW / 2,
      w: filesW,
      anchor: 'middle',
    },
  ];

  parts.push(
    `<rect x="${padL}" y="${tableY}" width="${width - padL - padR}" height="${headerH}" fill="#e8e2d6" stroke="#c9c2b4"/>`
  );
  for (const h of headers) {
    const tx =
      h.anchor === 'start' ? h.x + 8 : h.x;
    parts.push(
      `<text x="${tx}" y="${tableY + 18}" text-anchor="${h.anchor}" font-family="ui-sans-serif, system-ui, sans-serif" font-size="12" font-weight="600" fill="#222">${escapeXml(h.label)}</text>`
    );
  }

  if (rows.length === 0) {
    parts.push(
      `<text x="${padL + (width - padL - padR) / 2}" y="${tableY + headerH + rowH}" text-anchor="middle" font-family="ui-sans-serif, system-ui, sans-serif" font-size="14" fill="#666">No src/ coverage entries found</text>`
    );
  }

  rows.forEach((row, i) => {
    const y = tableY + headerH + i * rowH;
    const bg = i % 2 === 0 ? '#fffef9' : '#f3efe6';
    parts.push(
      `<rect x="${padL}" y="${y}" width="${width - padL - padR}" height="${rowH}" fill="${bg}" stroke="#e4ddd0"/>`,
      `<text x="${padL + 8}" y="${y + 15}" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="11" fill="#1a1a1a">${escapeXml(row.dir)}</text>`
    );

    cols.forEach((col, ci) => {
      /** @type {CovMetric} */
      const m = row[/** @type {'lines'|'branches'|'functions'|'statements'} */ (col)];
      const cx = padL + dirW + ci * metricW;
      const fill = heatColor(m.pct);
      const text = heatTextColor(m.pct);
      parts.push(
        `<rect x="${cx + 4}" y="${y + 3}" width="${metricW - 8}" height="${rowH - 6}" rx="3" fill="${fill}"/>`,
        `<text x="${cx + metricW / 2}" y="${y + 15}" text-anchor="middle" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="11" fill="${text}">${m.pct.toFixed(1)}%</text>`
      );
    });

    const fx = padL + dirW + cols.length * metricW + filesW / 2;
    parts.push(
      `<text x="${fx}" y="${y + 15}" text-anchor="middle" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="11" fill="#333">${row.files}</text>`
    );
  });

  // legend
  const legendY = height - 14;
  const bands = [
    { label: '≥95%', color: heatColor(96) },
    { label: '90–95', color: heatColor(92) },
    { label: '80–90', color: heatColor(85) },
    { label: '70–80', color: heatColor(75) },
    { label: '50–70', color: heatColor(60) },
    { label: '<50%', color: heatColor(40) },
  ];
  let lx = padL;
  parts.push(
    `<text x="${lx}" y="${legendY}" font-family="ui-sans-serif, system-ui, sans-serif" font-size="11" fill="#444">Heat (lines %):</text>`
  );
  lx += 90;
  for (const b of bands) {
    parts.push(
      `<rect x="${lx}" y="${legendY - 10}" width="12" height="12" fill="${b.color}"/>`,
      `<text x="${lx + 16}" y="${legendY}" font-family="ui-sans-serif, system-ui, sans-serif" font-size="11" fill="#333">${escapeXml(b.label)}</text>`
    );
    lx += 16 + b.label.length * 6.5 + 14;
  }

  parts.push(`</svg>`);
  return `${parts.join('\n')}\n`;
}

/**
 * Short markdown doc that embeds the SVG and explains regeneration.
 * @param {DirRow[]} rows
 * @param {{ generatedAt?: string, summaryPath?: string }} [meta]
 */
export function renderCoverageMapMarkdown(rows, meta = {}) {
  const generatedAt = meta.generatedAt ?? new Date().toISOString();
  const summaryPath = meta.summaryPath ?? DEFAULT_SUMMARY;
  const lowest = rows.slice(0, 8);
  const lines = [
    '# Unit coverage map (by directory)',
    '',
    `Task: \`q-mp-075\`. Generated \`${generatedAt}\` from \`${summaryPath}\`.`,
    '',
    'Per-directory heat table of vitest unit coverage (`json-summary`). Rows are',
    'parent directories under `src/` (for example `src/games/hex` for',
    '`src/games/hex/rules.ts`), sorted by **lines %** ascending so cold spots',
    'surface first. Does not change coverage thresholds or CI.',
    '',
    '![Unit coverage by directory](./coverage-map.svg)',
    '',
    '## Regenerate',
    '',
    '```bash',
    'npm run test:unit:coverage',
    'npm run report:coverage-map',
    '```',
    '',
    'Or point at an existing summary:',
    '',
    '```bash',
    'node scripts/report-coverage-map.mjs path/to/coverage-summary.json',
    '```',
    '',
    'No network; reads local coverage JSON only. No new npm dependencies.',
    '',
    '## Coldest directories (lines %)',
    '',
    '| Directory | Lines % | Branches % | Files |',
    '| --- | ---: | ---: | ---: |',
  ];

  for (const r of lowest) {
    lines.push(
      `| \`${r.dir}\` | ${r.lines.pct.toFixed(2)} | ${r.branches.pct.toFixed(2)} | ${r.files} |`
    );
  }
  if (lowest.length === 0) {
    lines.push('| — | — | — | — |');
  }

  lines.push(
    '',
    `Directories rendered: **${rows.length}**. Full heat table is in the SVG above.`,
    ''
  );
  return `${lines.join('\n')}\n`;
}

/**
 * @param {{
 *   summaryPath?: string,
 *   summary?: Record<string, FileCov>,
 *   now?: string,
 *   root?: string,
 * }} [opts]
 */
export function writeReport(opts = {}) {
  const summaryPath = path.resolve(
    ROOT,
    opts.summaryPath ?? DEFAULT_SUMMARY
  );
  /** @type {Record<string, FileCov>} */
  const summary =
    opts.summary ??
    JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
  const rows = aggregateByDirectory(summary, { root: opts.root ?? ROOT });
  const generatedAt = opts.now ?? new Date().toISOString();
  const relSummary = path.relative(ROOT, summaryPath).replace(/\\/g, '/');
  const svg = renderCoverageHeatSvg(rows, { generatedAt });
  const md = renderCoverageMapMarkdown(rows, {
    generatedAt,
    summaryPath: relSummary || DEFAULT_SUMMARY,
  });
  const svgPath = path.join(ROOT, OUT_SVG);
  const mdPath = path.join(ROOT, OUT_MD);
  fs.mkdirSync(path.dirname(svgPath), { recursive: true });
  fs.writeFileSync(svgPath, svg, 'utf8');
  fs.writeFileSync(mdPath, md, 'utf8');
  return { rows, svgPath, mdPath, summaryPath };
}

function main() {
  const argPath = process.argv[2];
  const { rows, svgPath, mdPath, summaryPath } = writeReport({
    summaryPath: argPath,
  });
  console.log(
    `report:coverage-map — ${rows.length} director${rows.length === 1 ? 'y' : 'ies'} from ${path.relative(ROOT, summaryPath)}`
  );
  console.log(`  wrote ${path.relative(ROOT, svgPath)}`);
  console.log(`  wrote ${path.relative(ROOT, mdPath)}`);
}

const isMain =
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (isMain) {
  try {
    main();
  } catch (err) {
    console.error('report:coverage-map error:', err);
    process.exitCode = 1;
  }
}
