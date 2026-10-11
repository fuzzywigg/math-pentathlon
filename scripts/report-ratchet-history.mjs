#!/usr/bin/env node
/**
 * Report-only ratchet ceiling history chart (q-mp-074; refresh q-mp-236 / q-mp-290;
 * all-12 lint keys q-mp-1289).
 *
 * Walks git history for:
 *   - docs/dev/lint-ratchet-ceilings.json          → all rules.* ceiling keys (12)
 *   - docs/dev/type-ratchet-phase2-baseline.json   → Phase-2 out-of-scope errors
 *   - docs/dev/module-boundaries-ceilings.json     → sum of boundary ceilings
 *
 * Writes:
 *   - docs/dev/ratchet-ceiling-history.svg
 *   - docs/dev/ratchet-ceiling-history.md
 *
 * No new dependencies. Usage:
 *   node scripts/report-ratchet-history.mjs
 *   node scripts/report-ratchet-history.mjs --help
 *   node scripts/report-ratchet-history.mjs --dry-run
 *   npm run report:ratchet-history
 *
 * By default uses `git log --all` so pre-squash tip folds still appear when
 * those refs are present locally. Pass --first-parent to restrict to HEAD
 * first-parent history (forwards `--first-parent` to every `git log`).
 *
 * Default invocation (no --dry-run) still writes the md/svg docs intentionally.
 * --help / -h and --dry-run must not write those files (q-mp-872).
 *
 * Does not edit ceiling/baseline JSON values (report/chart only).
 */

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

export const TRACKED = Object.freeze({
  lintCeilings: 'docs/dev/lint-ratchet-ceilings.json',
  typePhase2: 'docs/dev/type-ratchet-phase2-baseline.json',
  boundaries: 'docs/dev/module-boundaries-ceilings.json',
});

/**
 * Lint metric field → eslint rule id in lint-ratchet-ceilings.json `rules`.
 * Must stay in sync with every key in docs/dev/lint-ratchet-ceilings.json (q-mp-1289).
 */
export const LINT_RULE_KEYS = Object.freeze({
  curly: 'curly',
  voidExpression: '@typescript-eslint/no-confusing-void-expression',
  nnnull: '@typescript-eslint/no-non-null-assertion',
  dupImports: 'no-duplicate-imports',
  radix: 'radix',
  defaultCase: 'default-case',
  nullish: '@typescript-eslint/prefer-nullish-coalescing',
  optionalChain: '@typescript-eslint/prefer-optional-chain',
  switchExhaustiveness: '@typescript-eslint/switch-exhaustiveness-check',
  noShadow: '@typescript-eslint/no-shadow',
  eqeqeq: 'eqeqeq',
  returnAwait: '@typescript-eslint/return-await',
});

/** Stable order of lint metric fields (matches LINT_RULE_KEYS insertion order). */
export const LINT_METRIC_KEYS = Object.freeze(Object.keys(LINT_RULE_KEYS));

/** Short chart / table labels for each lint metric. */
export const LINT_METRIC_LABELS = Object.freeze({
  curly: 'curly',
  voidExpression: 'void',
  nnnull: 'nnnull',
  dupImports: 'dup-imports',
  radix: 'radix',
  defaultCase: 'default-case',
  nullish: 'nullish',
  optionalChain: 'opt-chain',
  switchExhaustiveness: 'switch-exh',
  noShadow: 'no-shadow',
  eqeqeq: 'eqeqeq',
  returnAwait: 'return-await',
});

/** Distinct series colors for the 12 lint metrics (plus type/boundary below). */
const LINT_METRIC_COLORS = Object.freeze({
  curly: '#0b6e4f',
  voidExpression: '#8b1e3f',
  nnnull: '#5c4d7a',
  dupImports: '#2a6f97',
  radix: '#6b4226',
  defaultCase: '#b85c38',
  nullish: '#3d5a5b',
  optionalChain: '#c45c26',
  switchExhaustiveness: '#4a6741',
  noShadow: '#7a4e2d',
  eqeqeq: '#2f4858',
  returnAwait: '#9a3412',
});

export const OUT_SVG = 'docs/dev/ratchet-ceiling-history.svg';
export const OUT_MD = 'docs/dev/ratchet-ceiling-history.md';

