#!/usr/bin/env node
/**
 * Knip unused-export drift reporter (report-only) — q-mp-118.
 *
 * Runs pinned knip@5.88.1 against committed knip.json, compares counts to
 * docs/dev/knip-baseline.json, and emits GitHub Actions annotations when
 * unused surface grows. Default exit 0 (never fails main CI jobs).
 *
 * Tip-owner may later set "enforce": true in the baseline (or pass --fail)
 * to ratchet growth; ratchets only go down.
 *
 * Usage:
 *   npm run report:knip
 *   npm run report:knip -- --json
 *   npm run report:knip -- --fail          # opt-in exit 1 on growth or knip.error (not CI default)
 *   npm run report:knip -- --write-baseline  # refresh docs/dev/knip-baseline.json
 *   npm run report:knip -- --help          # usage; unknown flags exit 2
 *
 * Full inventory (knip + CSS + helpers): npm run report:dead-code
 * Docs: docs/dev/knip-report.md
 */

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const BASELINE_PATH = path.join(ROOT, 'docs/dev/knip-baseline.json');
const KNIP_VERSION = '5.88.1';

/** Metric keys tracked for unused-export / dead-code drift. */
export const METRIC_KEYS = [
  'unusedFiles',
  'unusedExports',
  'unusedTypes',
  'unusedDependencies',
  'unusedDevDependencies',
  'unlisted',
  'duplicates',
];

/**
 * Count items in a knip issue field (array or enumMembers-style object).
 * @param {unknown} value
 * @returns {number}
 */
export function countIssueField(value) {
  if (Array.isArray(value)) return value.length;
  if (value && typeof value === 'object') {
    let n = 0;
    for (const inner of Object.values(
      /** @type {Record<string, unknown>} */ (value)
    )) {
      n += Array.isArray(inner) ? inner.length : 1;
    }
    return n;
  }
  return 0;
}

/**
 * Summarize knip JSON reporter output into baseline metrics.
 *
 * Total on unexpected shapes (q-mp-1154 / q-mp-1106b): null/undefined/non-object
 * roots and non-array `issues` return `{ ok: false, message }` with an
 * unparseable error (same posture as baseline corrupt path / q-mp-1036) instead
 * of throwing or fail-open zeroed metrics under --fail.
 *
 * @param {unknown} knip
 * @returns {{ ok: true, metrics: Record<string, number> } | { ok: false, message: string }}
 */
export function summarizeKnip(knip) {
  if (knip == null || typeof knip !== 'object' || Array.isArray(knip)) {
    return {
      ok: false,
      message:
        'report:knip — knip reporter JSON unparseable: root must be a non-null object',
    };
  }
  /** @type {Record<string, unknown>} */
  const root = /** @type {Record<string, unknown>} */ (knip);
  // Knip JSON reporter uses issues: []; object / null / other non-array shapes
  // must not zero metrics (q-mp-1106b follow-up to folded #1311 / q-mp-1106).
  if (
    Object.prototype.hasOwnProperty.call(root, 'issues') &&
    !Array.isArray(root.issues)
  ) {
    return {
      ok: false,
      message:
        'report:knip — knip reporter JSON unparseable: issues must be an array',
    };
  }
  /** @type {Record<string, number>} */
  const metrics = {
    unusedFiles: 0,
    unusedExports: 0,
    unusedTypes: 0,
    unusedDependencies: 0,
    unusedDevDependencies: 0,
    unlisted: 0,
    duplicates: 0,
  };
  metrics.unusedFiles = Array.isArray(root.files) ? root.files.length : 0;
  const issues = Array.isArray(root.issues) ? root.issues : [];
  for (const issue of issues) {
    if (issue == null || typeof issue !== 'object') continue;
    const row = /** @type {Record<string, unknown>} */ (issue);
    metrics.unusedExports += countIssueField(row.exports);
    metrics.unusedTypes += countIssueField(row.types);
    metrics.unusedDependencies += countIssueField(row.dependencies);
    metrics.unusedDevDependencies += countIssueField(row.devDependencies);
    metrics.unlisted += countIssueField(row.unlisted);
    metrics.duplicates += countIssueField(row.duplicates);
  }
  return { ok: true, metrics };
}

