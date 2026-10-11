#!/usr/bin/env node
/**
 * Rank non-AI engine modules from a vitest coverage-summary.json.
 *
 * Usage: node scripts/engine-coverage-rank.mjs <path/to/coverage-summary.json>
 *
 * Exit codes:
 *   0 — ranked table printed (or --help / -h)
 *   2 — missing/unreadable summary path, flag-like argv, empty/non-engine
 *       summary, or engine rows with missing/non-numeric pct that cannot be
 *       derived from covered/total (prints usage; no stack; no fake empty
 *       rank table)
 *
 * Default path when omitted: coverage-engine-baseline/coverage-summary.json
 * (generated locally; not committed).
 *
 * CLI (q-mp-918): `--help`/`-h` exit 0 with usage; args starting with `-`
 * are rejected (exit 2) before path lookup — never treat `--help` as a path.
 * Missing-summary copy (q-mp-842) is unchanged.
 * Empty / total-only / non-engine summaries (q-mp-992) exit 2 before rank output.
 * Missing / non-numeric pct on matching engine rows (q-mp-1018): derive from
 * numeric covered/total when possible; otherwise exit 2 with a schema message.
 * Contradictory numeric pct vs covered/total (q-mp-1033): when both covered and
 * total are finite numbers, display/rank pct is always derived from them so a
 * stale pct cannot invert rank order.
 * Covered > total (q-mp-1083): clamp covered to total before derive so rank pct
 * never exceeds 100 (same approach as report-coverage-map q-mp-1039).
 * Pct-only numeric rows (q-mp-1084): keep pct; covered/total stay unknown (not
 * invented 0/0) in the rank table.
 * Nested absolute keys (q-mp-1207): slice from the last `src/games/` segment;
 * duplicate abs paths for the same engine file keep the last row only.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** One-line usage embedded in the missing-summary message (q-mp-842; keep stable). */
export const USAGE =
  'Usage: node scripts/engine-coverage-rank.mjs <path/to/coverage-summary.json>';

export const DEFAULT_SUMMARY_REL =
  'coverage-engine-baseline/coverage-summary.json';

/** Full help for `--help` / `-h` and unknown-flag errors (q-mp-918). */
export const HELP = `${USAGE}

Options:
  -h, --help    Show this help and exit 0

Ranks non-AI engine modules from a vitest coverage-summary.json.
Flag-like argv is rejected before path lookup. Default when omitted:
${DEFAULT_SUMMARY_REL} (local; not committed).
`;

const ENGINE_RE =
  /src\/games\/([^/]+)\/(rules|types|game-state|board|pieces|serialization)\.ts$/;

/**
 * Parse CLI argv (slice(2) form). Hermetic — no I/O, no process.exit (q-mp-918).
 *
 * @param {string[]} argv
 * @returns {{
 *   ok: true,
 *   help: boolean,
 *   summaryPath: string | undefined,
 * } | {
 *   ok: false,
 *   message: string,
 * }}
 */
