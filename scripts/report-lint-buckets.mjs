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
 *   npm run report:lint-buckets -- --help   # usage; unknown flags exit 2
 *
 * Duplicate `--top` / `--rule` (space or `=` form) exit 2 (q-mp-1360) — never
 * last-wins. Empty eslint stdout / fatal probe exits fail closed (q-mp-1317) —
 * never treat missing JSON as `[]` all-zero totals. Leave check-lint-ratchet
 * alone.
 *
 * Docs: docs/dev/lint-bucket-report.md
 */

import { randomBytes } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CEILINGS_PATH = path.join(ROOT, 'docs/dev/lint-ratchet-ceilings.json');

/** @typedef {{ rules: Record<string, unknown>, notes?: string }} CeilingFile */

/**
 * Unique probe config path so concurrent lint:ratchet / report:lint-buckets
 * cannot clobber or unlink the same file mid-eslint (q-mp-1275).
 * Kept under the repo root so flat-config relative `./eslint.config.js`
 * resolves; always delete in `finally` (before process.exit).
 *
 * @param {string} [root]
 * @param {number} [pid]
 * @param {string} [entropy]
 * @returns {string}
 */
export function makeLintRatchetProbeConfigPath(
  root = ROOT,
  pid = process.pid,
  entropy = randomBytes(6).toString('hex')
) {
  return path.join(root, `.eslint.ratchet.probe.${pid}.${entropy}.config.js`);
}

/**
 * Coerce a ceiling value to a finite number for headroom math (q-mp-1254).
 * Accepts finite numbers and finite numeric strings; rejects NaN / Infinity /
 * non-numeric strings / other types so `'abc' - total` cannot yield silent
 * blank headroom notes.
 *
 * @param {unknown} value
 * @returns {number | null}
 */
export function coerceCeilingNumber(value) {
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
 * Resolve printable / JSON headroom for one rule against its ceiling.
 * Non-numeric ceilings → explicit skip (no NaN arithmetic).
 *
 * @param {unknown} ceilingRaw
 * @param {number} total
 * @returns {| { ok: true, ceiling: number, headroom: number, note: string }
 *   | { ok: false, ceiling: unknown, headroom: null, note: string, error: string }}
 */
export function resolveRuleHeadroom(ceilingRaw, total) {
  const ceiling = coerceCeilingNumber(ceilingRaw);
  if (ceiling == null) {
    return {
      ok: false,
      ceiling: ceilingRaw,
      headroom: null,
      note: ' (invalid ceiling: non-numeric; headroom skipped)',
      error: 'non-numeric ceiling',
    };
  }
  const headroom = ceiling - total;
  const note =
    headroom > 0
      ? ` (−${headroom} headroom; lower the ceiling after cleanup)`
      : headroom < 0
        ? ` (+${-headroom} OVER ceiling)`
        : '';
  return { ok: true, ceiling, headroom, note };
}

/**
 * Parse eslint `--format json` spawnSync output for report:lint-buckets (q-mp-1317).
 *
 * Empty / missing stdout must not become `[]` (that printed full headroom /
 * all-zero totals on probe crash). ESLint exit **1** with a valid JSON array
 * (rule hits) remains ok — that is the normal report path. Fail closed on
 * spawn errors, signal kills, eslint fatal exit (≥2), empty stdout, non-JSON,
 * or non-array JSON.
 *
 * @param {{
 *   status?: number | null,
 *   stdout?: string | null,
 *   stderr?: string | null,
 *   error?: Error | null,
 *   signal?: string | null,
 * }} result
 * @returns {| { ok: true, report: Array<{ filePath: string, messages: Array<{ ruleId: string | null }> }> }
 *   | { ok: false, message: string, detail: string }}
 */
export function parseEslintJsonReport(result) {
  if (result.error) {
    return {
      ok: false,
      message: 'report:lint-buckets: eslint probe failed to start',
      detail: String(result.error.message || result.error).slice(0, 4000),
    };
  }
  if (result.status == null && result.signal) {
    return {
      ok: false,
      message: `report:lint-buckets: eslint probe killed by signal ${result.signal}`,
      detail: (result.stderr || result.stdout || '').slice(0, 4000),
    };
  }

  const stdout = typeof result.stdout === 'string' ? result.stdout : '';
  const trimmed = stdout.trim();
  if (trimmed === '') {
    const statusLabel = result.status == null ? 'null' : String(result.status);
    return {
      ok: false,
      message: `report:lint-buckets: empty eslint stdout (exit ${statusLabel}; refusing all-zero totals)`,
      detail: (result.stderr || '').slice(0, 4000),
    };
  }

  // ESLint uses exit 2 for fatal config / engine errors. Exit 1 means rule
  // hits with JSON still on stdout — keep that as a successful report.
  if (typeof result.status === 'number' && result.status >= 2) {
    return {
      ok: false,
      message: `report:lint-buckets: eslint probe failed (exit ${result.status})`,
      detail: (result.stderr || stdout).slice(0, 4000),
    };
  }

  /** @type {unknown} */
  let parsed;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    return {
      ok: false,
      message: 'report:lint-buckets failed to parse eslint JSON output',
      detail: (result.stderr || stdout).slice(0, 4000),
    };
  }
  if (!Array.isArray(parsed)) {
    return {
      ok: false,
      message: 'report:lint-buckets: eslint JSON was not an array',
      detail: (result.stderr || stdout).slice(0, 4000),
    };
  }
  return {
    ok: true,
    report:
      /** @type {Array<{ filePath: string, messages: Array<{ ruleId: string | null }> }>} */ (
        parsed
      ),
  };
}

