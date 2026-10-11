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
 *   node scripts/report-coverage-map.mjs --dry-run
 *
 * CLI (q-mp-906): `--help`/`-h` exit 0 with usage; args starting with `-`
 * are rejected (exit 2) before path lookup — never treat `--help` as a path.
 *
 * Default invocation (no --dry-run) still writes the md/svg docs intentionally.
 * --help / -h and --dry-run must not write those files (q-mp-977).
 * Empty / array / zero-directory summaries are rejected with no doc writes (q-mp-993).
 * Malformed JSON prints a short message (no stack) and exits non-zero (q-mp-1005).
 * Pct-only metric rows honor numeric `pct` (covered/total shown as unknown); never
 * invent 100% from absent totals via metric(0,0) (q-mp-1017). Explicit 0/0 counts
 * still map to istanbul's 100%.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

export const DEFAULT_SUMMARY = 'coverage/coverage-summary.json';
export const OUT_SVG = 'docs/dev/coverage-map.svg';
export const OUT_MD = 'docs/dev/coverage-map.md';

export const USAGE = `Usage: node scripts/report-coverage-map.mjs [options] [coverage-summary.json]

Options:
  --dry-run     Compute and print summary counts without writing docs
  -h, --help    Show this help and exit 0

Reads vitest json-summary (default: coverage/coverage-summary.json).
Default (no --dry-run) writes docs/dev/coverage-map.{md,svg}.
Flag-like argv is rejected before path lookup.
`;

/**
 * Parse CLI argv (slice(2) form). Hermetic — no I/O, no process.exit (q-mp-906 / q-mp-977).
 *
 * @param {string[]} argv
 * @returns {{
 *   ok: true,
 *   help: boolean,
 *   dryRun: boolean,
 *   summaryPath: string | undefined,
 * } | {
 *   ok: false,
 *   message: string,
 * }}
 */
export function parseArgs(argv) {
  let help = false;
  let dryRun = false;
  /** @type {string | undefined} */
  let summaryPath;
  for (const a of argv) {
    if (a === '--help' || a === '-h') {
      help = true;
      continue;
    }
    if (a === '--dry-run') {
      dryRun = true;
      continue;
    }
    if (a.startsWith('-')) {
      return { ok: false, message: `Unknown flag: ${a}` };
    }
    if (summaryPath !== undefined) {
      return { ok: false, message: `Unexpected argument: ${a}` };
    }
    summaryPath = a;
  }
  return { ok: true, help, dryRun, summaryPath };
}

/**
 * @typedef {{
 *   total: number | null,
 *   covered: number | null,
 *   skipped?: number,
 *   pct: number,
 * }} CovMetric
 * @typedef {{
 *   lines?: Partial<CovMetric>,
 *   statements?: Partial<CovMetric>,
 *   functions?: Partial<CovMetric>,
 *   branches?: Partial<CovMetric>,
 * }} FileCov
 * @typedef {{
 *   dir: string,
 *   files: number,
 *   lines: CovMetric,
 *   branches: CovMetric,
 *   functions: CovMetric,
 *   statements: CovMetric,
 * }} DirRow
 * @typedef {{
 *   files: number,
 *   linesC: number, linesT: number, linesCountFiles: number, linesPctSum: number, linesPctFiles: number,
 *   branchesC: number, branchesT: number, branchesCountFiles: number, branchesPctSum: number, branchesPctFiles: number,
 *   functionsC: number, functionsT: number, functionsCountFiles: number, functionsPctSum: number, functionsPctFiles: number,
 *   statementsC: number, statementsT: number, statementsCountFiles: number, statementsPctSum: number, statementsPctFiles: number,
 * }} DirBucket
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
 * Istanbul-style counts → metric. Explicit 0/0 stays 100% (empty file).
 * @param {number} covered
 * @param {number} total
 * @returns {CovMetric}
 */
function metricFromCounts(covered, total) {
  const t = Math.max(0, total);
  const c = Math.max(0, covered);
  const pct = t === 0 ? 100 : (100 * c) / t;
  return { total: t, covered: c, pct };
}

/**
 * Pct-only metric: honor numeric pct; covered/total unknown (q-mp-1017).
 * @param {number} pct
 * @returns {CovMetric}
 */
