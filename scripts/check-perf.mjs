#!/usr/bin/env node
/**
 * Report-only load-performance check.
 *
 * Measures production bundle sizes (per chunk + menu critical path) and, when
 * Chrome/Lighthouse are available, runs Lighthouse performance for the menu
 * and three representative games (one 3D). Writes test-results/perf/summary.md
 * and never fails CI (always exit 0).
 *
 * Usage:
 *   npm run build && npm run check:perf
 *   PERF_SKIP_LIGHTHOUSE=1 npm run check:perf   # bundles only
 *   PERF_BASE_URL=http://127.0.0.1:4173 npm run check:perf
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

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const OUT_DIR = path.join(ROOT, 'test-results', 'perf');
const SUMMARY_MD = path.join(OUT_DIR, 'summary.md');
const SUMMARY_JSON = path.join(OUT_DIR, 'summary.json');

const SKIP_LH = process.env.PERF_SKIP_LIGHTHOUSE === '1';
const LH_TIMEOUT_MS = Number(process.env.PERF_LH_TIMEOUT_MS || 120_000);

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

/**
 * @param {string[]} args
 * @param {{ cwd?: string, env?: NodeJS.ProcessEnv }} [opts]
 * @returns {Promise<{ code: number | null, stdout: string, stderr: string }>}
 */
function runCmd(args, opts = {}) {
  return new Promise((resolve) => {
    const child = spawn(args[0], args.slice(1), {
      cwd: opts.cwd ?? ROOT,
      env: { ...process.env, ...opts.env },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (d) => {
      stdout += d.toString();
    });
    child.stderr.on('data', (d) => {
      stderr += d.toString();
    });
    child.on('close', (code) => resolve({ code, stdout, stderr }));
    child.on('error', (err) =>
      resolve({ code: 1, stdout, stderr: String(err) })
    );
  });
}

/**
 * @param {string} baseUrl
 * @param {string} formFactor 'mobile' | 'desktop'
 * @param {{ id: string, path: string, label: string }} target
 * @param {string} outJson
 */
async function runLighthouse(baseUrl, formFactor, target, outJson) {
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

  const result = await Promise.race([
    runCmd(args),
    new Promise((resolve) =>
      setTimeout(
        () => resolve({ code: 1, stdout: '', stderr: 'lighthouse timeout' }),
        LH_TIMEOUT_MS
      )
    ),
  ]);

  if (result.code !== 0 || !fs.existsSync(outJson)) {
    return {
      id: target.id,
      label: target.label,
      formFactor,
      ok: false,
      error: result.stderr.slice(0, 400) || `exit ${result.code}`,
    };
  }

  const report = JSON.parse(fs.readFileSync(outJson, 'utf8'));
  const audits = report.audits || {};
  const score = Math.round((report.categories?.performance?.score || 0) * 100);
  return {
    id: target.id,
    label: target.label,
    formFactor,
    ok: true,
    score,
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
    'Report-only (`npm run check:perf`) — always exits 0; does not fail CI.'
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
    lines.push(
      `| \`${g.id}\` | \`${g.file}\` | ${formatBytes(g.gzipBytes)} |`
    );
  }
  lines.push('');

  lines.push('## Lighthouse (performance)');
  lines.push('');
  if (data.lighthouse.skipped) {
    lines.push(`Skipped: ${data.lighthouse.reason}`);
  } else {
    lines.push('| Target | Form | Score | FCP | LCP | TBT | SI | TTI | Bytes |');
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
      '(report-only: exiting 0)',
      '',
    ].join('\n');
    fs.writeFileSync(SUMMARY_MD, md);
    console.error('dist/ not found. Wrote stub summary. (report-only)');
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

try {
  await main();
  process.exitCode = 0;
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