export const USAGE = `Usage: node scripts/report-ratchet-history.mjs [options]

Options:
  --first-parent   Restrict git log to HEAD first-parent history
  --dry-run        Compute and print summary without writing docs
  -h, --help       Show this help

Default (no --dry-run) writes docs/dev/ratchet-ceiling-history.{md,svg}.
`;

/**
 * Parse CLI argv (slice(2) form). Hermetic — no I/O, no process.exit (q-mp-872).
 *
 * @param {string[]} argv
 * @returns {{
 *   ok: true,
 *   help: boolean,
 *   dryRun: boolean,
 *   firstParent: boolean,
 * } | {
 *   ok: false,
 *   message: string,
 * }}
 */
export function parseArgs(argv) {
  let help = false;
  let dryRun = false;
  let firstParent = false;
  for (const a of argv) {
    if (a === '--help' || a === '-h') {
      help = true;
    } else if (a === '--dry-run') {
      dryRun = true;
    } else if (a === '--first-parent') {
      firstParent = true;
    } else if (a.startsWith('-')) {
      return { ok: false, message: `Unknown flag: ${a}` };
    } else {
      return { ok: false, message: `Unexpected argument: ${a}` };
    }
  }
  return { ok: true, help, dryRun, firstParent };
}

/**
 * @typedef {{ sha: string, date: string, subject: string }} GitCommitMeta
 * @typedef {Record<keyof typeof LINT_RULE_KEYS, number | null>} LintMetrics
 * @typedef {GitCommitMeta & LintMetrics & {
 *   typeOutOfScope: number | null,
 *   boundarySum: number | null,
 * }} HistoryRow
 */

/**
 * All lint metrics set to null (scaffold for extract / empty rows).
 * @returns {LintMetrics}
 */
export function nullLintMetrics() {
  /** @type {LintMetrics} */
  const out = /** @type {LintMetrics} */ ({});
  for (const key of LINT_METRIC_KEYS) {
    out[/** @type {keyof typeof LINT_RULE_KEYS} */ (key)] = null;
  }
  return out;
}

/**
 * Coerce a JSON ceiling/rule value to a finite number.
 * Accepts numbers and finite numeric strings so history charts do not
 * undercount string-encoded ceilings (q-mp-1230 / q-mp-1231).
 *
 * @param {unknown} value
 * @returns {number | null}
 */
export function coerceFiniteNumber(value) {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '') return null;
    const n = Number(trimmed);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

/**
 * @param {unknown} rules
 * @param {string} ruleKey
 * @returns {number | null}
 */
function ruleNumber(rules, ruleKey) {
  if (rules == null || typeof rules !== 'object') return null;
  const n = /** @type {Record<string, unknown>} */ (rules)[ruleKey];
  return coerceFiniteNumber(n);
}

/**
 * Extract lint step-down metrics from lint-ratchet-ceilings.json shape.
 * Returns one entry per LINT_RULE_KEYS metric (all 12 live ceilings; q-mp-1289).
 * @param {unknown} json
 * @returns {LintMetrics}
 */
export function extractLintMetrics(json) {
  const out = nullLintMetrics();
  if (json == null || typeof json !== 'object') return out;
  const rules = /** @type {Record<string, unknown>} */ (json).rules;
  for (const metric of LINT_METRIC_KEYS) {
    const ruleKey =
      LINT_RULE_KEYS[/** @type {keyof typeof LINT_RULE_KEYS} */ (metric)];
    out[/** @type {keyof typeof LINT_RULE_KEYS} */ (metric)] = ruleNumber(
      rules,
      ruleKey
    );
  }
  return out;
}

/**
 * @param {string} kind
 * @returns {kind is keyof typeof LINT_RULE_KEYS}
 */
function isLintMetricKind(kind) {
  return Object.prototype.hasOwnProperty.call(LINT_RULE_KEYS, kind);
}

/**
 * Extract a single chart metric from a parsed ceiling/baseline JSON blob.
 * Unknown / missing shapes yield null for that metric (row still kept).
 *
 * @param {keyof typeof LINT_RULE_KEYS | 'typePhase2' | 'boundaries'} kind
 * @param {unknown} json
 * @returns {number | null}
 */
