#!/usr/bin/env node
/**
 * Rank non-AI engine modules from a vitest coverage-summary.json.
 *
 * Usage: node scripts/engine-coverage-rank.mjs <path/to/coverage-summary.json>
 *
 * Exit codes:
 *   0 — ranked table printed (or --help / -h)
 *   2 — missing/unreadable summary path, or flag-like argv (prints usage; no stack)
 *
 * Default path when omitted: coverage-engine-baseline/coverage-summary.json
 * (generated locally; not committed).
 *
 * CLI (q-mp-918): `--help`/`-h` exit 0 with usage; args starting with `-`
 * are rejected (exit 2) before path lookup — never treat `--help` as a path.
 * Missing-summary copy (q-mp-842) is unchanged.
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
 * Build rank rows from a parsed coverage-summary.json object.
 * @param {Record<string, unknown>} raw
 */
export function collectEngineRows(raw) {
  const rows = [];
  for (const [filePath, stats] of Object.entries(raw)) {
    if (filePath === 'total') continue;
    const norm = filePath.replace(/\\/g, '/');
    const m = norm.match(ENGINE_RE);
    if (!m) continue;
    const game = m[1];
    const kind = m[2];
    if (norm.includes('/ai')) continue;
    const s =
      /** @type {{ lines?: { pct: number, covered: number, total: number }, branches?: { pct: number, covered: number, total: number } }} */ (
        stats
      );
    const lines = s.lines ?? { pct: 0, covered: 0, total: 0 };
    const branches = s.branches ?? { pct: 0, covered: 0, total: 0 };
    rows.push({
      game,
      kind,
      file: norm.includes('src/games/')
        ? norm.slice(norm.indexOf('src/games/'))
        : norm,
      linePct: lines.pct,
      lineCov: lines.covered,
      lineTot: lines.total,
      branchPct: branches.pct,
      branchCov: branches.covered,
      branchTot: branches.total,
    });
  }
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
        `${r.lineCov}/${r.lineTot}`,
        r.branchPct.toFixed(2),
        `${r.branchCov}/${r.branchTot}`,
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
      `${g}\trules-branch ${primary.branchPct.toFixed(2)}% (${primary.branchCov}/${primary.branchTot})\tline ${primary.linePct.toFixed(2)}% (${primary.lineCov}/${primary.lineTot})`
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

  const rows = collectEngineRows(raw);
  log(formatRankOutput(rows));
  return 0;
}

const isMain =
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  process.exitCode = main(process.argv.slice(2));
}
