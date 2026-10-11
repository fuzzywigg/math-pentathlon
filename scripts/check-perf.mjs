#!/usr/bin/env node
/**
 * Report-only load-performance check.
 *
 * Measures production bundle sizes (per chunk + menu critical path) and, when
 * Chrome/Lighthouse are available, runs Lighthouse performance for the menu
 * and three representative games (one 3D). Writes test-results/perf/summary.md.
 * When `dist/` exists, measurement paths always exit 0 (not wired into CI fail
 * paths). Missing `dist/` is a usage error (exit 2).
 *
 * CLI (q-mp-917 / q-mp-1001): `--help` / `-h` exit 0 before env-number
 * validation (`PERF_LH_TIMEOUT_MS`), before the `dist/` check, and before any
 * summary writes. Unknown flags exit 2. Valid default path unchanged.
 *
 * Timeout cleanup (q-mp-1090): when `PERF_LH_TIMEOUT_MS` wins the Lighthouse
 * `Promise.race`, the spawned LH/Chrome child is signaled SIGTERM then SIGKILL
 * (preview kill in `finally` is unchanged).
 *
 * Missing performance score (q-mp-1208): when LH JSON lacks a finite
 * `categories.performance.score`, the row is `ok: false` with an error (not a
 * fake score `0`). Present numeric `0` stays representable. Process exit for
 * measurement paths stays report-only exit 0 when `dist/` exists.
 *
 * Usage:
 *   npm run build && npm run check:perf
 *   PERF_SKIP_LIGHTHOUSE=1 npm run check:perf   # bundles only
 *   PERF_BASE_URL=http://127.0.0.1:4173 npm run check:perf
 *   node scripts/check-perf.mjs --help
 */

import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { createServer } from 'node:net';
import {
  listGameIds,
  measureGameChunks,
  measureMenuCriticalPath,
} from './check-bundle-budgets.mjs';
import { requireEnvNumber } from './lib/env-number.mjs';
import { parseHelpOnlyArgv } from './lib/help-only-cli.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const OUT_DIR = path.join(ROOT, 'test-results', 'perf');
const SUMMARY_MD = path.join(OUT_DIR, 'summary.md');
const SUMMARY_JSON = path.join(OUT_DIR, 'summary.json');

const USAGE = `Usage: node scripts/check-perf.mjs [--help]

Report-only load-performance check (bundle sizes + optional Lighthouse).
Writes test-results/perf/summary.md when run with a built dist/.

Options:
  -h, --help    Show this help and exit 0 (before dist/ check; no summary writes)

Exit codes:
  0  --help / -h; or report written when dist/ exists (report-only)
  2  unknown flag, or missing dist/ (usage error: exit 2 — run npm run build first)

Env:
  PERF_SKIP_LIGHTHOUSE=1              bundles only (skip Lighthouse)
  PERF_BASE_URL=http://127.0.0.1:…    reuse an existing preview
  PERF_LH_TIMEOUT_MS=<ms>             Lighthouse timeout (default 120000)`;

const SKIP_LH = process.env.PERF_SKIP_LIGHTHOUSE === '1';
/** Set after CLI help/unknown-flag parse (q-mp-1001); unused on --help / -h. */
let LH_TIMEOUT_MS = 120_000;

/** Menu + 2D small + 2D heavier + 3D (FIAR board3d). */
const LH_TARGETS = [
  { id: 'menu', path: '/', label: 'Menu' },
  { id: 'hex', path: '/#/game/hex', label: 'Hex (2D)' },
  { id: 'fab-a-diffy', path: '/#/game/fab-a-diffy', label: 'Fab-a-Diffy (2D)' },
  {
    id: 'fiar-3d',
    path: '/?board3d=1#/game/fiar',
    label: 'FIAR (3D)',
  },
];

/**
 * @param {number} n
 * @returns {string}
 */
function formatBytes(n) {
  if (!Number.isFinite(n) || n < 0) return '—';
  if (n < 1024) return `${n} B`;
  return `${(n / 1024).toFixed(2)} kB`;
}

/**
 * @param {string} absPath
 * @returns {number}
 */