export function extractMetric(kind, json) {
  if (json == null || typeof json !== 'object') return null;
  const obj = /** @type {Record<string, unknown>} */ (json);
  if (isLintMetricKind(kind)) {
    return extractLintMetrics(json)[kind];
  }
  switch (kind) {
    case 'typePhase2': {
      // Match check-type-ratchet: top-level outOfScopeErrors, else nested totals.
      // Nested totals support kept from q-mp-1247. Coerce finite numeric strings
      // like lint/boundaries (q-mp-1311) so string-encoded Phase-2 baselines chart.
      const top = coerceFiniteNumber(obj.outOfScopeErrors);
      if (top != null) return top;
      const totals = obj.totals;
      if (totals != null && typeof totals === 'object') {
        return coerceFiniteNumber(
          /** @type {Record<string, unknown>} */ (totals).outOfScopeErrors
        );
      }
      return null;
    }
    case 'boundaries': {
      const ceilings = obj.ceilings;
      if (ceilings == null || typeof ceilings !== 'object') return null;
      let sum = 0;
      let saw = false;
      for (const v of Object.values(
        /** @type {Record<string, unknown>} */ (ceilings)
      )) {
        const n = coerceFiniteNumber(v);
        if (n != null) {
          sum += n;
          saw = true;
        }
      }
      return saw ? sum : null;
    }
    default: {
      const _exhaustive = /** @type {never} */ (kind);
      void _exhaustive;
      return null;
    }
  }
}

/**
 * Parse `git log --format` lines of `sha<TAB>isoDate<TAB>subject`.
 * @param {string} stdout
 * @returns {GitCommitMeta[]}
 */
export function parseGitLogLines(stdout) {
  const rows = [];
  for (const line of stdout.split('\n')) {
    if (!line.trim()) continue;
    const firstTab = line.indexOf('\t');
    const secondTab = firstTab === -1 ? -1 : line.indexOf('\t', firstTab + 1);
    if (firstTab === -1 || secondTab === -1) continue;
    const sha = line.slice(0, firstTab).trim();
    const date = line.slice(firstTab + 1, secondTab).trim();
    const subject = line.slice(secondTab + 1).trim();
    if (!sha || !date) continue;
    rows.push({ sha, date, subject });
  }
  return rows;
}

/**
 * Empty history row scaffold.
 * @param {GitCommitMeta} meta
 * @returns {HistoryRow}
 */
function emptyRow(meta) {
  return {
    sha: meta.sha,
    date: meta.date,
    subject: meta.subject,
    ...nullLintMetrics(),
    typeOutOfScope: null,
    boundarySum: null,
  };
}

/**
 * Merge per-file commit lists into chronological rows (oldest → newest).
 * Later non-null metric values overwrite earlier ones for the same sha;
 * null never wipes a prior numeric value (q-mp-1248).
 *
 * @param {{
 *   lint: Array<GitCommitMeta & LintMetrics>,
 *   typePhase2: Array<GitCommitMeta & { value: number | null }>,
 *   boundaries: Array<GitCommitMeta & { value: number | null }>,
 * }} byKind
 * @returns {HistoryRow[]}
 */
