#!/usr/bin/env node
/**
 * Repeat Chromium e2e runs and aggregate per-test pass/fail + timings.
 * Usage: node scripts/flake-rate-e2e-loop.mjs [--runs N] [--out DIR]
 * --help/-h exit 0 without spawning playwright. Unknown flags exit 2.
 * Default --out uses shared artifact-dir (q-mp-956).
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { artifactPath } from './lib/artifact-dir.mjs';
import { readReporterJson } from './lib/read-reporter-json.mjs';

const USAGE =
  'Usage: node scripts/flake-rate-e2e-loop.mjs [--runs N] [--out DIR]\n' +
  '  --runs N   positive integer (default 3)\n' +
  '  --out DIR  output directory (default: <artifact-dir>/flake-rate;\n' +
  '             /opt/cursor/artifacts when creatable, else\n' +
  '             test-results/agent-artifacts; --out wins)\n' +
  '  -h, --help show this help and exit (no playwright spawn)';

const VALUE_FLAGS = new Set(['--runs', '--out']);

const args = process.argv.slice(2);

/**
 * Early argv gate: help / unknown flags before mkdir or playwright spawn.
 * `--help`/`-h` anywhere in argv wins before value-slot consumption (q-mp-970),
 * so `--out --help` / `--runs --help` print usage instead of missing-value errors.
 * @param {string[]} argv
 */
function applyEarlyCli(argv) {
  for (const a of argv) {
    if (a === '--help' || a === '-h') {
      console.log(USAGE);
      process.exit(0);
    }
  }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (VALUE_FLAGS.has(a)) {
      // Consume the value slot when present; flag()/strFlag validate later.
      if (i + 1 < argv.length) i += 1;
      continue;
    }
    if (a.startsWith('-')) {
      console.error(`Unknown flag: ${a}`);
      console.error(USAGE);
      process.exit(2);
    }
    console.error(`Unexpected argument: ${a}`);
    console.error(USAGE);
    process.exit(2);
  }
}

applyEarlyCli(args);

function usageExit(message) {
  console.error(message);
  console.error(USAGE);
  process.exit(1);
}

/** Positive integer flag; rejects missing, non-numeric, and non-positive values. */
function flag(name, def) {
  const i = args.indexOf(name);
  if (i === -1) return def;
  const raw = args[i + 1];
  if (raw === undefined || raw.startsWith('--')) {
    usageExit(`Missing value for ${name}`);
  }
  if (!/^\d+$/.test(raw)) {
    usageExit(`Invalid ${name} value (need positive integer): ${raw}`);
  }
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1) {
    usageExit(`Invalid ${name} value (need positive integer): ${raw}`);
  }
  return n;
}

/** Directory flag; rejects missing values and values that look like flags. */
function strFlag(name, def) {
  const i = args.indexOf(name);
  if (i === -1) return def;
  const raw = args[i + 1];
  if (raw === undefined || raw === '' || raw.startsWith('-')) {
    usageExit(`Missing or invalid value for ${name}`);
  }
  return raw;
}

const runs = flag('--runs', 3);
const outDir =
  args.indexOf('--out') === -1
    ? artifactPath('flake-rate')
    : strFlag('--out', '');
fs.mkdirSync(outDir, { recursive: true });

/** @type {Map<string, { passes: number, fails: number, durations: number[], errors: string[] }>} */
const byTest = new Map();
const runSummaries = [];

function ingest(jsonPath, runId) {
  const loaded = readReporterJson(jsonPath);
  if (!loaded.ok) {
    runSummaries.push({ runId, ok: false, error: loaded.error });
    return;
  }
  const data = loaded.data;
  let passed = 0;
  let failed = 0;
  for (const suite of data.suites || []) {
    const file = suite.file || suite.title || '';
    for (const spec of suite.specs || []) {
      const title = [
        ...(spec.tests?.[0]?.projectName ? [] : []),
        spec.title,
      ].join(' ');
      const full = `${file}::${spec.title}`;
      for (const t of spec.tests || []) {
        for (const r of t.results || []) {
          if (!byTest.has(full))
            byTest.set(full, {
              passes: 0,
              fails: 0,
              durations: [],
              errors: [],
            });
          const rec = byTest.get(full);
          rec.durations.push(r.duration || 0);
          if (r.status === 'passed' || r.status === 'expected') {
            rec.passes += 1;
            passed += 1;
          } else if (
            r.status === 'failed' ||
            r.status === 'timedOut' ||
            r.status === 'unexpected'
          ) {
            rec.fails += 1;
            failed += 1;
            const msg = r.error?.message || r.errors?.[0]?.message || r.status;
            if (rec.errors.length < 3)
              rec.errors.push(String(msg).slice(0, 400));
          }
        }
      }
      void title;
    }
  }
  // Playwright JSON has stats
  const ok = (data.stats?.unexpected ?? failed) === 0 && failed === 0;
  runSummaries.push({
    runId,
    ok,
    passed: data.stats?.expected ?? passed,
    failed: data.stats?.unexpected ?? failed,
    flaky: data.stats?.flaky ?? 0,
    durationMs: data.stats?.duration ?? null,
  });
}