/**
 * Require every METRIC_KEYS entry to be a finite integer ≥ 0 (q-mp-1036 + q-mp-1155).
 * Incomplete / null / "" / non-numeric values must not coerce to 0 and invent growth.
 * Negatives / fractions must not pass schema (hand-edited baseline hygiene).
 *
 * @param {unknown} metrics
 * @returns {{ ok: true, metrics: Record<string, number> } | { ok: false, message: string }}
 */
export function validateBaselineMetrics(metrics) {
  if (
    metrics == null ||
    typeof metrics !== 'object' ||
    Array.isArray(metrics)
  ) {
    return {
      ok: false,
      message:
        'report:knip — baseline metrics schema invalid: metrics must be an object with numeric METRIC_KEYS',
    };
  }
  /** @type {Record<string, unknown>} */
  const record = /** @type {Record<string, unknown>} */ (metrics);
  for (const key of METRIC_KEYS) {
    if (!Object.prototype.hasOwnProperty.call(record, key)) {
      return {
        ok: false,
        message: `report:knip — baseline metrics incomplete: missing numeric "${key}"`,
      };
    }
    const value = record[key];
    if (
      typeof value !== 'number' ||
      !Number.isFinite(value) ||
      !Number.isInteger(value) ||
      value < 0
    ) {
      return {
        ok: false,
        message: `report:knip — baseline metrics schema invalid: "${key}" must be a finite integer ≥ 0`,
      };
    }
  }
  return { ok: true, metrics: /** @type {Record<string, number>} */ (record) };
}

/**
 * Exit code when the knip runner returns an `.error` payload (q-mp-1313).
 *
 * Report-only default (CI `npm run report:knip`) stays exit 0 so a runner
 * failure cannot flake the report-only job. Opt-in `--fail` or baseline
 * `enforce: true` must not green-wash the same failure as success.
 *
 * Pure helper for hermetic unit tests — does not spawn knip / touch FS.
 *
 * @param {{ fail?: boolean, enforce?: boolean }} [opts]
 * @returns {0 | 1}
 */
export function exitCodeForKnipRunnerError(opts = {}) {
  return opts.fail || opts.enforce ? 1 : 0;
}

/**
 * Diff current metrics against baseline (ratchet-down posture).
 *
 * Non-finite baseline/current values must not green-wash as `same` (q-mp-1235):
 * `NaN - n` is NaN, so neither `delta > 0` nor `delta < 0` holds and every key
 * used to land in `same`. Fail closed with a schema error instead.
 *
 * @param {Record<string, number>} current
 * @param {Record<string, number>} baseline
 * @returns {{ ok: true, growth: Array<{key:string,baseline:number,current:number,delta:number}>, shrink: Array<{key:string,baseline:number,current:number,delta:number}>, same: string[] } | { ok: false, message: string }}
 */
export function diffMetrics(current, baseline) {
  /** @type {Array<{key:string,baseline:number,current:number,delta:number}>} */
  const growth = [];
  /** @type {Array<{key:string,baseline:number,current:number,delta:number}>} */
  const shrink = [];
  /** @type {string[]} */
  const same = [];
  for (const key of METRIC_KEYS) {
    const b = Number(baseline[key] ?? 0);
    const c = Number(current[key] ?? 0);
    if (!Number.isFinite(b) || !Number.isFinite(c)) {
      return {
        ok: false,
        message: `report:knip — diffMetrics schema invalid: "${key}" must be a finite number (baseline=${String(baseline[key])}, current=${String(current[key])})`,
      };
    }
    const delta = c - b;
    if (delta > 0) growth.push({ key, baseline: b, current: c, delta });
    else if (delta < 0) shrink.push({ key, baseline: b, current: c, delta });
    else same.push(key);
  }
  return { ok: true, growth, shrink, same };
}

