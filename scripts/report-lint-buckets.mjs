#!/usr/bin/env node
/**
 * Lint-bucket summary (report-only) — q-mp-280.
 *
 * Runs the same ceiling-rule overlay probe as scripts/check-lint-ratchet.mjs
 * and prints per-rule totals plus path buckets / densest files. Never writes
 * docs/dev/lint-ratchet-ceilings.json and is not wired into CI gates.
 *
 * Usage:
 *   npm run report:lint-buckets
 *   node scripts/report-lint-buckets.mjs
 *   npm run report:lint-buckets -- --rule curly
 *   npm run report:lint-buckets -- --top 5
 *   npm run report:lint-buckets -- --json
 *
 * Docs: docs/dev/lint-bucket-report.md
 */

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CEILINGS_PATH = path.join(ROOT, 'docs/dev/lint-ratchet-ceilings.json');

/** @typedef {{ rules: Record<string, number>, notes?: string }} CeilingFile */

/**
 * @param {string[]} argv
 * @returns {{ rule: string | null, top: number, json: boolean, help: boolean }}
 */
function parseArgs(argv) {
  /** @type {{ rule: string | null, top: number, json: boolean, help: boolean }} */
  const opts = { rule: null, top: 10, json: false, help: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      opts.help = true;
    } else if (arg === '--json') {
      opts.json = true;
    } else if (arg === '--rule') {
      opts.rule = argv[i + 1] ?? null;
      i += 1;
    } else if (arg.startsWith('--rule=')) {
      opts.rule = arg.slice('--rule='.length) || null;
    } else if (arg === '--top') {
      const n = Number.parseInt(argv[i + 1] ?? '', 10);
      if (Number.isFinite(n) && n > 0) opts.top = n;
      i += 1;
    } else if (arg.startsWith('--top=')) {
      const n = Number.parseInt(arg.slice('--top='.length), 10);
      if (Number.isFinite(n) && n > 0) opts.top = n;
    }
  }
  return opts;
}

/**
 * Map an absolute eslint filePath to a stable repo-relative path bucket.
 * Buckets mirror how backlog/triage agents hand-roll overlays.
 * @param {string} filePath
 * @returns {{ rel: string, bucket: string }}
 */
export function pathBucket(filePath) {
  const rel = path.relative(ROOT, filePath).split(path.sep).join('/');
  if (!rel.startsWith('src/')) {
    return { rel, bucket: '(outside-src)' };
  }
  const parts = rel.split('/');
  // Files directly under src/ (e.g. src/main.ts) → bucket "src/"
  if (parts.length === 2) {
    return { rel, bucket: 'src/' };
  }
  // src/<area>/... → src/<area> (games/core get one more segment for triage)
  if (parts.length >= 3 && parts[1]) {
    if (parts[1] === 'games' && parts[2]) {
      return { rel, bucket: `src/games/${parts[2]}` };
    }
    if (parts[1] === 'ui' && parts[2] === 'three') {
      return { rel, bucket: 'src/ui/three' };
    }
    if (parts[1] === 'core' && parts[2]) {
      return { rel, bucket: `src/core/${parts[2]}` };
    }
    return { rel, bucket: `src/${parts[1]}` };
  }
  return { rel, bucket: 'src/' };
}

/**
 * @param {Array<{ filePath: string, messages: Array<{ ruleId: string | null }> }>} report
 * @param {string[]} ruleIds
 * @returns {Record<string, { total: number, buckets: Record<string, number>, files: Record<string, number> }>}
 */
export function summarizeBuckets(report, ruleIds) {
  /** @type {Record<string, { total: number, buckets: Record<string, number>, files: Record<string, number> }>} */
  const out = {};
  for (const rule of ruleIds) {
    out[rule] = { total: 0, buckets: {}, files: {} };
  }
  for (const file of report) {
    const { rel, bucket } = pathBucket(file.filePath);
    for (const message of file.messages) {
      if (!message.ruleId || !(message.ruleId in out)) continue;
      const entry = out[message.ruleId];
      entry.total += 1;
      entry.buckets[bucket] = (entry.buckets[bucket] ?? 0) + 1;
      entry.files[rel] = (entry.files[rel] ?? 0) + 1;
    }
  }
  return out;
}

/**
 * @param {Record<string, number>} counts
 * @param {number} limit
 * @returns {Array<[string, number]>}
 */
function topEntries(counts, limit) {
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit);
}