function metricFromPct(pct) {
  return { total: null, covered: null, pct };
}

/**
 * Parse one file-level coverage metric.
 * Prefer covered+total when both are finite numbers; else honor numeric pct;
 * otherwise absent (do not invent 0/0 → 100%).
 *
 * @param {Partial<CovMetric> | undefined} m
 * @returns {{ kind: 'counts', covered: number, total: number }
 *   | { kind: 'pct', pct: number }
 *   | { kind: 'absent' }}
 */
export function readMetric(m) {
  if (m == null || typeof m !== 'object') return { kind: 'absent' };
  const hasCovered =
    typeof m.covered === 'number' && Number.isFinite(m.covered);
  const hasTotal = typeof m.total === 'number' && Number.isFinite(m.total);
  if (hasCovered && hasTotal) {
    return { kind: 'counts', covered: m.covered, total: m.total };
  }
  if (typeof m.pct === 'number' && Number.isFinite(m.pct)) {
    return { kind: 'pct', pct: m.pct };
  }
  return { kind: 'absent' };
}

/**
 * @param {DirBucket} bucket
 * @param {'lines'|'branches'|'functions'|'statements'} key
 * @param {{ kind: 'counts', covered: number, total: number }
 *   | { kind: 'pct', pct: number }
 *   | { kind: 'absent' }} parsed
 */
function accumulateMetric(bucket, key, parsed) {
  if (parsed.kind === 'counts') {
    bucket[`${key}C`] += parsed.covered;
    bucket[`${key}T`] += parsed.total;
    bucket[`${key}CountFiles`] += 1;
    return;
  }
  if (parsed.kind === 'pct') {
    bucket[`${key}PctSum`] += parsed.pct;
    bucket[`${key}PctFiles`] += 1;
  }
}

/**
 * Finalize a directory metric from count and/or pct-only contributions.
 * @param {DirBucket} bucket
 * @param {'lines'|'branches'|'functions'|'statements'} key
 * @returns {CovMetric}
 */