/**
 * @returns {*}
 */
function runKnip() {
  // Pinned via npx (not a lockfile dep): knip→fast-glob→micromatch→braces
  // currently fails npm audit; keep the app lockfile at 0 vulnerabilities.
  const r = spawnSync(
    'npx',
    ['--yes', `knip@${KNIP_VERSION}`, '--reporter', 'json'],
    {
      cwd: ROOT,
      encoding: 'utf8',
      maxBuffer: 32 * 1024 * 1024,
      shell: process.platform === 'win32',
    }
  );
  const raw = (r.stdout || '').trim();
  if (!raw) {
    return {
      files: [],
      issues: [],
      error: (r.stderr || '').slice(0, 2000) || `knip exit ${r.status}`,
      status: r.status,
    };
  }
  try {
    const parsed = JSON.parse(raw);
    parsed.status = r.status;
    return parsed;
  } catch {
    const start = raw.indexOf('{');
    if (start >= 0) {
      try {
        const parsed = JSON.parse(raw.slice(start));
        parsed.status = r.status;
        return parsed;
      } catch {
        /* fall through */
      }
    }
    return {
      files: [],
      issues: [],
      error: 'Failed to parse knip JSON',
      rawHead: raw.slice(0, 500),
      status: r.status,
    };
  }
}

/**
 * Load docs/dev/knip-baseline.json.
 *
 * - Missing file → `{ kind: 'missing' }` (NOTICE + exit 0; compare skipped).
 * - Unparseable JSON → `{ kind: 'corrupt', message }` (exit 1; never "no baseline file").
 * - Parsed object with no `metrics` key / null metrics → `{ kind: 'absent-metrics' }`
 *   (leave q-mp-1019 `{}` → “no baseline file” alone).
 * - Present `metrics` missing keys or non-numeric → `{ kind: 'schema', message }` (exit 1).
 *
 * Leading UTF-8 BOM (U+FEFF) is stripped before parse so editor-saved baselines
 * are accepted (q-mp-1387). Mid-file FEFF is left alone. Non-BOM input is
 * unchanged (byte-identical parse result).
 *
 * @param {{
 *   existsSync?: typeof fs.existsSync,
 *   readFileSync?: typeof fs.readFileSync,
 *   baselinePath?: string,
 * }} [io] injectables for hermetic tests
 * @returns {{
 *   kind: 'missing'
 * } | {
 *   kind: 'corrupt' | 'schema',
 *   message: string
 * } | {
 *   kind: 'absent-metrics',
 *   doc: { knipVersion?: string, enforce?: boolean, metrics?: unknown, note?: string }
 * } | {
 *   kind: 'ok',
 *   doc: { knipVersion?: string, enforce?: boolean, metrics: Record<string, number>, note?: string },
 *   metrics: Record<string, number>
 * }}
 */