export function mergeHistory(byKind) {
  /** @type {Map<string, HistoryRow>} */
  const bySha = new Map();

  /**
   * @param {number | null} prev
   * @param {number | null} next
   * @returns {number | null}
   */
  function keepUnlessNull(prev, next) {
    return next != null ? next : prev;
  }

  for (const c of byKind.lint) {
    const existing = bySha.get(c.sha) ?? emptyRow(c);
    existing.date = c.date;
    existing.subject = c.subject;
    for (const metric of LINT_METRIC_KEYS) {
      const key = /** @type {keyof typeof LINT_RULE_KEYS} */ (metric);
      existing[key] = keepUnlessNull(existing[key], c[key]);
    }
    bySha.set(c.sha, existing);
  }

  /**
   * @param {Array<GitCommitMeta & { value: number | null }>} commits
   * @param {'typeOutOfScope' | 'boundarySum'} field
   */
  function applyScalar(commits, field) {
    for (const c of commits) {
      const existing = bySha.get(c.sha) ?? emptyRow(c);
      existing.date = c.date;
      existing.subject = c.subject;
      existing[field] = keepUnlessNull(existing[field], c.value);
      bySha.set(c.sha, existing);
    }
  }

  applyScalar(byKind.typePhase2, 'typeOutOfScope');
  applyScalar(byKind.boundaries, 'boundarySum');

  const rows = [...bySha.values()];
  rows.sort((a, b) => {
    if (a.date < b.date) return -1;
    if (a.date > b.date) return 1;
    return a.sha.localeCompare(b.sha);
  });

  // Forward-fill metrics so the chart has continuous series after first sighting.
  /** @type {Record<string, number | null>} */
  const lastLint = nullLintMetrics();
  /** @type {number | null} */
  let lastType = null;
  /** @type {number | null} */
  let lastBound = null;
  for (const row of rows) {
    for (const metric of LINT_METRIC_KEYS) {
      const key = /** @type {keyof typeof LINT_RULE_KEYS} */ (metric);
      if (row[key] != null) lastLint[key] = row[key];
      else row[key] = lastLint[key];
    }
    if (row.typeOutOfScope != null) lastType = row.typeOutOfScope;
    else row.typeOutOfScope = lastType;
    if (row.boundarySum != null) lastBound = row.boundarySum;
    else row.boundarySum = lastBound;
  }
  return rows;
}

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
 * Build a simple multi-series SVG line chart. Each series is normalized to its
 * own max so curly (~1k), type (~100s), and boundary (~10s) share one plot.
 *
 * @param {HistoryRow[]} rows
 * @param {{ title?: string }} [opts]
 * @returns {string}
 */
