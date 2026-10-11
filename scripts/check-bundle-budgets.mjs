#!/usr/bin/env node
/**
 * Gzip bundle budget check with known-OVER allowlist ratchet (q-mp-123).
 *
 * Measures:
 *   - Menu critical path: JS/CSS linked from dist/index.html (entry + modulepreload + styles)
 *   - Each game lazy chunk: dist/assets/game-<id>-*.js
 *
 * Compares against committed bundle-budgets.json (current size + 10% headroom).
 * OVER rows listed in `knownOvers` are expected (warn only). Any other OVER is
 * a NEW regression — printed loudly. When `dist/` exists, default exit is still
 * 0 so soft budget overs never fail the hard build path; pass
 * `--fail-on-new-over` (CI does, under continue-on-error) to exit non-zero only
 * when a novel OVER appears. Missing `dist/` is a usage error (exit 2).
 *
 * Usage:
 *   npm run build && npm run size:check
 *   npm run size:check -- --fail-on-new-over
 */

import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const BUDGETS_PATH = path.join(ROOT, 'bundle-budgets.json');

/**
 * @param {string} absPath
 * @returns {number}
 */
function gzipByteLength(absPath) {
  return zlib.gzipSync(fs.readFileSync(absPath)).length;
}

/**
 * Collect JS/CSS hrefs from the built menu shell HTML.
 * Matches real `src`/`href` only (word-boundary; not data-src/ng-src/xsrc),
 * single- or double-quoted values, case-insensitive attribute names
 * (q-mp-1132, q-mp-1150, q-mp-1151).
 * @param {string} html
 * @returns {string[]} paths relative to dist/ (no leading slash)
 */
