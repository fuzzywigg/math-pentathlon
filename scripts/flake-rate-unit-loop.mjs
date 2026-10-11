#!/usr/bin/env node
/**
 * Repeat unit runs and aggregate per-test pass/fail + timings.
 * Usage: node scripts/flake-rate-unit-loop.mjs [--runs N] [--shuffle N] [--out DIR]
 * --help/-h exit 0 without spawning vitest. Unknown flags exit 2.
 * Default --out uses shared artifact-dir (q-mp-956).
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { artifactPath } from './lib/artifact-dir.mjs';
import { readReporterJson } from './lib/read-reporter-json.mjs';

const USAGE =
  'Usage: node scripts/flake-rate-unit-loop.mjs [--runs N] [--shuffle N] [--out DIR]\n' +
  '  --runs N      positive integer (default 7)\n' +
  '  --shuffle N   positive integer (default 3)\n' +
  '  --out DIR     output directory (default: <artifact-dir>/flake-rate;\n' +
  '                /opt/cursor/artifacts when creatable, else\n' +
  '                test-results/agent-artifacts; --out wins)\n' +
  '  -h, --help    show this help and exit (no vitest spawn)';

const VALUE_FLAGS = new Set(['--runs', '--shuffle', '--out']);

const args = process.argv.slice(2);

/**
 * Early argv gate: help / unknown flags before mkdir or vitest spawn.
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

function usageExit(message, code = 1) {
  console.error(message);
  console.error(USAGE);
  process.exit(code);
}

/**
 * Reject duplicate value flags (q-mp-1353); indexOf first-wins is not enough.
 * Only counts flag positions (skips value slots) so `--out --runs` still hits
 * the flag-like --out validator (q-mp-871) instead of a false duplicate --runs.
 */
function rejectDuplicateFlag(name) {
  let count = 0;
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (VALUE_FLAGS.has(a)) {
      if (a === name) count += 1;
      if (i + 1 < args.length) i += 1;
    }
  }
  if (count > 1) {
    usageExit(`Duplicate ${name}`, 2);
  }
}

/** Positive integer flag; rejects missing, non-numeric, and non-positive values. */
function flag(name, def) {
  rejectDuplicateFlag(name);
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
  rejectDuplicateFlag(name);
  const i = args.indexOf(name);
  if (i === -1) return def;
  const raw = args[i + 1];
  if (raw === undefined || raw === '' || raw.startsWith('-')) {
    usageExit(`Missing or invalid value for ${name}`);
  }
  return raw;
}

const defaultRuns = flag('--runs', 7);
const shuffleRuns = flag('--shuffle', 3);
const outDir =
  args.indexOf('--out') === -1
    ? artifactPath('flake-rate')
    : strFlag('--out', '');
fs.mkdirSync(outDir, { recursive: true });

/** @type {Map<string, { passes: number, fails: number, durations: number[], errors: string[] }>} */
const byTest = new Map();
const runSummaries = [];

function keyOf(file, name, project) {
  return `${project || 'unit'}::${file}::${name}`;
}

function isPassStatus(status) {
  return status === 'pass' || status === 'passed';
}

function isFailStatus(status) {
  return status === 'fail' || status === 'failed';
}

/**
 * Record a per-test outcome. Durations are kept only for pass/fail so
 * skip/todo/pending do not dilute avgMs (q-mp-1219).
 */
function recordOutcome(rec, status, duration, onPass, onFail) {
  if (isPassStatus(status)) {
    rec.durations.push(duration);
    onPass();
    return;
  }
  if (isFailStatus(status)) {
    rec.durations.push(duration);
    onFail();
  }
}