/**
 * True when the next argv token cannot be a value for `--top` / `--rule`
 * (missing, empty, or another flag). q-mp-870: do not eat `--json` etc.
 * @param {string | undefined} value
 */
function isMissingOrFlagLike(value) {
  return value === undefined || value === '' || value.startsWith('-');
}

/**
 * Positive integer for `--top` (q-mp-968). Rejects 0, negatives, non-integers,
 * and non-numeric tokens instead of silently keeping the default.
 * @param {string} raw
 * @returns {{ ok: true, value: number } | { ok: false, message: string }}
 */
function parsePositiveIntTop(raw) {
  if (!/^\d+$/.test(raw)) {
    return {
      ok: false,
      message:
        'Missing or invalid value for --top (expected a positive integer).',
    };
  }
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1) {
    return {
      ok: false,
      message:
        'Missing or invalid value for --top (expected a positive integer).',
    };
  }
  return { ok: true, value: n };
}

/**
 * @param {string[]} argv
 * @returns {| { ok: true, rule: string | null, top: number, json: boolean, help: boolean }
 *   | { ok: false, message: string }}
 */
export function parseArgs(argv) {
  /** @type {{ rule: string | null, top: number, json: boolean, help: boolean }} */
  const opts = { rule: null, top: 10, json: false, help: false };
  // q-mp-1360: reject duplicate --top / --rule (space or = form); no last-wins.
  let sawTop = false;
  let sawRule = false;
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      opts.help = true;
    } else if (arg === '--json') {
      opts.json = true;
    } else if (arg === '--rule') {
      if (sawRule) {
        return { ok: false, message: 'Duplicate --rule' };
      }
      const value = argv[i + 1];
      if (isMissingOrFlagLike(value)) {
        return {
          ok: false,
          message: 'Missing or invalid value for --rule (expected a rule id).',
        };
      }
      opts.rule = value;
      sawRule = true;
      i += 1;
    } else if (arg.startsWith('--rule=')) {
      // q-mp-968: empty `--rule=` must not silently mean "all rules".
      if (sawRule) {
        return { ok: false, message: 'Duplicate --rule' };
      }
      const value = arg.slice('--rule='.length);
      if (value === '') {
        return {
          ok: false,
          message: 'Missing or invalid value for --rule (expected a rule id).',
        };
      }
      opts.rule = value;
      sawRule = true;
    } else if (arg === '--top') {
      if (sawTop) {
        return { ok: false, message: 'Duplicate --top' };
      }
      const value = argv[i + 1];
      if (isMissingOrFlagLike(value)) {
        return {
          ok: false,
          message:
            'Missing or invalid value for --top (expected a positive integer).',
        };
      }
      const parsedTop = parsePositiveIntTop(value);
      if (!parsedTop.ok) return parsedTop;
      opts.top = parsedTop.value;
      sawTop = true;
      i += 1;
    } else if (arg.startsWith('--top=')) {
      if (sawTop) {
        return { ok: false, message: 'Duplicate --top' };
      }
      const parsedTop = parsePositiveIntTop(arg.slice('--top='.length));
      if (!parsedTop.ok) return parsedTop;
      opts.top = parsedTop.value;
      sawTop = true;
    } else if (arg.startsWith('-')) {
      // q-mp-943: reject typos / unknown flags before the eslint probe.
      return { ok: false, message: `Unknown flag: ${arg}` };
    }
  }
  return { ok: true, ...opts };
}