export function renderSvg(rows, opts = {}) {
  const title = opts.title ?? 'Ratchet ceiling history';
  const width = 960;
  const height = 520;
  const padL = 56;
  const padR = 24;
  const padT = 48;
  const padB = 140;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;

  /** @type {Array<{ key: keyof HistoryRow, label: string, color: string }>} */
  const series = [
    ...LINT_METRIC_KEYS.map((metric) => {
      const key = /** @type {keyof typeof LINT_RULE_KEYS} */ (metric);
      return {
        key,
        label: LINT_METRIC_LABELS[key],
        color: LINT_METRIC_COLORS[key],
      };
    }),
    {
      key: /** @type {const} */ ('typeOutOfScope'),
      label: 'type Phase-2 oos',
      color: '#1d4e89',
    },
    {
      key: /** @type {const} */ ('boundarySum'),
      label: 'boundary Σ',
      color: '#a15c00',
    },
  ];

  /**
   * @param {keyof HistoryRow} key
   */
  function seriesMax(key) {
    let m = 0;
    for (const r of rows) {
      const v = r[key];
      if (typeof v === 'number' && v > m) m = v;
    }
    return m > 0 ? m : 1;
  }

  const n = Math.max(rows.length, 1);

  /** @param {number} i */
  function xAt(i) {
    if (n === 1) return padL + plotW / 2;
    return padL + (plotW * i) / (n - 1);
  }

  /**
   * @param {number | null} v
   * @param {number} max
   */
  function yAt(v, max) {
    if (v == null) return null;
    const t = v / max;
    return padT + plotH * (1 - t);
  }

  const lintLabelList = LINT_METRIC_KEYS.map(
    (k) => LINT_METRIC_LABELS[/** @type {keyof typeof LINT_RULE_KEYS} */ (k)]
  ).join(', ');

  const parts = [];
  parts.push(
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeXml(title)}">`,
    `<title>${escapeXml(title)}</title>`,
    `<desc>Normalized line chart of all ${LINT_METRIC_KEYS.length} lint ratchet ceilings (${escapeXml(lintLabelList)}), Phase-2 type-ratchet out-of-scope errors, and module-boundary ceiling sum over git history.</desc>`,
    `<rect width="100%" height="100%" fill="#f7f5f0"/>`,
    `<text x="${padL}" y="28" font-family="Georgia, 'Times New Roman', serif" font-size="18" fill="#1a1a1a">${escapeXml(title)}</text>`,
    `<text x="${padL}" y="44" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="11" fill="#555">Each series scaled to its own max (see table for raw counts)</text>`,
    // plot frame
    `<rect x="${padL}" y="${padT}" width="${plotW}" height="${plotH}" fill="#fffef9" stroke="#c9c2b4"/>`
  );

  // horizontal guides
  for (let g = 0; g <= 4; g++) {
    const y = padT + (plotH * g) / 4;
    parts.push(
      `<line x1="${padL}" y1="${y}" x2="${padL + plotW}" y2="${y}" stroke="#e4ddd0" stroke-width="1"/>`
    );
    const pct = 100 - g * 25;
    parts.push(
      `<text x="${padL - 8}" y="${y + 4}" text-anchor="end" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="10" fill="#666">${pct}%</text>`
    );
  }

  for (const s of series) {
    const max = seriesMax(s.key);
    /** @type {string[]} */
    const pts = [];
    rows.forEach((r, i) => {
      const raw = r[s.key];
      const v = typeof raw === 'number' ? raw : null;
      const y = yAt(v, max);
      if (y == null) return;
      pts.push(`${xAt(i).toFixed(2)},${y.toFixed(2)}`);
    });
    if (pts.length >= 2) {
      parts.push(
        `<polyline fill="none" stroke="${s.color}" stroke-width="2.5" points="${pts.join(' ')}"/>`
      );
    }
    rows.forEach((r, i) => {
      const raw = r[s.key];
      const v = typeof raw === 'number' ? raw : null;
      const y = yAt(v, max);
      if (y == null) return;
      parts.push(
        `<circle cx="${xAt(i).toFixed(2)}" cy="${y.toFixed(2)}" r="3" fill="${s.color}"/>`
      );
    });
  }

  // x labels (sparse)
  const labelEvery = Math.max(1, Math.ceil(n / 8));
  const xLabelY = padT + plotH + 18;
  rows.forEach((r, i) => {
    if (i % labelEvery !== 0 && i !== n - 1) return;
    const label = r.date.slice(0, 10);
    parts.push(
      `<text x="${xAt(i).toFixed(2)}" y="${xLabelY}" text-anchor="middle" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="10" fill="#444">${escapeXml(label)}</text>`
    );
    parts.push(
      `<text x="${xAt(i).toFixed(2)}" y="${xLabelY + 14}" text-anchor="middle" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="9" fill="#777">${escapeXml(r.sha.slice(0, 7))}</text>`
    );
  });

  // legend (three rows for 12 lint + type + boundary)
  const legendRows = 3;
  const perRow = Math.ceil(series.length / legendRows);
  for (let rowIdx = 0; rowIdx < legendRows; rowIdx++) {
    let lx = padL;
    const ly = height - 48 + rowIdx * 16;
    const slice = series.slice(rowIdx * perRow, rowIdx * perRow + perRow);
    for (const s of slice) {
      parts.push(
        `<rect x="${lx}" y="${ly - 10}" width="12" height="12" fill="${s.color}"/>`,
        `<text x="${lx + 16}" y="${ly}" font-family="ui-sans-serif, system-ui, sans-serif" font-size="11" fill="#222">${escapeXml(s.label)}</text>`
      );
      lx += 16 + s.label.length * 7.2 + 20;
    }
  }

  if (rows.length === 0) {
    parts.push(
      `<text x="${padL + plotW / 2}" y="${padT + plotH / 2}" text-anchor="middle" font-family="ui-sans-serif, system-ui, sans-serif" font-size="14" fill="#666">No history found for tracked ceiling files</text>`
    );
  }

  parts.push(`</svg>`);
  return `${parts.join('\n')}\n`;
}

/**
 * Format a nullable count for markdown tables.
 * @param {number | null | undefined} n
 */
function cell(n) {
  return n == null ? '—' : String(n);
}

/**
 * Markdown table + short preamble for docs/dev/.
 * @param {HistoryRow[]} rows
 * @param {{
 *   generatedAt?: string,
 *   gitMode?: string,
 *   tipSha?: string,
 *   liveLint?: LintMetrics,
 * }} [meta]
 */