function ingestJson(jsonPath, runId, mode) {
  const loaded = readReporterJson(jsonPath);
  if (!loaded.ok) {
    runSummaries.push({ runId, mode, ok: false, error: loaded.error });
    return;
  }
  const data = loaded.data;
  let passed = 0;
  let failed = 0;
  /** Suite-level failures inferred from file/suite status or message (q-mp-1200). */
  let inferredSuiteFails = 0;
  const walk = (suite, fileHint) => {
    const file = suite.filepath || fileHint || suite.name || '';
    const suiteStatus = suite.status || suite.result?.status;
    if (isFailStatus(suiteStatus)) {
      inferredSuiteFails += 1;
    } else if (
      typeof suite.message === 'string' &&
      suite.message.length > 0 &&
      !(suite.tests || []).length &&
      !(suite.suites || []).length
    ) {
      inferredSuiteFails += 1;
    }
    for (const t of suite.tests || []) {
      const result = t.result || t;
      const status = result.state || t.status;
      const duration = result.duration ?? t.duration ?? 0;
      const name = t.name || t.fullName || 'unknown';
      const project = suite.projectName || data.name || 'unit';
      const k = keyOf(file, name, project);
      if (!byTest.has(k)) {
        byTest.set(k, { passes: 0, fails: 0, durations: [], errors: [] });
      }
      const rec = byTest.get(k);
      recordOutcome(
        rec,
        status,
        duration,
        () => {
          rec.passes += 1;
          passed += 1;
        },
        () => {
          rec.fails += 1;
          failed += 1;
          const msg =
            result.errors?.[0]?.message ||
            t.errors?.[0]?.message ||
            result.error?.message ||
            'failed';
          if (rec.errors.length < 3) rec.errors.push(String(msg).slice(0, 400));
        }
      );
    }
    for (const child of suite.suites || []) walk(child, file);
  };
  // Vitest JSON reporter shapes vary by version; support both.
  if (Array.isArray(data.testResults)) {
    for (const file of data.testResults) {
      const filePath = file.name || file.file || '';
      const assertions = file.assertionResults || [];
      if (
        isFailStatus(file.status) ||
        (typeof file.message === 'string' &&
          file.message.length > 0 &&
          assertions.length === 0)
      ) {
        inferredSuiteFails += 1;
      }
      for (const ass of assertions) {
        const name =
          ass.fullName ||
          ass.title ||
          ass.ancestorTitles?.concat(ass.title).join(' ') ||
          'unknown';
        const status = ass.status;
        const duration = ass.duration ?? 0;
        const k = keyOf(filePath, name, 'unit');
        if (!byTest.has(k))
          byTest.set(k, { passes: 0, fails: 0, durations: [], errors: [] });
        const rec = byTest.get(k);
        recordOutcome(
          rec,
          status,
          duration,
          () => {
            rec.passes += 1;
            passed += 1;
          },
          () => {
            rec.fails += 1;
            failed += 1;
            const msg = ass.failureMessages?.[0] || 'failed';
            if (rec.errors.length < 3)
              rec.errors.push(String(msg).slice(0, 400));
          }
        );
      }
    }
  } else {
    for (const suite of data.suites || [data]) walk(suite);
  }
  // Per-run ok keys off walked failures + numFailedTests + numFailedTestSuites
  // (and inferred suite status/message). Vitest `success: true` must not
  // override a non-zero failure count (q-mp-1034 / q-mp-1200).
  // Summary `failed` must not under-report when numFailedTests is 0 but walked
  // failures exist (`??` does not coerce 0 → walked) (q-mp-1340).
  const reportedFailed =
    typeof data.numFailedTests === 'number' &&
    Number.isFinite(data.numFailedTests)
      ? data.numFailedTests
      : 0;
  const failedSummary = Math.max(failed, reportedFailed);
  const reportedSuiteFails =
    typeof data.numFailedTestSuites === 'number' &&
    Number.isFinite(data.numFailedTestSuites)
      ? data.numFailedTestSuites
      : 0;
  const ok =
    failed === 0 &&
    reportedFailed === 0 &&
    reportedSuiteFails === 0 &&
    inferredSuiteFails === 0;
  runSummaries.push({
    runId,
    mode,
    ok,
    passed: data.numPassedTests ?? passed,
    failed: failedSummary,
    durationMs: data.duration ?? null,
  });
}

function runOnce(runId, mode) {
  const jsonPath = path.join(outDir, `unit-${runId}.json`);
  const logPath = path.join(outDir, `unit-${runId}.log`);
  const vitestArgs = [
    'vitest',
    'run',
    '--reporter=json',
    `--outputFile=${jsonPath}`,
  ];
  if (mode === 'shuffle') {
    vitestArgs.push('--sequence.shuffle');
    // Vary seed for diversity
    const seed = 1000 + Number(String(runId).replace(/\D/g, '') || '1');
    vitestArgs.push(`--sequence.seed=${seed}`);
  }
  console.log(`[flake-rate] starting ${runId} (${mode})…`);
  const started = Date.now();
  const result = spawnSync('npx', vitestArgs, {
    cwd: process.cwd(),
    encoding: 'utf8',
    env: { ...process.env },
    maxBuffer: 64 * 1024 * 1024,
  });
  const elapsed = Date.now() - started;
  fs.writeFileSync(
    logPath,
    [
      `exit=${result.status}`,
      `elapsedMs=${elapsed}`,
      '--- stdout ---',
      result.stdout || '',
      '--- stderr ---',
      result.stderr || '',
    ].join('\n')
  );
  ingestJson(jsonPath, runId, mode);
  const last = runSummaries[runSummaries.length - 1];
  console.log(
    `[flake-rate] ${runId} done exit=${result.status} ok=${last?.ok} passed=${last?.passed} failed=${last?.failed} ${elapsed}ms`
  );
  return result.status === 0;
}

let n = 0;
for (let i = 1; i <= defaultRuns; i++) {
  n += 1;
  runOnce(`default-${i}`, 'default');
}
for (let i = 1; i <= shuffleRuns; i++) {
  n += 1;
  runOnce(`shuffle-${i}`, 'shuffle');
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
  totalRuns: n,
  defaultRuns,
  shuffleRuns,
  runSummaries,
  failingTests: failures,
  failingCount: failures.length,
  generatedAt: new Date().toISOString(),
};

fs.writeFileSync(
  path.join(outDir, 'unit-summary.json'),
  JSON.stringify(summary, null, 2)
);

// Markdown flake table fragment
const lines = [
  '# Unit flake rate summary',
  '',
  `Runs: ${defaultRuns} default + ${shuffleRuns} shuffle = ${n}`,
  '',
  '| Run | Mode | OK | Passed | Failed |',
  '| --- | --- | --- | --- | --- |',
  ...runSummaries.map(
    (r) =>
      `| ${r.runId} | ${r.mode} | ${r.ok} | ${r.passed ?? '?'} | ${r.failed ?? '?'} |`
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
fs.writeFileSync(path.join(outDir, 'unit-summary.md'), lines.join('\n'));
console.log(
  `[flake-rate] wrote ${path.join(outDir, 'unit-summary.json')} failing=${failures.length}`
);
// All-corrupt / zero successful parses must not look like a clean audit (q-mp-1339).
const ingestOkCount = runSummaries.filter((r) => !r.error).length;
if (runSummaries.length > 0 && ingestOkCount === 0) {
  console.error(
    `[flake-rate] all ${runSummaries.length} runs failed to ingest reporter JSON`
  );
  process.exit(1);
}
process.exit(failures.length > 0 ? 1 : 0);