export function parseArgs(argv) {
  let help = false;
  /** @type {string | undefined} */
  let summaryPath;
  for (const a of argv) {
    if (a === '--help' || a === '-h') {
      help = true;
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
  return { ok: true, help, summaryPath };
}

/**
 * @param {string | undefined} arg
 * @param {string} [cwd]
 */
export function resolveSummaryPath(arg, cwd = process.cwd()) {
  return arg ? path.resolve(cwd, arg) : path.resolve(cwd, DEFAULT_SUMMARY_REL);
}

/**
 * @param {string} summaryPath
 */
export function missingSummaryMessage(summaryPath) {
  return [
    `error: coverage summary not found: ${summaryPath}`,
    USAGE,
    'Generate coverage-summary.json locally (e.g. npm run test:unit:coverage) and pass its path; the default coverage-engine-baseline/ directory is not committed.',
  ].join('\n');
}

/**
 * Message when the summary parses but has zero matching engine rows (q-mp-992).
 * @param {string} summaryPath
 */
export function emptyEngineSummaryMessage(summaryPath) {
  return [
    `error: coverage summary has no matching engine modules: ${summaryPath}`,
    USAGE,
    'Expected at least one non-AI engine file matching src/games/<game>/(rules|types|game-state|board|pieces|serialization).ts. Empty objects, total-only summaries, and non-engine rows are rejected (not treated as zero debt).',
  ].join('\n');
}

/**
 * Message when an engine row has missing/non-numeric pct that cannot be derived
 * from covered/total (q-mp-1018).
 * @param {string} summaryPath
 * @param {string} filePath
 */
export function invalidMetricMessage(summaryPath, filePath) {
  return [
    `error: coverage summary has missing or non-numeric pct for engine module: ${filePath}`,
    `summary: ${summaryPath}`,
    USAGE,
    'Expected lines/branches with a finite numeric pct, or numeric covered/total to derive pct. String or absent pct without covered/total is rejected (no stack).',
  ].join('\n');
}

/**
 * Thrown by collectEngineRows when a matching engine row has unusable metrics
 * (q-mp-1018). main maps this to exit 2 + invalidMetricMessage (no stack).
 */
export class InvalidCoverageMetricError extends Error {
  /**
   * @param {string} filePath
   */
  constructor(filePath) {
    super(`invalid coverage metric for ${filePath}`);
    this.name = 'InvalidCoverageMetricError';
    this.filePath = filePath;
  }
}

/**
 * Format covered/total for the rank table. Unknown counts (pct-only) → em dash
 * (q-mp-1084); never invent a fake 0/0 ratio beside a real pct.
 *
 * @param {number | null | undefined} covered
 * @param {number | null | undefined} total
 * @returns {string}
 */
export function formatCounts(covered, total) {
  if (covered == null || total == null) return '—';
  return `${covered}/${total}`;
}

/**
 * Normalize a lines/branches metric.
 *
 * When numeric covered + total are present, derive pct from them (q-mp-1033) —
 * including when a finite numeric pct contradicts the counts (stale istanbul
 * rows). Covered is clamped to [0, total] before derive so pct ≤ 100
 * (q-mp-1083). total===0 → 100. Absent metric → zeros (legacy default for
 * missing branches). Pct-only numeric (no covered/total) keeps unknown counts
 * (q-mp-1084) and clamps pct to [0, 100] for display/rank parity with
 * report-coverage-map (q-mp-1133). Non-numeric / missing pct without
 * covered/total → null (q-mp-1018).
 *
 * @param {unknown} m
 * @returns {{ pct: number, covered: number | null, total: number | null } | null}
 */
export function resolveMetric(m) {
  if (m == null || typeof m !== 'object') {
    return { pct: 0, covered: 0, total: 0 };
  }
  const rec =
    /** @type {{ pct?: unknown, covered?: unknown, total?: unknown }} */ (m);
  const covered = rec.covered;
  const total = rec.total;
  const pct = rec.pct;
  const coveredOk = typeof covered === 'number' && Number.isFinite(covered);
  const totalOk = typeof total === 'number' && Number.isFinite(total);

  // q-mp-1033: covered/total win over contradictory (or matching) numeric pct.
  // q-mp-1083: clamp covered ≤ total before derive (no >100% rank).
  if (coveredOk && totalOk) {
    const t = Math.max(0, total);
    const c = Math.min(t, Math.max(0, covered));
    const derived = t === 0 ? 100 : (100 * c) / t;
    return { pct: derived, covered: c, total: t };
  }

  if (typeof pct === 'number' && Number.isFinite(pct)) {
    // q-mp-1084: do not invent 0 for missing covered/total on pct-only rows.
    // q-mp-1133: clamp pct-only values to [0, 100] (match report-coverage-map).
    return {
      pct: Math.min(100, Math.max(0, pct)),
      covered: coveredOk ? covered : null,
      total: totalOk ? total : null,
    };
  }

  return null;
}

/**
 * Build rank rows from a parsed coverage-summary.json object.
 * @param {Record<string, unknown>} raw
 * @throws {InvalidCoverageMetricError} when a matching engine row has
 *   missing/non-numeric pct that cannot be derived (q-mp-1018)
 */
export function collectEngineRows(raw) {
  /** @type {Map<string, {
   *   game: string,
   *   kind: string,
   *   file: string,
   *   linePct: number,
   *   lineCov: number | null,
   *   lineTot: number | null,
   *   branchPct: number,
   *   branchCov: number | null,
   *   branchTot: number | null,
   * }>} */
  const byFile = new Map();
  for (const [filePath, stats] of Object.entries(raw)) {
    if (filePath === 'total') continue;
    const norm = filePath.replace(/\\/g, '/');
    const m = norm.match(ENGINE_RE);
    if (!m) continue;
    const game = m[1];
    const kind = m[2];
    if (norm.includes('/ai')) continue;
    const s = /** @type {{ lines?: unknown, branches?: unknown }} */ (stats);
    // q-mp-1207: last `src/games/` wins (nested abs keys with earlier markers).
    const marker = 'src/games/';
    const markerIdx = norm.lastIndexOf(marker);
    const file = markerIdx >= 0 ? norm.slice(markerIdx) : norm;
    const lines = resolveMetric(s?.lines);
    const branches = resolveMetric(s?.branches);
    if (!lines || !branches) {
      throw new InvalidCoverageMetricError(file);
    }
    // q-mp-1207: one row per normalized engine file; later summary key wins.
    byFile.set(file, {
      game,
      kind,
      file,
      linePct: lines.pct,
      lineCov: lines.covered,
      lineTot: lines.total,
      branchPct: branches.pct,
      branchCov: branches.covered,
      branchTot: branches.total,
    });
  }
  const rows = [...byFile.values()];
  rows.sort((a, b) => a.branchPct - b.branchPct || a.linePct - b.linePct);
  return rows;
}

/**
 * Format the rank table + per-game section (byte-stable vs prior script output).
 * @param {ReturnType<typeof collectEngineRows>} rows
 */
export function formatRankOutput(rows) {
  const lines = [];
  lines.push(
    ['rank', 'file', 'line%', 'lines', 'branch%', 'branches'].join('\t')
  );
  rows.forEach((r, i) => {
    lines.push(
      [
        i + 1,
        r.file,
        r.linePct.toFixed(2),
        formatCounts(r.lineCov, r.lineTot),
        r.branchPct.toFixed(2),
        formatCounts(r.branchCov, r.branchTot),
      ].join('\t')
    );
  });

  const byGame = new Map();
  for (const r of rows) {
    if (!byGame.has(r.game)) byGame.set(r.game, []);
    byGame.get(r.game).push(r);
  }

  lines.push('');
  lines.push('--- per-game (rules.ts preferred; companions listed) ---');
  const games = [...byGame.keys()].sort((a, b) => {
    const ar =
      byGame.get(a).find((x) => x.kind === 'rules') ?? byGame.get(a)[0];
    const br =
      byGame.get(b).find((x) => x.kind === 'rules') ?? byGame.get(b)[0];
    return ar.branchPct - br.branchPct;
  });
  for (const g of games) {
    const files = byGame.get(g);
    const primary = files.find((x) => x.kind === 'rules') ?? files[0];
    lines.push(
      `${g}\trules-branch ${primary.branchPct.toFixed(2)}% (${formatCounts(primary.branchCov, primary.branchTot)})\tline ${primary.linePct.toFixed(2)}% (${formatCounts(primary.lineCov, primary.lineTot)})`
    );
    for (const f of files.filter((x) => x !== primary)) {
      lines.push(
        `  + ${f.kind}\tbranch ${f.branchPct.toFixed(2)}%\tline ${f.linePct.toFixed(2)}%`
      );
    }
  }
  return lines.join('\n');
}

/**
 * CLI entry. Returns exit code (does not call process.exit).
 * @param {string[]} argv process.argv.slice(2)
 * @param {{ log?: (s: string) => void, error?: (s: string) => void, existsSync?: (p: string) => boolean, readFileSync?: (p: string, enc: string) => string, cwd?: string }} [io]
 */
export function main(argv = process.argv.slice(2), io = {}) {
  const log = io.log ?? ((s) => console.log(s));
  const error = io.error ?? ((s) => console.error(s));
  const existsSync = io.existsSync ?? ((p) => fs.existsSync(p));
  const readFileSync = io.readFileSync ?? ((p, enc) => fs.readFileSync(p, enc));
  const cwd = io.cwd ?? process.cwd();

  const parsed = parseArgs(argv);
  if (!parsed.ok) {
    error(parsed.message);
    error(HELP.trimEnd());
    return 2;
  }
  if (parsed.help) {
    log(HELP.trimEnd());
    return 0;
  }

  const summaryPath = resolveSummaryPath(parsed.summaryPath, cwd);
  if (!existsSync(summaryPath)) {
    error(missingSummaryMessage(summaryPath));
    return 2;
  }

  let raw;
  try {
    raw = JSON.parse(readFileSync(summaryPath, 'utf8'));
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    error(`error: failed to read coverage summary: ${summaryPath}\n${msg}`);
    error(USAGE);
    return 2;
  }

  let rows;
  try {
    rows = collectEngineRows(raw);
  } catch (err) {
    if (err instanceof InvalidCoverageMetricError) {
      error(invalidMetricMessage(summaryPath, err.filePath));
      return 2;
    }
    throw err;
  }
  if (rows.length === 0) {
    error(emptyEngineSummaryMessage(summaryPath));
    return 2;
  }
  log(formatRankOutput(rows));
  return 0;
}

const isMain =
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  process.exitCode = main(process.argv.slice(2));
}