export function renderMarkdown(rows, meta = {}) {
  const generatedAt = meta.generatedAt ?? new Date().toISOString();
  const gitMode = meta.gitMode ?? 'git log --all';
  const tipSha = meta.tipSha ?? '';
  const live = meta.liveLint;
  const lintLabels = LINT_METRIC_KEYS.map(
    (k) => LINT_METRIC_LABELS[/** @type {keyof typeof LINT_RULE_KEYS} */ (k)]
  ).join(' / ');
  const lines = [
    '# Ratchet ceiling history',
    '',
    `Task: \`q-mp-074\` / refresh \`q-mp-236\` / \`q-mp-290\` / \`q-mp-1289\`. Generated \`${generatedAt}\` via \`${gitMode}\`.`,
    '',
    'Tracks report-only ceilings over git history:',
    '',
    `- **lint (${LINT_METRIC_KEYS.length}): ${lintLabels}** — \`docs/dev/lint-ratchet-ceilings.json\` → \`rules.*\``,
    '- **type Phase-2 out-of-scope** — `docs/dev/type-ratchet-phase2-baseline.json` → `outOfScopeErrors`',
    '- **boundary sum** — `docs/dev/module-boundaries-ceilings.json` → sum of `ceilings.*`',
    '',
  ];

  if (live && tipSha) {
    lines.push(
      `## Live tip snapshot (\`${tipSha.slice(0, 7)}\`)`,
      '',
      `| Metric | Ceiling |`,
      `| --- | ---: |`
    );
    for (const metric of LINT_METRIC_KEYS) {
      const key = /** @type {keyof typeof LINT_RULE_KEYS} */ (metric);
      const ruleId = LINT_RULE_KEYS[key];
      lines.push(`| ${ruleId} | ${cell(live[key])} |`);
    }
    lines.push(
      '',
      'Chart series are normalized independently; raw counts are in the history table.',
      ''
    );
  }

  const lintHeader = LINT_METRIC_KEYS.map(
    (k) => LINT_METRIC_LABELS[/** @type {keyof typeof LINT_RULE_KEYS} */ (k)]
  ).join(' | ');
  const lintAlign = LINT_METRIC_KEYS.map(() => '---:').join(' | ');
  const emptyLintCells = LINT_METRIC_KEYS.map(() => '—').join(' | ');

  lines.push(
    'Chart (each series normalized to its own max):',
    '',
    '![Ratchet ceiling history](./ratchet-ceiling-history.svg)',
    '',
    'Regenerate with `npm run report:ratchet-history` (no network; reads local git only).',
    '',
    `| SHA | Date | ${lintHeader} | type oos | boundary Σ | Subject |`,
    `| --- | --- | ${lintAlign} | ---: | ---: | --- |`
  );

  for (const r of rows) {
    const subj = r.subject.replace(/\|/g, '\\|');
    const lintCells = LINT_METRIC_KEYS.map((metric) => {
      const key = /** @type {keyof typeof LINT_RULE_KEYS} */ (metric);
      return cell(r[key]);
    }).join(' | ');
    lines.push(
      `| \`${r.sha.slice(0, 7)}\` | ${r.date.slice(0, 10)} | ${lintCells} | ${cell(r.typeOutOfScope)} | ${cell(r.boundarySum)} | ${subj} |`
    );
  }

  if (rows.length === 0) {
    lines.push(`| — | — | ${emptyLintCells} | — | — | _(no commits found)_ |`);
  }

  lines.push('');
  return `${lines.join('\n')}\n`;
}

/**
 * @param {(args: string[]) => { status: number | null, stdout: string, stderr: string }} runGit
 * @param {{ firstParent?: boolean }} [opts]
 */