function gzipByteLength(absPath) {
  return zlib.gzipSync(fs.readFileSync(absPath)).length;
}

/**
 * List all JS/CSS under dist/assets and dist/vendor with raw + gzip sizes.
 * @returns {{ path: string, rawBytes: number, gzipBytes: number }[]}
 */
function measureAllChunks() {
  /** @type {{ path: string, rawBytes: number, gzipBytes: number }[]} */
  const rows = [];
  for (const dir of ['assets', 'vendor']) {
    const absDir = path.join(DIST, dir);
    if (!fs.existsSync(absDir)) continue;
    for (const name of fs.readdirSync(absDir).sort()) {
      if (!/\.(js|css)$/.test(name) || name.includes('.map')) continue;
      // Skip AI worker blobs from the "app chunk" table (listed separately).
      const rel = path.join(dir, name);
      const abs = path.join(DIST, rel);
      const rawBytes = fs.statSync(abs).size;
      rows.push({ path: rel, rawBytes, gzipBytes: gzipByteLength(abs) });
    }
  }
  return rows;
}

/**
 * @returns {Promise<number>}
 */
function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      if (!address || typeof address === 'string') {
        server.close();
        reject(new Error('Could not allocate port'));
        return;
      }
      const { port } = address;
      server.close((err) => (err ? reject(err) : resolve(port)));
    });
  });
}

/**
 * @param {string} url
 * @param {number} timeoutMs
 */
async function waitForUrl(url, timeoutMs = 30_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok || res.status === 404) return;
    } catch {
      // booting
    }
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error(`Timed out waiting for ${url}`);
}

/** Default grace between SIGTERM and SIGKILL for timed-out LH children. */
const LH_KILL_GRACE_MS = 2_000;

/**
 * Signal a child process: SIGTERM, then SIGKILL after grace if still alive.
 * No-op when child is missing, already killed, or already exited.
 *
 * @param {import('node:child_process').ChildProcess | null | undefined} child
 * @param {{
 *   graceMs?: number,
 *   kill?: (child: import('node:child_process').ChildProcess, signal: NodeJS.Signals) => boolean,
 *   schedule?: (fn: () => void, ms: number) => ReturnType<typeof setTimeout>,
 *   clearSchedule?: (id: ReturnType<typeof setTimeout>) => void,
 * }} [opts]
 * @returns {{ signaled: boolean }}
 */
export function killChildProcess(child, opts = {}) {
  if (!child || child.killed || child.exitCode != null) {
    return { signaled: false };
  }
  const graceMs = opts.graceMs ?? LH_KILL_GRACE_MS;
  const kill =
    opts.kill ??
    ((c, signal) => {
      try {
        return c.kill(signal);
      } catch {
        return false;
      }
    });
  const schedule = opts.schedule ?? setTimeout;
  const clearSchedule = opts.clearSchedule ?? clearTimeout;

  kill(child, 'SIGTERM');

  const escalateId = schedule(() => {
    if (child.killed || child.exitCode != null) return;
    kill(child, 'SIGKILL');
  }, graceMs);

  const clearEscalate = () => clearSchedule(escalateId);
  if (typeof child.once === 'function') {
    child.once('exit', clearEscalate);
    child.once('error', clearEscalate);
  }

  return { signaled: true };
}

/**
 * Spawn a command and collect stdio; expose `child` for timeout cleanup.
 *
 * @param {string[]} args
 * @param {{
 *   cwd?: string,
 *   env?: NodeJS.ProcessEnv,
 *   spawn?: typeof spawn,
 * }} [opts]
 * @returns {{
 *   promise: Promise<{ code: number | null, stdout: string, stderr: string }>,
 *   child: import('node:child_process').ChildProcess,
 * }}
 */
