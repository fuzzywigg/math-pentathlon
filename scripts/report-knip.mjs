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
    for (const inner of Object.values(/** @type {Record<string, unknown>} */ (value))) {
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
 * @returns {{ knipVersion: string, enforce: boolean, metrics: Record<string, number>, note?: string } | null}
 */
function loadBaseline() {
  if (!fs.existsSync(BASELINE_PATH)) return null;
  try {
    return JSON.parse(fs.readFileSync(BASELINE_PATH, 'utf8'));
  } catch {
    return null;
  }
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
    note:
      'Report-only unused-export drift baseline (q-mp-118). Set enforce:true only after tip-owner approval; ratchets only go down.',
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

function parseArgs(argv) {
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
    annotate(
      'warning',
      `knip report failed (report-only): ${knip.error}`
    );
    if (args.json) {
      console.log(JSON.stringify({ error: knip.error, metrics: null }, null, 2));
    }
    process.exit(0);
  }

  const metrics = summarizeKnip(knip);
  const baselineDoc = loadBaseline();
  const baselineMetrics = baselineDoc?.metrics ?? null;
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
  } else {
    annotate(
      'notice',
      `knip report (no baseline file): exports=${metrics.unusedExports}, types=${metrics.unusedTypes}, files=${metrics.unusedFiles}`
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
