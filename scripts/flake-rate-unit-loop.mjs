#!/usr/bin/env node
/**
 * Repeat unit runs and aggregate per-test pass/fail + timings.
 * Usage: node scripts/flake-rate-unit-loop.mjs [--runs N] [--shuffle N] [--out DIR]
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
function flag(name, def) {
  const i = args.indexOf(name);
  if (i === -1) return def;
  return Number(args[i + 1] ?? def);
}
function strFlag(name, def) {
  const i = args.indexOf(name);
  if (i === -1) return def;
  return args[i + 1] ?? def;
}

const defaultRuns = flag('--runs', 7);
const shuffleRuns = flag('--shuffle', 3);
const outDir = strFlag('--out', '/opt/cursor/artifacts/flake-rate');
fs.mkdirSync(outDir, { recursive: true });

/** @type {Map<string, { passes: number, fails: number, durations: number[], errors: string[] }>} */
const byTest = new Map();
const runSummaries = [];

function keyOf(file, name, project) {
  return `${project || 'unit'}::${file}::${name}`;
}

function ingestJson(jsonPath, runId, mode) {
  if (!fs.existsSync(jsonPath)) {
    runSummaries.push({ runId, mode, ok: false, error: 'missing json' });
    return;
  }
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  let passed = 0;
  let failed = 0;
  const walk = (suite, fileHint) => {
    const file = suite.filepath || fileHint || suite.name || '';
    for (const t of suite.tests || []) {
      const result = (t.result || t) ;
      const status = result.state || t.status;
      const duration = result.duration ?? t.duration ?? 0;
      const name = t.name || t.fullName || 'unknown';
      const project = suite.projectName || data.name || 'unit';
      const k = keyOf(file, name, project);
      if (!byTest.has(k)) {
        byTest.set(k, { passes: 0, fails: 0, durations: [], errors: [] });
      }
      const rec = byTest.get(k);
      rec.durations.push(duration);
      if (status === 'pass' || status === 'passed') {
        rec.passes += 1;
        passed += 1;
      } else if (status === 'fail' || status === 'failed') {
        rec.fails += 1;
        failed += 1;
        const msg =
          result.errors?.[0]?.message ||
          t.errors?.[0]?.message ||
          result.error?.message ||
          'failed';
        if (rec.errors.length < 3) rec.errors.push(String(msg).slice(0, 400));
      }
    }
    for (const child of suite.suites || []) walk(child, file);
  };
  // Vitest JSON reporter shapes vary by version; support both.
  if (Array.isArray(data.testResults)) {
    for (const file of data.testResults) {
      const filePath = file.name || file.file || '';
      for (const ass of file.assertionResults || []) {
        const name = ass.fullName || ass.title || ass.ancestorTitles?.concat(ass.title).join(' ') || 'unknown';
        const status = ass.status;
        const duration = ass.duration ?? 0;
        const k = keyOf(filePath, name, 'unit');
        if (!byTest.has(k)) byTest.set(k, { passes: 0, fails: 0, durations: [], errors: [] });
        const rec = byTest.get(k);
        rec.durations.push(duration);
        if (status === 'passed' || status === 'pass') {
          rec.passes += 1;
          passed += 1;
        } else if (status === 'failed' || status === 'fail') {
          rec.fails += 1;
          failed += 1;
          const msg = ass.failureMessages?.[0] || 'failed';
          if (rec.errors.length < 3) rec.errors.push(String(msg).slice(0, 400));
        }
      }
    }
  } else {
    for (const suite of data.suites || [data]) walk(suite);
  }
  const ok = data.success !== false && failed === 0 && (data.numFailedTests ?? 0) === 0;
  runSummaries.push({
    runId,
    mode,
    ok: data.success === true || (ok && (data.numFailedTests ?? failed) === 0),
    passed: data.numPassedTests ?? passed,
    failed: data.numFailedTests ?? failed,
    durationMs: data.duration ?? null,
  });
}

function runOnce(runId, mode) {
  const jsonPath = path.join(outDir, `unit-${runId}.json`);
  const logPath = path.join(outDir, `unit-${runId}.log`);
  const vitestArgs = ['vitest', 'run', '--reporter=json', `--outputFile=${jsonPath}`];
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
    avgMs: Math.round(v.durations.reduce((a, b) => a + b, 0) / Math.max(1, v.durations.length)),
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

fs.writeFileSync(path.join(outDir, 'unit-summary.json'), JSON.stringify(summary, null, 2));

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
    const err = (f.errors[0] || '').replace(/\|/g, '\\|').replace(/\n/g, ' ').slice(0, 120);
    lines.push(`| \`${f.test}\` | ${f.runs} | ${f.failures} | ${f.avgMs} | ${err} |`);
  }
}
fs.writeFileSync(path.join(outDir, 'unit-summary.md'), lines.join('\n'));
console.log(`[flake-rate] wrote ${path.join(outDir, 'unit-summary.json')} failing=${failures.length}`);
process.exit(failures.length > 0 ? 1 : 0);