export function parseMenuCriticalRefs(html) {
  const refs = new Set();
  for (const match of html.matchAll(
    /(?<![A-Za-z0-9_-])(?:src|href)=(["'])(\/(?:assets|vendor)\/[^"']+\.(?:js|css))\1/gi
  )) {
    refs.add(match[2].slice(1));
  }
  return [...refs].sort();
}

/**
 * @param {string} distRoot
 * @returns {{ files: { path: string, gzipBytes: number }[], totalGzipBytes: number }}
 */
export function measureMenuCriticalPath(distRoot) {
  const htmlPath = path.join(distRoot, 'index.html');
  if (!fs.existsSync(htmlPath)) {
    throw new Error(`Missing ${htmlPath}. Run npm run build first.`);
  }
  const refs = parseMenuCriticalRefs(fs.readFileSync(htmlPath, 'utf8'));
  if (refs.length === 0) {
    throw new Error('No menu JS/CSS refs found in dist/index.html');
  }
  const files = refs.map((rel) => {
    const abs = path.join(distRoot, rel);
    if (!fs.existsSync(abs)) {
      throw new Error(`Menu critical asset missing: ${rel}`);
    }
    return { path: rel, gzipBytes: gzipByteLength(abs) };
  });
  const totalGzipBytes = files.reduce((sum, f) => sum + f.gzipBytes, 0);
  return { files, totalGzipBytes };
}

/**
 * @param {string} root
 * @returns {string[]}
 */
export function listGameIds(root) {
  return fs
    .readdirSync(path.join(root, 'src/games'), { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort((a, b) => a.localeCompare(b));
}

/**
 * Find the Vite-emitted lazy chunk for a game id.
 * Match longest id first so "hex" does not steal "hex-a-gone".
 * When multiple `game-<id>-*.js` hashes exist for one id, leave that id
 * unmapped (measureGameChunks → MISSING) instead of picking by readdir order
 * (q-mp-1300). Ambiguous matches are still claimed so a shorter id cannot
 * steal a longer id's duplicate files.
 * @param {string[]} assetFiles
 * @param {string[]} gameIds
 * @returns {Map<string, string>}
 */
export function mapGameChunks(assetFiles, gameIds) {
  const byLength = [...gameIds].sort((a, b) => b.length - a.length);
  const map = new Map();
  const claimed = new Set();
  for (const id of byLength) {
    const matches = assetFiles.filter(
      (f) =>
        !claimed.has(f) &&
        f.startsWith(`game-${id}-`) &&
        f.endsWith('.js') &&
        !f.includes('.map')
    );
    if (matches.length === 1) {
      map.set(id, matches[0]);
      claimed.add(matches[0]);
      continue;
    }
    // 0 → missing; >1 → ambiguous hashes (fail closed / MISSING).
    for (const f of matches) claimed.add(f);
  }
  return map;
}

/**
 * @param {string} distRoot
 * @param {string[]} gameIds
 * @returns {{ id: string, file: string, gzipBytes: number }[]}
 */
export function measureGameChunks(distRoot, gameIds) {
  const assetsDir = path.join(distRoot, 'assets');
  if (!fs.existsSync(assetsDir)) {
    throw new Error(`Missing ${assetsDir}. Run npm run build first.`);
  }
  const assetFiles = fs
    .readdirSync(assetsDir)
    .filter((f) => f.startsWith('game-') && f.endsWith('.js'));
  const chunkMap = mapGameChunks(assetFiles, gameIds);
  /** @type {{ id: string, file: string, gzipBytes: number }[]} */
  const rows = [];
  for (const id of gameIds) {
    const file = chunkMap.get(id);
    if (!file) {
      rows.push({ id, file: '(missing)', gzipBytes: -1 });
      continue;
    }
    rows.push({
      id,
      file: path.join('assets', file),
      gzipBytes: gzipByteLength(path.join(assetsDir, file)),
    });
  }
  return rows;
}

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
 * Signed delta for the table (negative = under budget).
 * @param {number} n
 * @returns {string}
 */
function formatDelta(n) {
  if (!Number.isFinite(n)) return '—';
  const abs = formatBytes(Math.abs(n));
  if (n === 0) return abs;
  return n > 0 ? `+${abs}` : `-${abs}`;
}

/**
 * @param {string} label
 * @param {number} actual
 * @param {number | undefined} budget
 * @returns {{ label: string, actual: number, budget: number, delta: number, status: 'OK' | 'OVER' | 'NO BUDGET' | 'MISSING' }}
 */
function compareRow(label, actual, budget) {
  if (actual < 0) {
    return { label, actual, budget: budget ?? -1, delta: 0, status: 'MISSING' };
  }
  if (budget == null || !Number.isFinite(budget)) {
    return { label, actual, budget: -1, delta: 0, status: 'NO BUDGET' };
  }
  const delta = actual - budget;
  return {
    label,
    actual,
    budget,
    delta,
    status: actual <= budget ? 'OK' : 'OVER',
  };
}

/**
 * Split OVER labels into known (allowlisted) vs novel (new regression).
 * Also report stale allowlist entries that are no longer OVER (ratchet can shrink).
 *
 * @param {string[]} overLabels
 * @param {string[] | undefined | null} knownOvers
 * @returns {{ known: string[], novel: string[], stale: string[] }}
 */
export function partitionOvers(overLabels, knownOvers) {
  const knownSet = new Set(
    Array.isArray(knownOvers)
      ? knownOvers.filter((id) => typeof id === 'string' && id.length > 0)
      : []
  );
  const overSet = new Set(overLabels);
  const known = overLabels.filter((l) => knownSet.has(l)).sort();
  const novel = overLabels.filter((l) => !knownSet.has(l)).sort();
  const stale = [...knownSet].filter((l) => !overSet.has(l)).sort();
  return { known, novel, stale };
}

/**
 * Exit code for the CLI. Non-zero only when `--fail-on-new-over` is set and
 * there is at least one novel OVER (CI uses this under continue-on-error).
 * Non-finite or negative `novelCount` fail closed under that flag (q-mp-1253)
 * so NaN/`-1` cannot green-wash the soft gate (`novelCount > 0` is false for both).
 *
 * @param {{ novelCount: number, failOnNewOver: boolean }} opts
 * @returns {0 | 1 | 2}
 */
export function resolveSizeCheckExitCode({ novelCount, failOnNewOver }) {
  if (!failOnNewOver) return 0;
  if (
    typeof novelCount !== 'number' ||
    !Number.isFinite(novelCount) ||
    novelCount < 0
  ) {
    return 2;
  }
  if (novelCount > 0) return 1;
  return 0;
}

/**
 * Exit code after an unexpected measurement/throw in main.
 * Default (report-only) stays 0; `--fail-on-new-over` must not green-wash
 * measurement failures (q-mp-1265).
 *
 * @param {boolean} failOnNewOver
 * @returns {0 | 2}
 */
export function resolveSizeCheckCatchExitCode(failOnNewOver) {
  return failOnNewOver ? 2 : 0;
}

/**
 * @param {string[]} argv
 * @returns {{ failOnNewOver: boolean }}
 */
export function parseSizeCheckArgs(argv) {
  return { failOnNewOver: argv.includes('--fail-on-new-over') };
}

/**
 * @param {ReturnType<typeof compareRow>[]} rows
 */
function printTable(rows) {
  const cols = [
    { key: 'label', title: 'Bundle', pad: 26 },
    { key: 'actual', title: 'Gzip', pad: 12, fmt: (r) => formatBytes(r.actual) },
    {
      key: 'budget',
      title: 'Budget',
      pad: 12,
      fmt: (r) => formatBytes(r.budget),
    },
    {
      key: 'delta',
      title: 'Delta',
      pad: 12,
      fmt: (r) => {
        if (r.status === 'MISSING' || r.status === 'NO BUDGET') return '—';
        return formatDelta(r.delta);
      },
    },
    { key: 'status', title: 'Status', pad: 10, fmt: (r) => r.status },
  ];

  const header = cols.map((c) => c.title.padEnd(c.pad)).join('  ');
  const rule = cols.map((c) => '-'.repeat(c.pad)).join('  ');
  console.log(header);
  console.log(rule);
  for (const row of rows) {
    console.log(
      cols
        .map((c) => {
          const text = c.fmt ? c.fmt(row) : String(row[c.key]);
          return text.padEnd(c.pad);
        })
        .join('  ')
    );
  }
}

function main(argv = process.argv.slice(2)) {
  const { failOnNewOver } = parseSizeCheckArgs(argv);

  if (!fs.existsSync(DIST)) {
    console.error('dist/ not found. Run npm run build before size:check.');
    // Soft budget overs stay report-only (exit 0); missing build is a usage error.
    console.error('(usage error: exiting 2)');
    process.exitCode = 2;
    return;
  }

  const budgets = JSON.parse(fs.readFileSync(BUDGETS_PATH, 'utf8'));
  const knownOvers = Array.isArray(budgets.knownOvers) ? budgets.knownOvers : [];
  const menu = measureMenuCriticalPath(DIST);
  const gameIds = listGameIds(ROOT);
  const games = measureGameChunks(DIST, gameIds);

  /** @type {ReturnType<typeof compareRow>[]} */
  const rows = [
    compareRow(
      'menu-critical-path',
      menu.totalGzipBytes,
      budgets.menuCriticalPath
    ),
  ];

  for (const g of games) {
    rows.push(compareRow(`game-${g.id}`, g.gzipBytes, budgets.games?.[g.id]));
  }

  console.log('Bundle size budget check (gzip)');
  console.log(`Budgets: ${path.relative(ROOT, BUDGETS_PATH)}`);
  console.log(
    `Known OVER allowlist: ${knownOvers.length} id(s)${
      failOnNewOver ? ' · --fail-on-new-over' : ''
    }`
  );
  console.log('');
  console.log('Menu critical files:');
  for (const f of menu.files) {
    console.log(`  ${formatBytes(f.gzipBytes).padStart(10)}  ${f.path}`);
  }
  console.log('');
  printTable(rows);

  const overs = rows.filter((r) => r.status === 'OVER');
  const missing = rows.filter(
    (r) => r.status === 'MISSING' || r.status === 'NO BUDGET'
  );
  const overByLabel = new Map(overs.map((r) => [r.label, r]));
  const { known, novel, stale } = partitionOvers(
    overs.map((r) => r.label),
    knownOvers
  );

  console.log('');
  if (overs.length === 0 && missing.length === 0) {
    console.log(`All ${rows.length} budgets within limit.`);
  } else {
    if (known.length) {
      console.log(
        `${known.length} known OVER (allowlisted — warn only, ratchet may shrink):`
      );
      for (const label of known) {
        const r = overByLabel.get(label);
        const msg = r
          ? `${r.label}: ${formatBytes(r.actual)} > ${formatBytes(r.budget)}`
          : label;
        console.log(`  - ${msg}`);
        console.log(`::warning::Bundle budget known OVER — ${msg}`);
      }
    }
    if (novel.length) {
      console.log(
        `${novel.length} NEW OVER (not in knownOvers allowlist — loud flag):`
      );
      for (const label of novel) {
        const r = overByLabel.get(label);
        const msg = r
          ? `${r.label}: ${formatBytes(r.actual)} > ${formatBytes(r.budget)}`
          : label;
        console.log(`  - ${msg}`);
        // ::error:: surfaces in the Actions UI; exit non-zero only with the flag.
        console.log(`::error::Bundle budget NEW OVER — ${msg}`);
      }
    }
    if (missing.length) {
      console.log(`${missing.length} missing chunk or budget entry:`);
      for (const r of missing) {
        console.log(`  - ${r.label} (${r.status})`);
        console.log(`::warning::Bundle budget gap — ${r.label} (${r.status})`);
      }
    }
  }

  if (stale.length) {
    console.log('');
    console.log(
      `${stale.length} knownOvers entry(ies) no longer OVER (shrink the allowlist):`
    );
    for (const label of stale) {
      console.log(`  - ${label}`);
      console.log(
        `::notice::Bundle budget knownOvers stale — remove ${label} (ratchet down)`
      );
    }
  }

  process.exitCode = resolveSizeCheckExitCode({
    novelCount: novel.length,
    failOnNewOver,
  });
  if (process.exitCode === 1) {
    console.log('');
    console.log(
      'Exiting 1 because --fail-on-new-over saw NEW OVER row(s). CI keeps this step continue-on-error so the build job stays green.'
    );
  }
}

const isMain =
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  const argv = process.argv.slice(2);
  const { failOnNewOver } = parseSizeCheckArgs(argv);
  try {
    main(argv);
  } catch (err) {
    console.error(err instanceof Error ? err.message : err);
    const code = resolveSizeCheckCatchExitCode(failOnNewOver);
    if (code === 0) {
      console.error('(report-only: exiting 0)');
    } else {
      console.error(
        `(fail-on-new-over: exiting ${code} after measurement error)`
      );
    }
    process.exitCode = code;
  }
}
