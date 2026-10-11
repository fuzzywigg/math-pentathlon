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
 *   npm run report:knip -- --fail          # opt-in exit 1 on growth (not CI default)
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
 * @param {*} knip
 * @returns {Record<string, number>}
 */
export function summarizeKnip(knip) {
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
  metrics.unusedFiles = (knip.files || []).length;
  for (const issue of knip.issues || []) {
    metrics.unusedExports += countIssueField(issue.exports);
    metrics.unusedTypes += countIssueField(issue.types);
    metrics.unusedDependencies += countIssueField(issue.dependencies);
    metrics.unusedDevDependencies += countIssueField(issue.devDependencies);
    metrics.unlisted += countIssueField(issue.unlisted);
    metrics.duplicates += countIssueField(issue.duplicates);
  }
  return metrics;
}

/**
 * Require every METRIC_KEYS entry to be a finite number (q-mp-1036).
 * Incomplete / null / "" / non-numeric values must not coerce to 0 and invent growth.
 *
 * @param {unknown} metrics
 * @returns {{ ok: true, metrics: Record<string, number> } | { ok: false, message: string }}
 */
export function validateBaselineMetrics(metrics) {
  if (metrics == null || typeof metrics !== 'object' || Array.isArray(metrics)) {
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
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      return {
        ok: false,
        message: `report:knip — baseline metrics schema invalid: "${key}" must be a finite number`,
      };
    }
  }
  return { ok: true, metrics: /** @type {Record<string, number>} */ (record) };
}

/**
 * @param {Record<string, number>} current
 * @param {Record<string, number>} baseline
 * @returns {{ growth: Array<{key:string,baseline:number,current:number,delta:number}>, shrink: Array<{key:string,baseline:number,current:number,delta:number}>, same: string[] }}
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
    const delta = c - b;
    if (delta > 0) growth.push({ key, baseline: b, current: c, delta });
    else if (delta < 0) shrink.push({ key, baseline: b, current: c, delta });
    else same.push(key);
  }
  return { growth, shrink, same };
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
function loadBaseline() {
  if (!fs.existsSync(BASELINE_PATH)) return { kind: 'missing' };
  let doc;
  try {
    doc = JSON.parse(fs.readFileSync(BASELINE_PATH, 'utf8'));
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    return {
      kind: 'corrupt',
      message: `report:knip — baseline JSON unparseable at ${path.relative(ROOT, BASELINE_PATH)}: ${detail}`,
    };
  }
  if (doc == null || typeof doc !== 'object' || Array.isArray(doc)) {
    return {
      kind: 'schema',
      message: `report:knip — baseline schema invalid at ${path.relative(ROOT, BASELINE_PATH)}: root must be an object`,
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
  if (knip.error) {
    annotate('warning', `knip report failed (report-only): ${knip.error}`);
    if (args.json) {
      console.log(
        JSON.stringify({ error: knip.error, metrics: null }, null, 2)
      );
    }
    process.exit(0);
  }

  const metrics = summarizeKnip(knip);
  const loaded = loadBaseline();
  // Corrupt / incomplete baselines must fail before any fake growth WARNING (q-mp-1036).
  // --write-baseline may still refresh a broken file; validate only when comparing.
  if (
    !args.writeBaseline &&
    (loaded.kind === 'corrupt' || loaded.kind === 'schema')
  ) {
    console.error(loaded.message);
    process.exit(1);
  }
  const baselineDoc =
    loaded.kind === 'ok' || loaded.kind === 'absent-metrics' ? loaded.doc : null;
  const baselineMetrics = loaded.kind === 'ok' ? loaded.metrics : null;
  const enforce = Boolean(args.fail || baselineDoc?.enforce);

  if (args.writeBaseline) {
    writeBaseline(metrics, Boolean(baselineDoc?.enforce));
    console.log(`report:knip — wrote ${path.relative(ROOT, BASELINE_PATH)}`);
  }

  console.log('report:knip — current metrics:');
  for (const key of METRIC_KEYS) {
    console.log(`  ${key}: ${metrics[key]}`);
  }

  /** @type {ReturnType<typeof diffMetrics> | null} */
  let diff = null;
  if (baselineMetrics) {
    diff = diffMetrics(metrics, baselineMetrics);
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