export function loadBaseline(io = {}) {
  const existsSync = io.existsSync ?? fs.existsSync;
  const readFileSync = io.readFileSync ?? fs.readFileSync;
  const baselinePath = io.baselinePath ?? BASELINE_PATH;
  if (!existsSync(baselinePath)) return { kind: 'missing' };
  let raw;
  try {
    raw = readFileSync(baselinePath, 'utf8');
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    return {
      kind: 'corrupt',
      message: `report:knip — baseline JSON unparseable at ${path.relative(ROOT, baselinePath)}: ${detail}`,
    };
  }
  // Strip a single leading UTF-8 BOM (q-mp-1387). Mid-file FEFF is left alone.
  if (raw.charCodeAt(0) === 0xfeff) {
    raw = raw.slice(1);
  }
  let doc;
  try {
    doc = JSON.parse(raw);
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    return {
      kind: 'corrupt',
      message: `report:knip — baseline JSON unparseable at ${path.relative(ROOT, baselinePath)}: ${detail}`,
    };
  }
  if (doc == null || typeof doc !== 'object' || Array.isArray(doc)) {
    return {
      kind: 'schema',
      message: `report:knip — baseline schema invalid at ${path.relative(ROOT, baselinePath)}: root must be an object`,
    };
  }
  /** @type {{ knipVersion?: string, enforce?: boolean, metrics?: unknown, note?: string }} */
  const baselineDoc = doc;
  // q-mp-1019 leave-alone: `{}` / missing metrics still behaves as “no baseline file”.
  if (!Object.prototype.hasOwnProperty.call(baselineDoc, 'metrics')) {
    return { kind: 'absent-metrics', doc: baselineDoc };
  }
  if (baselineDoc.metrics == null) {
    return { kind: 'absent-metrics', doc: baselineDoc };
  }
  const validated = validateBaselineMetrics(baselineDoc.metrics);
  if (!validated.ok) {
    return { kind: 'schema', message: validated.message };
  }
  return {
    kind: 'ok',
    doc: { ...baselineDoc, metrics: validated.metrics },
    metrics: validated.metrics,
  };
}

/**
 * @param {Record<string, number>} metrics
 * @param {boolean} enforce
 */
function writeBaseline(metrics, enforce) {
  const dir = path.dirname(BASELINE_PATH);
  fs.mkdirSync(dir, { recursive: true });
  const body = {
    knipVersion: KNIP_VERSION,
    enforce,
    note: 'Report-only unused-export drift baseline (q-mp-118). Set enforce:true only after tip-owner approval; ratchets only go down.',
    metrics,
  };
  fs.writeFileSync(BASELINE_PATH, `${JSON.stringify(body, null, 2)}\n`, 'utf8');
}

/**
 * @param {string} level notice|warning|error
 * @param {string} message
 */
function annotate(level, message) {
  if (process.env.GITHUB_ACTIONS === 'true') {
    // Escape newlines for workflow command payload
    const safe = message.replace(/\r?\n/g, '%0A');
    console.log(`::${level}::${safe}`);
  } else {
    const tag = level.toUpperCase();
    console.log(`[${tag}] ${message}`);
  }
}

const KNOWN_FLAGS = new Set(['--json', '--fail', '--write-baseline']);

/**
 * @param {typeof console.log} [write]
 */
function printUsage(write = console.log) {
  write(`Usage: node scripts/report-knip.mjs [options]

Options:
  --json              Machine-readable metrics + diff
  --fail              Opt-in exit 1 on unused growth (not CI default)
  --write-baseline    Refresh docs/dev/knip-baseline.json
  -h, --help          Show help

Unknown flags exit 2.`);
}

/**
 * @param {string[]} argv
 */