function printHelp() {
  console.log(`Lint-bucket summary (report-only) — q-mp-280

Usage:
  npm run report:lint-buckets
  node scripts/report-lint-buckets.mjs [--rule <id>] [--top N] [--json]

Options:
  --rule <id>   Only print one ceiling rule (exact eslint ruleId)
  --top N       Max densest files / buckets per rule (default 10)
  --json        Machine-readable summary (still exit 0)
  -h, --help    Show this help

Probe: same overlay as scripts/check-lint-ratchet.mjs (read-only; no ceiling writes).
Docs: docs/dev/lint-bucket-report.md`);
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) {
    printHelp();
    process.exit(0);
  }

  /** @type {CeilingFile} */
  const ceilings = JSON.parse(fs.readFileSync(CEILINGS_PATH, 'utf8'));
  const ruleIds = Object.keys(ceilings.rules);
  if (opts.rule && !ruleIds.includes(opts.rule)) {
    console.error(
      `Unknown --rule ${opts.rule}. Known ceiling rules:\n  ${ruleIds.join('\n  ')}`
    );
    process.exit(1);
  }

  // Identical overlay to check-lint-ratchet.mjs (keep in sync when ceilings grow).
  const probeConfigPath = path.join(ROOT, '.eslint.ratchet.probe.config.js');
  const probeSource = `
import base from './eslint.config.js';

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...base,
  {
    rules: {
      curly: ['error', 'all'],
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-confusing-void-expression': 'error',
      radix: 'error',
      'default-case': 'error',
      'no-duplicate-imports': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/return-await': ['error', 'always'],
    },
  },
];
`;

  fs.writeFileSync(probeConfigPath, probeSource, 'utf8');

  try {
    const result = spawnSync(
      'npx',
      [
        'eslint',
        'src',
        '-c',
        probeConfigPath,
        '--format',
        'json',
        '--no-error-on-unmatched-pattern',
      ],
      {
        cwd: ROOT,
        encoding: 'utf8',
        maxBuffer: 64 * 1024 * 1024,
        shell: process.platform === 'win32',
      }
    );

    /** @type {Array<{ filePath: string, messages: Array<{ ruleId: string | null }> }>} */
    let report;
    try {
      report = JSON.parse(result.stdout || '[]');
    } catch {
      console.error('report:lint-buckets failed to parse eslint JSON output');
      console.error((result.stderr || result.stdout || '').slice(0, 4000));
      process.exit(1);
    }

    const summary = summarizeBuckets(report, ruleIds);
    const selected = opts.rule ? [opts.rule] : ruleIds;

    if (opts.json) {
      /** @type {Record<string, unknown>} */
      const payload = {
        task: 'q-mp-280',
        ceilingsPath: 'docs/dev/lint-ratchet-ceilings.json',
        ceilings: ceilings.rules,
        rules: {},
      };
      for (const rule of selected) {
        const entry = summary[rule];
        payload.rules[rule] = {
          total: entry.total,
          ceiling: ceilings.rules[rule],
          headroom: ceilings.rules[rule] - entry.total,
          buckets: Object.fromEntries(topEntries(entry.buckets, opts.top)),
          files: Object.fromEntries(topEntries(entry.files, opts.top)),
        };
      }
      console.log(JSON.stringify(payload, null, 2));
      process.exit(0);
    }

    console.log('Lint bucket summary (report-only; ceilings unchanged)');
    console.log(`Ceilings: ${path.relative(ROOT, CEILINGS_PATH)}`);
    console.log('');

    for (const rule of selected) {
      const entry = summary[rule];
      const ceiling = ceilings.rules[rule];
      const headroom = ceiling - entry.total;
      const headroomNote =
        headroom > 0
          ? ` (−${headroom} headroom; lower the ceiling after cleanup)`
          : headroom < 0
            ? ` (+${-headroom} OVER ceiling)`
            : '';
      console.log(
        `${rule}: ${entry.total} / ceiling ${ceiling}${headroomNote}`
      );

      const buckets = topEntries(entry.buckets, opts.top);
      if (buckets.length === 0) {
        console.log('  (no hits)');
        console.log('');
        continue;
      }
      console.log('  path buckets:');
      for (const [bucket, count] of buckets) {
        console.log(`    ${String(count).padStart(4)}  ${bucket}`);
      }
      console.log(`  densest files (top ${opts.top}):`);
      for (const [file, count] of topEntries(entry.files, opts.top)) {
        console.log(`    ${String(count).padStart(4)}  ${file}`);
      }
      console.log('');
    }

    console.log(
      'Report-only: no ceiling writes. Use npm run lint:ratchet to enforce ceilings.'
    );
    process.exit(0);
  } finally {
    try {
      fs.unlinkSync(probeConfigPath);
    } catch {
      // ignore cleanup errors
    }
  }
}

const isMain =
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  main();
}