function finalizeMetric(bucket, key) {
  const countFiles = bucket[`${key}CountFiles`];
  const pctFiles = bucket[`${key}PctFiles`];
  if (countFiles > 0 && pctFiles === 0) {
    return metricFromCounts(bucket[`${key}C`], bucket[`${key}T`]);
  }
  if (countFiles === 0 && pctFiles > 0) {
    return metricFromPct(bucket[`${key}PctSum`] / pctFiles);
  }
  if (countFiles > 0 && pctFiles > 0) {
    const countsPct = metricFromCounts(
      bucket[`${key}C`],
      bucket[`${key}T`]
    ).pct;
    const pctOnlyAvg = bucket[`${key}PctSum`] / pctFiles;
    const combined =
      (countsPct * countFiles + pctOnlyAvg * pctFiles) /
      (countFiles + pctFiles);
    return { total: null, covered: null, pct: combined };
  }
  // Totals absent and no pct — do not invent 100% from 0/0 (q-mp-1017).
  return { total: null, covered: null, pct: 0 };
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
  /** @type {Map<string, DirBucket>} */
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
        linesCountFiles: 0,
        linesPctSum: 0,
        linesPctFiles: 0,
        branchesC: 0,
        branchesT: 0,
        branchesCountFiles: 0,
        branchesPctSum: 0,
        branchesPctFiles: 0,
        functionsC: 0,
        functionsT: 0,
        functionsCountFiles: 0,
        functionsPctSum: 0,
        functionsPctFiles: 0,
        statementsC: 0,
        statementsT: 0,
        statementsCountFiles: 0,
        statementsPctSum: 0,
        statementsPctFiles: 0,
      };
      byDir.set(dir, bucket);
    }
    bucket.files += 1;
    accumulateMetric(bucket, 'lines', readMetric(stats.lines));
    accumulateMetric(bucket, 'branches', readMetric(stats.branches));
    accumulateMetric(bucket, 'functions', readMetric(stats.functions));
    accumulateMetric(bucket, 'statements', readMetric(stats.statements));
  }

  /** @type {DirRow[]} */
  const rows = [];
  for (const [dir, b] of byDir) {
    rows.push({
      dir,
      files: b.files,
      lines: finalizeMetric(b, 'lines'),
      branches: finalizeMetric(b, 'branches'),
      functions: finalizeMetric(b, 'functions'),
      statements: finalizeMetric(b, 'statements'),
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
  const width = padL + dirW + cols.length * metricW + filesW + padR;
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
    const tx = h.anchor === 'start' ? h.x + 8 : h.x;
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
      const m =
        row[/** @type {'lines'|'branches'|'functions'|'statements'} */ (col)];
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
    'Wiki visual (coldest-directory heat table): [Unit coverage heat map](../wiki/coverage-map.md).',
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
 * Friendly hint when vitest json-summary is absent (q-mp-847).
 * @param {string} [summaryPath]
 * @returns {string}
 */
export function missingSummaryMessage(summaryPath = DEFAULT_SUMMARY) {
  const display = String(summaryPath).replace(/\\/g, '/');
  return [
    `report:coverage-map — missing coverage summary at ${display}`,
    'Run `npm run test:unit:coverage` then `npm run report:coverage-map`, or pass an explicit path to a coverage-summary.json.',
  ].join('\n');
}

/**
 * Stable message for empty / array / zero-directory summaries (q-mp-993).
 * @param {string} [summaryPath]
 * @param {string} [reason]
 * @returns {string}
 */
export function invalidSummaryMessage(
  summaryPath = DEFAULT_SUMMARY,
  reason = 'empty or invalid shape'
) {
  const display = String(summaryPath).replace(/\\/g, '/');
  return [
    `report:coverage-map — invalid coverage summary at ${display}: ${reason}`,
    'Expected a vitest json-summary object with at least one src/ file entry. Empty objects, arrays, and zero-directory summaries are rejected (no doc writes).',
  ].join('\n');
}

/**
 * Stable message for malformed JSON (q-mp-1005) — no stack.
 * @param {string} [summaryPath]
 * @param {string} [detail]
 * @returns {string}
 */
export function malformedJsonMessage(
  summaryPath = DEFAULT_SUMMARY,
  detail = 'Unexpected end of JSON input'
) {
  const display = String(summaryPath).replace(/\\/g, '/');
  return [
    `report:coverage-map — malformed JSON in ${display}`,
    detail,
    'Pass a valid vitest coverage-summary.json (run `npm run test:unit:coverage`).',
  ].join('\n');
}

/**
 * @param {unknown} err
 * @returns {err is Error & { code: string, path?: string }}
 */
function isMissingSummaryError(err) {
  return (
    err != null &&
    typeof err === 'object' &&
    'code' in err &&
    /** @type {{ code?: unknown }} */ (err).code === 'ENOENT'
  );
}

/**
 * Input-shape / parse errors that should print message-only (no stack).
 * @param {unknown} err
 * @returns {err is Error & { code: string }}
 */
function isCoverageSummaryInputError(err) {
  if (err == null || typeof err !== 'object' || !('code' in err)) return false;
  const code = /** @type {{ code?: unknown }} */ (err).code;
  return code === 'INVALID_SUMMARY' || code === 'MALFORMED_JSON';
}

/**
 * Reject arrays, null, non-objects, and summaries that yield zero src/ dirs (q-mp-993).
 * Hermetic — no I/O.
 *
 * @param {unknown} summary
 * @param {{ root?: string }} [opts]
 * @returns {{ ok: true, rows: DirRow[] } | { ok: false, reason: string }}
 */
export function validateCoverageSummary(summary, opts = {}) {
  if (summary == null || typeof summary !== 'object') {
    return { ok: false, reason: 'expected a non-null object' };
  }
  if (Array.isArray(summary)) {
    return { ok: false, reason: 'array-shaped summary' };
  }
  const rows = aggregateByDirectory(
    /** @type {Record<string, FileCov>} */ (summary),
    { root: opts.root ?? ROOT }
  );
  if (rows.length === 0) {
    return { ok: false, reason: 'zero directories under src/' };
  }
  return { ok: true, rows };
}

/**
 * @param {string} message
 * @param {'INVALID_SUMMARY' | 'MALFORMED_JSON'} code
 * @param {string} [summaryPath]
 * @returns {Error & { code: string, path?: string }}
 */
function coverageSummaryError(message, code, summaryPath) {
  const err = /** @type {Error & { code: string, path?: string }} */ (
    new Error(message)
  );
  err.code = code;
  if (summaryPath !== undefined) err.path = summaryPath;
  return err;
}

/**
 * @param {{
 *   summaryPath?: string,
 *   summary?: Record<string, FileCov>,
 *   now?: string,
 *   root?: string,
 *   dryRun?: boolean,
 * }} [opts]
 */
export function writeReport(opts = {}) {
  const summaryPath = path.resolve(ROOT, opts.summaryPath ?? DEFAULT_SUMMARY);
  const dryRun = opts.dryRun === true;
  const relSummary =
    path.relative(ROOT, summaryPath).replace(/\\/g, '/') || DEFAULT_SUMMARY;
  /** @type {unknown} */
  let summary;
  if (opts.summary != null) {
    summary = opts.summary;
  } else if (!fs.existsSync(summaryPath)) {
    const err = new Error(missingSummaryMessage(relSummary));
    err.code = 'ENOENT';
    err.path = summaryPath;
    throw err;
  } else {
    const raw = fs.readFileSync(summaryPath, 'utf8');
    try {
      summary = JSON.parse(raw);
    } catch (err) {
      const detail = err instanceof Error ? err.message : String(err);
      throw coverageSummaryError(
        malformedJsonMessage(relSummary, detail),
        'MALFORMED_JSON',
        summaryPath
      );
    }
  }
  const validated = validateCoverageSummary(summary, {
    root: opts.root ?? ROOT,
  });
  if (!validated.ok) {
    throw coverageSummaryError(
      invalidSummaryMessage(relSummary, validated.reason),
      'INVALID_SUMMARY',
      summaryPath
    );
  }
  const { rows } = validated;
  const generatedAt = opts.now ?? new Date().toISOString();
  const svg = renderCoverageHeatSvg(rows, { generatedAt });
  const md = renderCoverageMapMarkdown(rows, {
    generatedAt,
    summaryPath: relSummary || DEFAULT_SUMMARY,
  });
  const svgPath = path.join(ROOT, OUT_SVG);
  const mdPath = path.join(ROOT, OUT_MD);
  if (!dryRun) {
    fs.mkdirSync(path.dirname(svgPath), { recursive: true });
    fs.writeFileSync(svgPath, svg, 'utf8');
    fs.writeFileSync(mdPath, md, 'utf8');
  }
  return { rows, svgPath, mdPath, summaryPath, dryRun, svg, md };
}

function main() {
  const parsed = parseArgs(process.argv.slice(2));
  if (!parsed.ok) {
    console.error(parsed.message);
    console.error(USAGE.trimEnd());
    process.exitCode = 2;
    return;
  }
  if (parsed.help) {
    console.log(USAGE.trimEnd());
    return;
  }
  const { rows, svgPath, mdPath, summaryPath, dryRun } = writeReport({
    summaryPath: parsed.summaryPath,
    dryRun: parsed.dryRun,
  });
  const verb = dryRun ? 'would write' : 'wrote';
  const suffix = dryRun ? ' (dry-run; not writing)' : '';
  console.log(
    `report:coverage-map — ${rows.length} director${rows.length === 1 ? 'y' : 'ies'} from ${path.relative(ROOT, summaryPath)}${suffix}`
  );
  console.log(`  ${verb} ${path.relative(ROOT, svgPath)}`);
  console.log(`  ${verb} ${path.relative(ROOT, mdPath)}`);
}

const isMain =
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (isMain) {
  try {
    main();
  } catch (err) {
    if (isMissingSummaryError(err)) {
      const display =
        typeof err.path === 'string'
          ? path.relative(ROOT, err.path).replace(/\\/g, '/') || DEFAULT_SUMMARY
          : DEFAULT_SUMMARY;
      // Hint only — no Error stack as primary UX (q-mp-847).
      console.error(
        err instanceof Error && err.message.startsWith('report:coverage-map')
          ? err.message
          : missingSummaryMessage(display)
      );
      process.exitCode = 1;
    } else if (isCoverageSummaryInputError(err)) {
      // Invalid shape / malformed JSON — message only, no stack (q-mp-993 / q-mp-1005).
      console.error(err instanceof Error ? err.message : String(err));
      process.exitCode = 1;
    } else {
      console.error('report:coverage-map error:', err);
      process.exitCode = 1;
    }
  }
}