export function collectHistory(runGit, opts = {}) {
  const firstParent = opts.firstParent === true;
  const logArgsBase = [
    'log',
    ...(firstParent ? ['--first-parent'] : ['--all']),
    '--date-order',
    '--format=%H\t%cI\t%s',
    '--',
  ];

  /**
   * @param {'typePhase2' | 'boundaries'} kind
   * @param {string} filePath
   */
  function loadScalarKind(kind, filePath) {
    const log = runGit([...logArgsBase, filePath]);
    if ((log.status ?? 1) !== 0) {
      throw new Error(
        `git log failed for ${filePath}: ${log.stderr || log.stdout}`
      );
    }
    const metas = parseGitLogLines(log.stdout);
    return metas.map((m) => {
      const shown = runGit(['show', `${m.sha}:${filePath}`]);
      if ((shown.status ?? 1) !== 0) {
        return { ...m, value: /** @type {null} */ (null) };
      }
      try {
        const json = JSON.parse(shown.stdout);
        return { ...m, value: extractMetric(kind, json) };
      } catch {
        return { ...m, value: /** @type {null} */ (null) };
      }
    });
  }

  function loadLintHistory() {
    const filePath = TRACKED.lintCeilings;
    const log = runGit([...logArgsBase, filePath]);
    if ((log.status ?? 1) !== 0) {
      throw new Error(
        `git log failed for ${filePath}: ${log.stderr || log.stdout}`
      );
    }
    const metas = parseGitLogLines(log.stdout);
    return metas.map((m) => {
      const shown = runGit(['show', `${m.sha}:${filePath}`]);
      if ((shown.status ?? 1) !== 0) {
        return { ...m, ...nullLintMetrics() };
      }
      try {
        const json = JSON.parse(shown.stdout);
        return { ...m, ...extractLintMetrics(json) };
      } catch {
        return { ...m, ...nullLintMetrics() };
      }
    });
  }

  return mergeHistory({
    lint: loadLintHistory(),
    typePhase2: loadScalarKind('typePhase2', TRACKED.typePhase2),
    boundaries: loadScalarKind('boundaries', TRACKED.boundaries),
  });
}

/**
 * Default git runner (spawnSync). Exported for tests that want to spy shape only.
 * @param {string[]} args
 */
export function runGit(args) {
  const result = spawnSync('git', args, {
    cwd: ROOT,
    encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024,
  });
  return {
    status: result.status,
    stdout: result.stdout || '',
    stderr: result.stderr || '',
  };
}

/**
 * Read live tip lint ceilings from the working tree (for the markdown snapshot).
 * @returns {LintMetrics}
 */
function readLiveLintSnapshot() {
  const filePath = path.join(ROOT, TRACKED.lintCeilings);
  try {
    const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return extractLintMetrics(json);
  } catch {
    return nullLintMetrics();
  }
}

/**
 * @param {{
 *   firstParent?: boolean,
 *   dryRun?: boolean,
 *   runGit?: typeof runGit,
 *   now?: string,
 *   liveLint?: ReturnType<typeof readLiveLintSnapshot>,
 * }} [opts]
 */
export function writeReport(opts = {}) {
  const git = opts.runGit ?? runGit;
  const firstParent = opts.firstParent === true;
  const dryRun = opts.dryRun === true;
  const rows = collectHistory(git, { firstParent });
  const gitMode = firstParent ? 'git log --first-parent' : 'git log --all';
  const tip = git(['rev-parse', 'HEAD']);
  const tipSha =
    (tip.status ?? 1) === 0 ? tip.stdout.trim() : (rows.at(-1)?.sha ?? '');
  const liveLint = opts.liveLint ?? readLiveLintSnapshot();
  const svg = renderSvg(rows);
  const md = renderMarkdown(rows, {
    generatedAt: opts.now ?? new Date().toISOString(),
    gitMode,
    tipSha,
    liveLint,
  });
  const svgPath = path.join(ROOT, OUT_SVG);
  const mdPath = path.join(ROOT, OUT_MD);
  if (!dryRun) {
    fs.mkdirSync(path.dirname(svgPath), { recursive: true });
    fs.writeFileSync(svgPath, svg, 'utf8');
    fs.writeFileSync(mdPath, md, 'utf8');
  }
  return { rows, svgPath, mdPath, gitMode, tipSha, liveLint, dryRun, svg, md };
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
  const { rows, svgPath, mdPath, gitMode, dryRun } = writeReport({
    firstParent: parsed.firstParent,
    dryRun: parsed.dryRun,
  });
  const verb = dryRun ? 'would write' : 'wrote';
  const suffix = dryRun ? ' (dry-run; not writing)' : '';
  console.log(
    `report:ratchet-history — ${rows.length} commit(s) via ${gitMode}${suffix}`
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
    console.error('report:ratchet-history error:', err);
    process.exitCode = 1;
  }
}