function parseArgs(argv) {
  for (const a of argv) {
    if (a === '--help' || a === '-h') {
      printUsage(console.log);
      process.exit(0);
    }
    if (a.startsWith('-') && !KNOWN_FLAGS.has(a)) {
      console.error(`Unknown flag: ${a}`);
      printUsage(console.error);
      process.exit(2);
    }
  }
  return {
    json: argv.includes('--json'),
    fail: argv.includes('--fail'),
    writeBaseline: argv.includes('--write-baseline'),
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  console.log(`report:knip — running knip@${KNIP_VERSION} (knip.json)…`);
  const knip = runKnip();
  const loaded = loadBaseline();
  const baselineDoc =
    loaded.kind === 'ok' || loaded.kind === 'absent-metrics'
      ? loaded.doc
      : null;
  const enforce = Boolean(args.fail || baselineDoc?.enforce);

  if (knip.error) {
    // q-mp-1313: --fail / baseline.enforce must not exit 0 on runner failure.
    // Default report-only (CI) still warns + exits 0.
    const level = enforce ? 'error' : 'warning';
    annotate(
      level,
      `knip report failed${enforce ? '' : ' (report-only)'}: ${knip.error}`
    );
    if (args.json) {
      console.log(
        JSON.stringify({ error: knip.error, metrics: null }, null, 2)
      );
    }
    const code = exitCodeForKnipRunnerError({
      fail: args.fail,
      enforce: Boolean(baselineDoc?.enforce),
    });
    if (code !== 0) {
      console.error(
        `report:knip — knip runner failed while enforce/fail is on: ${knip.error}`
      );
    }
    process.exit(code);
  }

  const summarized = summarizeKnip(knip);
  if (!summarized.ok) {
    // Unexpected knip reporter shape: fail closed like baseline unparseable (q-mp-1036 / 1106b).
    console.error(summarized.message);
    process.exit(1);
  }
  const metrics = summarized.metrics;
  // Corrupt / incomplete baselines must fail before any fake growth WARNING (q-mp-1036).
  // --write-baseline may still refresh a broken file; validate only when comparing.
  if (
    !args.writeBaseline &&
    (loaded.kind === 'corrupt' || loaded.kind === 'schema')
  ) {
    console.error(loaded.message);
    process.exit(1);
  }
  const baselineMetrics = loaded.kind === 'ok' ? loaded.metrics : null;

  if (args.writeBaseline) {
    writeBaseline(metrics, Boolean(baselineDoc?.enforce));
    console.log(`report:knip — wrote ${path.relative(ROOT, BASELINE_PATH)}`);
  }

  console.log('report:knip — current metrics:');
  for (const key of METRIC_KEYS) {
    console.log(`  ${key}: ${metrics[key]}`);
  }

  /** @type {Extract<ReturnType<typeof diffMetrics>, { ok: true }> | null} */
  let diff = null;
  if (baselineMetrics) {
    const diffResult = diffMetrics(metrics, baselineMetrics);
    if (!diffResult.ok) {
      // Defensive: loadBaseline + validateBaselineMetrics already reject
      // non-finite metrics; keep fail-closed if a caller bypasses that path.
      console.error(diffResult.message);
      process.exit(1);
    }
    diff = diffResult;
    if (diff.growth.length === 0) {
      annotate(
        'notice',
        `knip unused surface within baseline (exports=${metrics.unusedExports}, types=${metrics.unusedTypes}, files=${metrics.unusedFiles})`
      );
    } else {
      const parts = diff.growth.map(
        (g) => `${g.key} ${g.baseline}→${g.current} (+${g.delta})`
      );
      annotate(
        'warning',
        `knip unused growth vs baseline (report-only): ${parts.join('; ')}`
      );
    }
    for (const s of diff.shrink) {
      annotate(
        'notice',
        `knip unused shrink: ${s.key} ${s.baseline}→${s.current} (${s.delta})`
      );
    }
  } else if (loaded.kind === 'missing' || loaded.kind === 'absent-metrics') {
    annotate(
      'notice',
      `knip report (no baseline file): exports=${metrics.unusedExports}, types=${metrics.unusedTypes}, files=${metrics.unusedFiles}`
    );
  } else if (args.writeBaseline) {
    // Refreshed a corrupt/schema-invalid file; no prior baseline to compare.
    annotate(
      'notice',
      `knip report (baseline rewritten): exports=${metrics.unusedExports}, types=${metrics.unusedTypes}, files=${metrics.unusedFiles}`
    );
  }

  if (args.json) {
    console.log(
      JSON.stringify(
        {
          knipVersion: KNIP_VERSION,
          enforce,
          metrics,
          baseline: baselineMetrics,
          growth: diff?.growth ?? [],
          shrink: diff?.shrink ?? [],
        },
        null,
        2
      )
    );
  }

  // Report-only default: never fail CI. Opt-in --fail or baseline.enforce for ratchet.
  if (enforce && diff && diff.growth.length > 0) {
    console.error(
      'report:knip — unused growth while enforce/fail is on (ratchet only goes down)'
    );
    process.exit(1);
  }
  process.exit(0);
}

const isMain =
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (isMain) {
  main();
}