export function runCmd(args, opts = {}) {
  const spawnFn = opts.spawn ?? spawn;
  const child = spawnFn(args[0], args.slice(1), {
    cwd: opts.cwd ?? ROOT,
    env: { ...process.env, ...opts.env },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  const promise = new Promise((resolve) => {
    let stdout = '';
    let stderr = '';
    child.stdout?.on('data', (d) => {
      stdout += d.toString();
    });
    child.stderr?.on('data', (d) => {
      stderr += d.toString();
    });
    child.on('close', (code) => resolve({ code, stdout, stderr }));
    child.on('error', (err) =>
      resolve({ code: 1, stdout, stderr: String(err) })
    );
  });
  return { promise, child };
}

/**
 * Fail closed when Lighthouse JSON lacks a finite performance score (q-mp-1208).
 * Present numeric `0` stays representable as score `0` (unlike `score || 0`).
 *
 * @param {unknown} report
 * @returns {{ ok: true, score: number } | { ok: false, error: string }}
 */
export function shapeLhPerformanceScore(report) {
  const raw =
    report &&
    typeof report === 'object' &&
    /** @type {{ categories?: { performance?: { score?: unknown } } }} */ (
      report
    ).categories?.performance?.score;
  if (typeof raw !== 'number' || !Number.isFinite(raw)) {
    return {
      ok: false,
      error: 'missing Lighthouse performance score',
    };
  }
  return { ok: true, score: Math.round(raw * 100) };
}

/**
 * @param {string} baseUrl
 * @param {string} formFactor 'mobile' | 'desktop'
 * @param {{ id: string, path: string, label: string }} target
 * @param {string} outJson
 * @param {{
 *   timeoutMs?: number,
 *   killGraceMs?: number,
 *   runCmd?: typeof runCmd,
 *   killChildProcess?: typeof killChildProcess,
 *   existsSync?: (p: string) => boolean,
 *   readFileSync?: (p: string, enc: BufferEncoding) => string,
 *   schedule?: (fn: () => void, ms: number) => ReturnType<typeof setTimeout>,
 *   clearSchedule?: (id: ReturnType<typeof setTimeout>) => void,
 * }} [opts]
 */
export async function runLighthouse(
  baseUrl,
  formFactor,
  target,
  outJson,
  opts = {}
) {
  const url = `${baseUrl.replace(/\/$/, '')}${target.path}`;
  const args = [
    'npx',
    '--yes',
    'lighthouse',
    url,
    '--only-categories=performance',
    '--throttling-method=simulate',
    '--output=json',
    `--output-path=${outJson}`,
    '--chrome-flags=--headless --no-sandbox --disable-gpu',
    '--quiet',
  ];
  if (formFactor === 'desktop') {
    args.push('--preset=desktop');
  } else {
    args.push('--form-factor=mobile');
  }

  const timeoutMs = opts.timeoutMs ?? LH_TIMEOUT_MS;
  const run = opts.runCmd ?? runCmd;
  const killChild = opts.killChildProcess ?? killChildProcess;
  const fileExists = opts.existsSync ?? ((p) => fs.existsSync(p));
  const readFile = opts.readFileSync ?? ((p, enc) => fs.readFileSync(p, enc));
  const schedule = opts.schedule ?? setTimeout;
  const clearSchedule = opts.clearSchedule ?? clearTimeout;

  const { promise, child } = run(args);
  /** @type {ReturnType<typeof setTimeout> | undefined} */
  let timeoutId;
  const timeoutPromise = new Promise((resolve) => {
    timeoutId = schedule(() => {
      killChild(child, {
        graceMs: opts.killGraceMs ?? LH_KILL_GRACE_MS,
        schedule,
        clearSchedule,
      });
      resolve({ code: 1, stdout: '', stderr: 'lighthouse timeout' });
    }, timeoutMs);
  });

  const result = await Promise.race([promise, timeoutPromise]);
  if (timeoutId !== undefined) clearSchedule(timeoutId);

  if (result.code !== 0 || !fileExists(outJson)) {
    return {
      id: target.id,
      label: target.label,
      formFactor,
      ok: false,
      error: result.stderr.slice(0, 400) || `exit ${result.code}`,
    };
  }

  const report = JSON.parse(readFile(outJson, 'utf8'));
  const shaped = shapeLhPerformanceScore(report);
  if (!shaped.ok) {
    return {
      id: target.id,
      label: target.label,
      formFactor,
      ok: false,
      error: shaped.error,
    };
  }
  const audits = report.audits || {};
  return {
    id: target.id,
    label: target.label,
    formFactor,
    ok: true,
    score: shaped.score,
    fcp: audits['first-contentful-paint']?.displayValue ?? '—',
    lcp: audits['largest-contentful-paint']?.displayValue ?? '—',
    tbt: audits['total-blocking-time']?.displayValue ?? '—',
    si: audits['speed-index']?.displayValue ?? '—',
    tti: audits['interactive']?.displayValue ?? '—',
    bytes: audits['total-byte-weight']?.numericValue ?? null,
    bytesDisplay: audits['total-byte-weight']?.displayValue ?? '—',
  };
}

/**
 * @param {object} data
 * @returns {string}
 */
function renderMarkdown(data) {
  const lines = [];
  lines.push('# Load performance summary');
  lines.push('');
  lines.push(`Generated: ${data.generatedAt}`);
  lines.push('');
  lines.push(
    'Report-only (`npm run check:perf`) — exits 0 when `dist/` exists; does not fail CI. Missing `dist/` is a usage error (exit 2).'
  );
  lines.push('');

  lines.push('## Menu critical path (first-load JS/CSS)');
  lines.push('');
  lines.push(`Total gzip: **${formatBytes(data.menu.totalGzipBytes)}**`);
  lines.push('');
  lines.push('| File | Gzip |');
  lines.push('| --- | ---: |');
  for (const f of data.menu.files) {
    lines.push(`| \`${f.path}\` | ${formatBytes(f.gzipBytes)} |`);
  }
  lines.push('');

  lines.push('## Production chunks (raw / gzip)');
  lines.push('');
  lines.push('| Chunk | Raw | Gzip |');
  lines.push('| --- | ---: | ---: |');
  for (const c of data.chunks) {
    lines.push(
      `| \`${c.path}\` | ${formatBytes(c.rawBytes)} | ${formatBytes(c.gzipBytes)} |`
    );
  }
  lines.push('');

  lines.push('## Game lazy chunks (gzip)');
  lines.push('');
  lines.push('| Game | File | Gzip |');
  lines.push('| --- | --- | ---: |');
  for (const g of data.games) {
    lines.push(`| \`${g.id}\` | \`${g.file}\` | ${formatBytes(g.gzipBytes)} |`);
  }
  lines.push('');

  lines.push('## Lighthouse (performance)');
  lines.push('');
  if (data.lighthouse.skipped) {
    lines.push(`Skipped: ${data.lighthouse.reason}`);
  } else {
    lines.push(
      '| Target | Form | Score | FCP | LCP | TBT | SI | TTI | Bytes |'
    );
    lines.push('| --- | --- | ---: | --- | --- | --- | --- | --- | --- |');
    for (const row of data.lighthouse.results) {
      if (!row.ok) {
        lines.push(
          `| ${row.label} | ${row.formFactor} | — | — | — | — | — | — | error: ${row.error} |`
        );
        continue;
      }
      lines.push(
        `| ${row.label} | ${row.formFactor} | ${row.score} | ${row.fcp} | ${row.lcp} | ${row.tbt} | ${row.si} | ${row.tti} | ${row.bytesDisplay} |`
      );
    }
  }
  lines.push('');
  lines.push('## Notes');
  lines.push('');
  lines.push(
    '- First-load JS = sum of JS linked from `dist/index.html` (script + modulepreload).'
  );
  lines.push(
    '- Three.js / mp3d live under `dist/vendor/` and load only with `?board3d=1`.'
  );
  lines.push(
    '- Optional treemap: `PERF_VISUALIZE=1 npm run build` → `test-results/perf/stats.html`.'
  );
  lines.push('');
  return lines.join('\n');
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  if (!fs.existsSync(DIST)) {
    const md = [
      '# Load performance summary',
      '',
      'dist/ missing — run `npm run build` before `npm run check:perf`.',
      '',
      '(usage error: exiting 2)',
      '',
    ].join('\n');
    fs.writeFileSync(SUMMARY_MD, md);
    // Measurement overs stay report-only (exit 0); missing build is a usage error.
    console.error('dist/ not found. Run npm run build before check:perf.');
    console.error('(usage error: exiting 2)');
    process.exitCode = 2;
    return;
  }

  const menu = measureMenuCriticalPath(DIST);
  const gameIds = listGameIds(ROOT);
  const games = measureGameChunks(DIST, gameIds);
  const chunks = measureAllChunks();

  const firstLoadJs = menu.files
    .filter((f) => f.path.endsWith('.js'))
    .reduce((sum, f) => sum + f.gzipBytes, 0);

  /** @type {any} */
  const payload = {
    generatedAt: new Date().toISOString(),
    menu,
    firstLoadJsGzipBytes: firstLoadJs,
    games,
    chunks,
    lighthouse: { skipped: true, reason: '', results: [] },
  };

  if (SKIP_LH) {
    payload.lighthouse.reason = 'PERF_SKIP_LIGHTHOUSE=1';
  } else {
    let previewProc = null;
    let baseUrl = process.env.PERF_BASE_URL || '';
    try {
      if (!baseUrl) {
        const port = await getFreePort();
        baseUrl = `http://127.0.0.1:${port}`;
        previewProc = spawn(
          'npx',
          ['vite', 'preview', '--host', '127.0.0.1', '--port', String(port)],
          {
            cwd: ROOT,
            stdio: ['ignore', 'pipe', 'pipe'],
            env: process.env,
          }
        );
        await waitForUrl(baseUrl);
      }

      const lhDir = path.join(OUT_DIR, 'lighthouse');
      fs.mkdirSync(lhDir, { recursive: true });
      /** @type {any[]} */
      const results = [];
      for (const target of LH_TARGETS) {
        for (const form of /** @type {const} */ (['mobile', 'desktop'])) {
          const outJson = path.join(lhDir, `${target.id}-${form}.json`);
          process.stdout.write(`lighthouse ${target.id} ${form}… `);
          const row = await runLighthouse(baseUrl, form, target, outJson);
          results.push(row);
          console.log(row.ok ? `score ${row.score}` : `skip (${row.error})`);
        }
      }
      payload.lighthouse = { skipped: false, reason: '', results };
    } catch (err) {
      payload.lighthouse = {
        skipped: true,
        reason: err instanceof Error ? err.message : String(err),
        results: [],
      };
    } finally {
      if (previewProc && !previewProc.killed) {
        previewProc.kill('SIGTERM');
      }
    }
  }

  const md = renderMarkdown(payload);
  fs.writeFileSync(SUMMARY_MD, md);
  fs.writeFileSync(SUMMARY_JSON, JSON.stringify(payload, null, 2));

  console.log('');
  console.log(`Wrote ${path.relative(ROOT, SUMMARY_MD)}`);
  console.log(
    `Menu critical gzip: ${formatBytes(menu.totalGzipBytes)} (JS ${formatBytes(firstLoadJs)})`
  );
  console.log('(report-only: exiting 0)');
}

const isMain =
  !!process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  const cli = parseHelpOnlyArgv(process.argv.slice(2));
  if (cli.kind === 'help') {
    console.log(USAGE);
    process.exit(0);
  }
  if (cli.kind === 'error') {
    console.error(`Unknown flag: ${cli.flag}`);
    console.error(USAGE);
    process.exit(2);
  }

  // Validate PERF_LH_TIMEOUT_MS only on real runs (after --help / unknown flags).
  LH_TIMEOUT_MS = requireEnvNumber('PERF_LH_TIMEOUT_MS', 120_000);

  try {
    await main();
    // Preserve usage-error exit 2 from missing dist/; otherwise report-only exit 0.
    if (process.exitCode == null) {
      process.exitCode = 0;
    }
  } catch (err) {
    console.error(err instanceof Error ? err.message : err);
    try {
      fs.mkdirSync(OUT_DIR, { recursive: true });
      fs.writeFileSync(
        SUMMARY_MD,
        `# Load performance summary\n\nError: ${err instanceof Error ? err.message : String(err)}\n\n(report-only: exiting 0)\n`
      );
    } catch {
      // ignore
    }
    process.exitCode = 0;
  }
}