/**
 * Map an absolute eslint filePath to a stable repo-relative path bucket.
 * Buckets mirror how backlog/triage agents hand-roll overlays.
 * @param {string} filePath
 * @returns {{ rel: string, bucket: string }}
 */
function pathBucket(filePath) {
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
function summarizeBuckets(report, ruleIds) {
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
  const parsed = parseArgs(process.argv.slice(2));
  if (!parsed.ok) {
    console.error(parsed.message);
    printHelp();
    process.exit(2);
  }
  const opts = parsed;
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
  const probeConfigPath = makeLintRatchetProbeConfigPath();
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
      // Stricter than live (null: 'ignore'): count residual ==/!= null debt.
      eqeqeq: ['error', 'always'],
      '@typescript-eslint/return-await': ['error', 'always'],
    },
  },
];
`;

  fs.writeFileSync(probeConfigPath, probeSource, 'utf8');

  let exitCode = 0;
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

    const parsedReport = parseEslintJsonReport(result);
    if (!parsedReport.ok) {
      console.error(parsedReport.message);
      if (parsedReport.detail) {
        console.error(parsedReport.detail);
      }
      exitCode = 1;
    }

    if (parsedReport.ok) {
      const report = parsedReport.report;
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
          const resolved = resolveRuleHeadroom(
            ceilings.rules[rule],
            entry.total
          );
          /** @type {Record<string, unknown>} */
          const rulePayload = {
            total: entry.total,
            ceiling: resolved.ok ? resolved.ceiling : ceilings.rules[rule],
            headroom: resolved.headroom,
            buckets: Object.fromEntries(topEntries(entry.buckets, opts.top)),
            files: Object.fromEntries(topEntries(entry.files, opts.top)),
          };
          if (!resolved.ok) {
            rulePayload.headroomError = resolved.error;
          }
          payload.rules[rule] = rulePayload;
        }
        console.log(JSON.stringify(payload, null, 2));
      } else {
        console.log('Lint bucket summary (report-only; ceilings unchanged)');
        console.log(`Ceilings: ${path.relative(ROOT, CEILINGS_PATH)}`);
        console.log('');

        for (const rule of selected) {
          const entry = summary[rule];
          const resolved = resolveRuleHeadroom(
            ceilings.rules[rule],
            entry.total
          );
          const ceilingLabel = resolved.ok
            ? String(resolved.ceiling)
            : String(ceilings.rules[rule]);
          console.log(
            `${rule}: ${entry.total} / ceiling ${ceilingLabel}${resolved.note}`
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
      }
    }
  } finally {
    // process.exit skips finally on Node 22+; unlink here before exit below.
    try {
      fs.unlinkSync(probeConfigPath);
    } catch {
      // ignore cleanup errors
    }
  }
  process.exit(exitCode);
}

const isMain =
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  main();
}