for (let i = 1; i <= runs; i++) {
  const runId = `e2e-${i}`;
  const jsonPath = path.join(outDir, `${runId}.json`);
  const logPath = path.join(outDir, `${runId}.log`);
  console.log(`[flake-rate-e2e] starting ${runId}…`);
  const started = Date.now();
  const result = spawnSync(
    'npx',
    [
      'playwright',
      'test',
      '--project=chromium',
      '--grep-invert',
      '@fullgame',
      '--retries=0',
      '--reporter=json',
      `--output=${path.join(outDir, `${runId}-artifacts`)}`,
    ],
    {
      cwd: process.cwd(),
      encoding: 'utf8',
      env: { ...process.env, CI: process.env.CI || '1' },
      maxBuffer: 64 * 1024 * 1024,
    }
  );
  // Playwright json reporter writes to stdout when --reporter=json
  fs.writeFileSync(jsonPath, result.stdout || '');
  fs.writeFileSync(
    logPath,
    [
      `exit=${result.status}`,
      `elapsedMs=${Date.now() - started}`,
      '--- stderr ---',
      result.stderr || '',
    ].join('\n')
  );
  // Corrupt/missing reporter JSON is recorded inside ingest (q-mp-1024);
  // keep a safety net for unexpected walk errors so the loop still finishes.
  try {
    ingest(jsonPath, runId);
  } catch (e) {
    runSummaries.push({
      runId,
      ok: false,
      error: e instanceof Error ? e.message : String(e),
    });
  }
  const last = runSummaries[runSummaries.length - 1];
  console.log(
    `[flake-rate-e2e] ${runId} exit=${result.status} ok=${last?.ok} passed=${last?.passed} failed=${last?.failed} ${Date.now() - started}ms`
  );
}

const failures = [...byTest.entries()]
  .filter(([, v]) => v.fails > 0)
  .map(([k, v]) => ({
    test: k,
    runs: v.passes + v.fails,
    failures: v.fails,
    avgMs: Math.round(
      v.durations.reduce((a, b) => a + b, 0) / Math.max(1, v.durations.length)
    ),
    errors: v.errors,
  }))
  .sort((a, b) => b.failures - a.failures);

const summary = {
  totalRuns: runs,
  runSummaries,
  failingTests: failures,
  failingCount: failures.length,
  generatedAt: new Date().toISOString(),
};
fs.writeFileSync(
  path.join(outDir, 'e2e-summary.json'),
  JSON.stringify(summary, null, 2)
);

const lines = [
  '# Chromium e2e flake rate summary',
  '',
  `Runs: ${runs} (retries=0)`,
  '',
  '| Run | OK | Passed | Failed | Flaky |',
  '| --- | --- | --- | --- | --- |',
  ...runSummaries.map(
    (r) =>
      `| ${r.runId} | ${r.ok} | ${r.passed ?? '?'} | ${r.failed ?? '?'} | ${r.flaky ?? 0} |`
  ),
  '',
  '## Tests with ≥1 failure',
  '',
];
if (failures.length === 0) {
  lines.push('_None_');
} else {
  lines.push('| Test | Runs | Failures | Avg ms | Sample error |');
  lines.push('| --- | --- | --- | --- | --- |');
  for (const f of failures) {
    const err = (f.errors[0] || '')
      .replace(/\|/g, '\\|')
      .replace(/\n/g, ' ')
      .slice(0, 120);
    lines.push(
      `| \`${f.test}\` | ${f.runs} | ${f.failures} | ${f.avgMs} | ${err} |`
    );
  }
}
fs.writeFileSync(path.join(outDir, 'e2e-summary.md'), lines.join('\n'));
console.log(`[flake-rate-e2e] wrote summary failing=${failures.length}`);
process.exit(failures.length > 0 ? 1 : 0);
