#!/usr/bin/env node
/**
 * Report-only build reproducibility + PWA precache audit.
 *
 * Builds twice from a clean dist/, diffs hashes / chunk names / webmanifest /
 * Workbox precache list, then checks:
 *   - every precached URL exists in dist
 *   - every offline-needed dist asset is precached
 *   - no .map sourcemaps shipped
 *   - base-path absolute URLs are root-relative (`/...`)
 *   - no absolute workspace paths or obvious env leakage in JS/CSS/HTML
 *
 * Always exits 0 (report-only). Writes test-results/build/summary.md (+ JSON).
 *
 * Usage:
 *   npm run check:build
 *   CHECK_BUILD_SKIP_BUILD=1 npm run check:build   # reuse existing dist-a/b
 */

import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const OUT_DIR = path.join(ROOT, 'test-results', 'build');
const DIST_A = path.join(OUT_DIR, 'dist-a');
const DIST_B = path.join(OUT_DIR, 'dist-b');
const SUMMARY_MD = path.join(OUT_DIR, 'summary.md');
const SUMMARY_JSON = path.join(OUT_DIR, 'summary.json');

const SKIP_BUILD = process.env.CHECK_BUILD_SKIP_BUILD === '1';

/** Deploy / SW runtime files that are not part of the Workbox precache. */
export const PRECACHE_EXEMPT = new Set([
  '_headers',
  '_redirects',
  'sw.js',
]);

/**
 * Inter weights intentionally excluded from first-install precache
 * (runtime CacheFirst in vite.config.ts).
 */
export const PRECACHE_FONT_IGNORES = new Set([
  'fonts/inter-latin-500-normal.woff2',
  'fonts/inter-latin-600-normal.woff2',
  'fonts/inter-latin-700-normal.woff2',
]);

/** Extensions Workbox globPatterns cover for offline play. */
export const OFFLINE_EXTS = new Set([
  '.js',
  '.css',
  '.html',
  '.ico',
  '.svg',
  '.png',
  '.txt',
  '.webmanifest',
  '.woff',
  '.woff2',
]);

/**
 * Parse Workbox precache entries from generated sw.js.
 * @param {string} swSource
 * @returns {{ url: string, revision: string | null }[]}
 */
export function parsePrecacheManifest(swSource) {
  const entries = [];
  const re =
    /\{\s*url:\s*"([^"]+)"\s*,\s*revision:\s*(?:"([^"]*)"|null)\s*\}/g;
  for (const match of swSource.matchAll(re)) {
    entries.push({
      url: match[1],
      revision: match[2] === undefined ? null : match[2],
    });
  }
  return entries;
}

/**
 * @param {string} root
 * @returns {Map<string, string>} relative path → sha256 hex
 */
export function hashTree(root) {
  /** @type {Map<string, string>} */
  const map = new Map();
  if (!fs.existsSync(root)) return map;
  /** @param {string} dir */
  function walk(dir) {
    for (const name of fs.readdirSync(dir).sort()) {
      const abs = path.join(dir, name);
      const rel = path.relative(root, abs).split(path.sep).join('/');
      const st = fs.statSync(abs);
      if (st.isDirectory()) {
        walk(abs);
      } else if (st.isFile()) {
        const hash = crypto
          .createHash('sha256')
          .update(fs.readFileSync(abs))
          .digest('hex');
        map.set(rel, hash);
      }
    }
  }
  walk(root);
  return map;
}

/**
 * Compare two hash trees.
 * @param {Map<string, string>} a
 * @param {Map<string, string>} b
 */
export function diffHashTrees(a, b) {
  const onlyA = [...a.keys()].filter((k) => !b.has(k)).sort();
  const onlyB = [...b.keys()].filter((k) => !a.has(k)).sort();
  const contentDiff = [...a.keys()]
    .filter((k) => b.has(k) && a.get(k) !== b.get(k))
    .sort();
  return { onlyA, onlyB, contentDiff };
}

/**
 * Chunk / asset basenames under assets/ and vendor/.
 * @param {Map<string, string>} tree
 * @returns {string[]}
 */
export function listChunkNames(tree) {
  return [...tree.keys()]
    .filter(
      (p) =>
        (p.startsWith('assets/') || p.startsWith('vendor/')) &&
        /\.(js|css)$/.test(p)
    )
    .sort();
}

/**
 * Offline-needed dist paths that should appear in the precache (minus exempt).
 * @param {Iterable<string>} relPaths
 * @returns {string[]}
 */
export function offlineNeededPaths(relPaths) {
  const out = [];
  for (const rel of relPaths) {
    if (PRECACHE_EXEMPT.has(rel)) continue;
    if (PRECACHE_FONT_IGNORES.has(rel)) continue;
    if (rel.startsWith('workbox-')) continue;
    const ext = path.posix.extname(rel);
    // CNAME has no extension but is includeAssets'd — treat as optional infra.
    if (rel === 'CNAME') continue;
    if (OFFLINE_EXTS.has(ext)) out.push(rel);
  }
  return out.sort();
}

/**
 * @param {string} distRoot
 */
export function auditPrecache(distRoot) {
  const swPath = path.join(distRoot, 'sw.js');
  if (!fs.existsSync(swPath)) {
    return {
      ok: false,
      error: 'missing sw.js',
      entries: [],
      missingFromDist: [],
      notPrecached: [],
      urls: [],
    };
  }
  const entries = parsePrecacheManifest(fs.readFileSync(swPath, 'utf8'));
  const urls = entries.map((e) => e.url.replace(/^\//, ''));
  const urlSet = new Set(urls);
  /** @type {Map<string, number>} */
  const counts = new Map();
  for (const u of urls) counts.set(u, (counts.get(u) || 0) + 1);
  const duplicates = [...counts.entries()]
    .filter(([, n]) => n > 1)
    .map(([u, n]) => `${u} (×${n})`)
    .sort();
  const tree = hashTree(distRoot);
  const missingFromDist = [...urlSet].filter((u) => !tree.has(u)).sort();
  const needed = offlineNeededPaths(tree.keys());
  const notPrecached = needed.filter((p) => !urlSet.has(p));
  const sortedByUrl = [...urls].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  // vite-plugin-pwa / workbox-build append additionalManifestEntries after
  // manifestTransforms. Expected stable tail: CNAME (includeAssets) then
  // site.webmanifest (auto-injected from the VitePWA manifest option).
  const expectedTail = ['CNAME', 'site.webmanifest'];
  let body = urls;
  if (
    urls.length >= expectedTail.length &&
    expectedTail.every((u, i) => urls[urls.length - expectedTail.length + i] === u)
  ) {
    body = urls.slice(0, -expectedTail.length);
  }
  const sortedBody = [...body].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  const orderOk =
    duplicates.length === 0 &&
    JSON.stringify(body) === JSON.stringify(sortedBody);
  return {
    ok:
      missingFromDist.length === 0 &&
      notPrecached.length === 0 &&
      duplicates.length === 0,
    error: null,
    entries,
    missingFromDist,
    notPrecached,
    duplicates,
    orderOk,
    urls: sortedByUrl,
    urlsInSwOrder: urls,
  };
}

/**
 * Scan built text assets for absolute paths / env leakage.
 * @param {string} distRoot
 * @returns {{ path: string, finding: string }[]}
 */
export function scanEnvLeakage(distRoot) {
  /** @type {{ path: string, finding: string }[]} */
  const findings = [];
  const needles = [
    { re: /\/workspace\//, label: 'absolute /workspace path' },
    { re: /\/home\/[A-Za-z0-9._-]+\//, label: 'absolute /home path' },
    { re: /[A-Z]:\\/, label: 'Windows absolute path' },
    { re: /file:\/\/\//, label: 'file:// URL' },
    { re: /sourceMappingURL\s*=/, label: 'sourceMappingURL' },
  ];
  for (const rel of hashTree(distRoot).keys()) {
    if (!/\.(js|css|html|webmanifest|txt)$/.test(rel)) continue;
    if (rel.startsWith('workbox-') || rel === 'sw.js') continue;
    const text = fs.readFileSync(path.join(distRoot, rel), 'utf8');
    for (const { re, label } of needles) {
      if (re.test(text)) {
        findings.push({ path: rel, finding: label });
      }
    }
  }
  return findings;
}

/**
 * @param {string} distRoot
 */
export function auditSourcemapsAndBase(distRoot) {
  const tree = hashTree(distRoot);
  const maps = [...tree.keys()].filter((p) => p.endsWith('.map'));
  const htmlPath = path.join(distRoot, 'index.html');
  const manifestPath = path.join(distRoot, 'site.webmanifest');
  const html = fs.existsSync(htmlPath)
    ? fs.readFileSync(htmlPath, 'utf8')
    : '';
  const manifest = fs.existsSync(manifestPath)
    ? fs.readFileSync(manifestPath, 'utf8')
    : '';
  const htmlAssetRefs = [
    ...html.matchAll(/(?:src|href)="([^"]+)"/g),
  ].map((m) => m[1]);
  const nonRootAbsolute = htmlAssetRefs.filter(
    (href) =>
      href.startsWith('/') === false &&
      !href.startsWith('#') &&
      !href.startsWith('data:') &&
      // skip-link / in-page only; module scripts must be root-absolute with base /
      /\.(js|css|webmanifest|ico|svg|png|woff2?)$/.test(href)
  );
  let manifestOk = true;
  /** @type {string[]} */
  const manifestIssues = [];
  try {
    const m = JSON.parse(manifest || '{}');
    if (m.start_url !== '/') {
      manifestOk = false;
      manifestIssues.push(`start_url=${JSON.stringify(m.start_url)}`);
    }
    if (m.scope !== '/') {
      manifestOk = false;
      manifestIssues.push(`scope=${JSON.stringify(m.scope)}`);
    }
    for (const icon of m.icons || []) {
      if (typeof icon.src === 'string' && !icon.src.startsWith('/')) {
        manifestOk = false;
        manifestIssues.push(`icon src not root-absolute: ${icon.src}`);
      }
    }
  } catch (err) {
    manifestOk = false;
    manifestIssues.push(`manifest parse error: ${String(err)}`);
  }
  return {
    sourcemapCount: maps.length,
    sourcemapFiles: maps,
    htmlNonRootAssetRefs: nonRootAbsolute,
    manifestOk,
    manifestIssues,
  };
}

/**
 * @param {string} from
 * @param {string} to
 */
function copyDist(from, to) {
  fs.rmSync(to, { recursive: true, force: true });
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.cpSync(from, to, { recursive: true });
}

function runBuild(label) {
  fs.rmSync(DIST, { recursive: true, force: true });
  const result = spawnSync('npm', ['run', 'build'], {
    cwd: ROOT,
    encoding: 'utf8',
    env: {
      ...process.env,
      // Keep optional plugins off so dual builds compare the default artifact.
      PERF_VISUALIZE: '',
      PWA_DEV: '',
    },
  });
  if (result.status !== 0) {
    const err = (result.stderr || result.stdout || '').slice(-2000);
    throw new Error(`Build ${label} failed (exit ${result.status}):\n${err}`);
  }
}

function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const started = new Date().toISOString();

  if (!SKIP_BUILD) {
    console.log('check:build — clean build A…');
    runBuild('A');
    copyDist(DIST, DIST_A);
    console.log('check:build — clean build B…');
    runBuild('B');
    copyDist(DIST, DIST_B);
  } else {
    console.log('check:build — CHECK_BUILD_SKIP_BUILD=1, reusing snapshots');
    if (!fs.existsSync(DIST_A) || !fs.existsSync(DIST_B)) {
      throw new Error('dist-a/dist-b missing; run without CHECK_BUILD_SKIP_BUILD');
    }
  }

  const treeA = hashTree(DIST_A);
  const treeB = hashTree(DIST_B);
  const fileDiff = diffHashTrees(treeA, treeB);
  const chunksA = listChunkNames(treeA);
  const chunksB = listChunkNames(treeB);
  const chunkNameDiff = {
    onlyA: chunksA.filter((c) => !chunksB.includes(c)),
    onlyB: chunksB.filter((c) => !chunksA.includes(c)),
  };

  const manifestA = fs.existsSync(path.join(DIST_A, 'site.webmanifest'))
    ? fs.readFileSync(path.join(DIST_A, 'site.webmanifest'), 'utf8')
    : '';
  const manifestB = fs.existsSync(path.join(DIST_B, 'site.webmanifest'))
    ? fs.readFileSync(path.join(DIST_B, 'site.webmanifest'), 'utf8')
    : '';
  const manifestIdentical = manifestA === manifestB;

  const precacheA = auditPrecache(DIST_A);
  const precacheB = auditPrecache(DIST_B);
  const precacheUrlsIdentical =
    JSON.stringify(precacheA.urls) === JSON.stringify(precacheB.urls);
  const precacheEntriesIdentical =
    JSON.stringify(precacheA.entries) === JSON.stringify(precacheB.entries);

  const leaks = scanEnvLeakage(DIST_B);
  const policy = auditSourcemapsAndBase(DIST_B);

  const byteIdentical =
    fileDiff.onlyA.length === 0 &&
    fileDiff.onlyB.length === 0 &&
    fileDiff.contentDiff.length === 0;

  const summary = {
    taskId: 'burn-1008-mp-build-repro',
    started,
    finished: new Date().toISOString(),
    skipBuild: SKIP_BUILD,
    fileCounts: { a: treeA.size, b: treeB.size },
    byteIdentical,
    fileDiff,
    chunkNameDiff,
    manifestIdentical,
    precache: {
      countA: precacheA.entries.length,
      countB: precacheB.entries.length,
      uniqueA: precacheA.urls.length,
      uniqueB: precacheB.urls.length,
      urlsIdentical: precacheUrlsIdentical,
      entriesIdentical: precacheEntriesIdentical,
      missingFromDist: precacheB.missingFromDist,
      notPrecached: precacheB.notPrecached,
      duplicates: precacheB.duplicates,
      orderOk: precacheB.orderOk,
      ok: precacheB.ok,
    },
    sourcemaps: policy,
    envLeakage: leaks,
    notes: [
      'Inter 500/600/700 woff2 intentionally excluded from precache (runtime CacheFirst).',
      'CNAME / _headers / _redirects / sw.js / workbox-* are deploy or SW runtime, not offline game assets.',
      'Educational /demo/* chunks are production routes (not test fixtures).',
      'MP3D window.__mp3d* test hooks in 3D boards are game-code (out of build-config scope).',
    ],
  };

  fs.writeFileSync(SUMMARY_JSON, `${JSON.stringify(summary, null, 2)}\n`);

  const md = [
    '# Build reproducibility report',
    '',
    `Task: \`${summary.taskId}\``,
    `Generated: ${summary.finished}`,
    '',
    '## Dual clean build',
    '',
    `| Metric | Result |`,
    `| --- | --- |`,
    `| Files (A / B) | ${summary.fileCounts.a} / ${summary.fileCounts.b} |`,
    `| Byte-identical | ${byteIdentical ? 'YES' : 'NO'} |`,
    `| site.webmanifest identical | ${manifestIdentical ? 'YES' : 'NO'} |`,
    `| Precache URL list identical | ${precacheUrlsIdentical ? 'YES' : 'NO'} |`,
    `| Precache entries (url+revision) identical | ${precacheEntriesIdentical ? 'YES' : 'NO'} |`,
    '',
    '### File diffs',
    '',
  ];

  if (byteIdentical) {
    md.push('_None — trees match byte-for-byte (SHA-256)._', '');
  } else {
    md.push(
      `- Only in A: ${fileDiff.onlyA.length ? fileDiff.onlyA.join(', ') : '—'}`,
      `- Only in B: ${fileDiff.onlyB.length ? fileDiff.onlyB.join(', ') : '—'}`,
      `- Content differs: ${
        fileDiff.contentDiff.length ? fileDiff.contentDiff.join(', ') : '—'
      }`,
      ''
    );
  }

  md.push(
    '### Chunk name diffs',
    '',
    `- Only in A: ${chunkNameDiff.onlyA.length ? chunkNameDiff.onlyA.join(', ') : '—'}`,
    `- Only in B: ${chunkNameDiff.onlyB.length ? chunkNameDiff.onlyB.join(', ') : '—'}`,
    '',
    '## Precache audit (build B)',
    '',
    `| Check | Result |`,
    `| --- | --- |`,
    `| Precache entries (raw) | ${precacheB.entries.length} |`,
    `| Precache unique URLs | ${precacheB.urls.length} |`,
    `| Duplicate precache URLs | ${precacheB.duplicates.length} |`,
    `| Glob portion URL-sorted | ${precacheB.orderOk ? 'YES' : 'NO'} |`,
    `| Precached URL missing from dist | ${precacheB.missingFromDist.length} |`,
    `| Offline asset not precached | ${precacheB.notPrecached.length} |`,
    `| Precache OK | ${precacheB.ok ? 'YES' : 'NO'} |`,
    ''
  );

  if (precacheB.duplicates.length) {
    md.push(
      'Duplicates:',
      ...precacheB.duplicates.map((u) => `- \`${u}\``),
      ''
    );
  }
  if (precacheB.missingFromDist.length) {
    md.push(
      'Missing from dist:',
      ...precacheB.missingFromDist.map((u) => `- \`${u}\``),
      ''
    );
  }
  if (precacheB.notPrecached.length) {
    md.push(
      'Not precached:',
      ...precacheB.notPrecached.map((u) => `- \`${u}\``),
      ''
    );
  }

  md.push(
    '## Sourcemap + base path',
    '',
    `| Check | Result |`,
    `| --- | --- |`,
    `| \`.map\` files in dist | ${policy.sourcemapCount} |`,
    `| Non-root asset refs in index.html | ${policy.htmlNonRootAssetRefs.length} |`,
    `| Manifest start_url/scope/icons | ${policy.manifestOk ? 'OK' : policy.manifestIssues.join('; ')} |`,
    '',
    '## Env / path leakage scan',
    ''
  );

  if (leaks.length === 0) {
    md.push('_No absolute workspace paths, file:// URLs, or sourceMappingURL found._', '');
  } else {
    for (const hit of leaks) {
      md.push(`- \`${hit.path}\`: ${hit.finding}`);
    }
    md.push('');
  }

  md.push('## Notes', '', ...summary.notes.map((n) => `- ${n}`), '');

  fs.writeFileSync(SUMMARY_MD, `${md.join('\n')}\n`);

  console.log(`check:build — wrote ${path.relative(ROOT, SUMMARY_MD)}`);
  console.log(
    `check:build — byteIdentical=${byteIdentical} precacheOk=${precacheB.ok} leaks=${leaks.length}`
  );
  // Report-only: never fail CI / local gates.
  process.exitCode = 0;
}

const isMain =
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  try {
    main();
  } catch (err) {
    console.error('check:build error:', err);
    // Still report-only — surface the error in the summary and exit 0.
    fs.mkdirSync(OUT_DIR, { recursive: true });
    const msg = err instanceof Error ? err.stack || err.message : String(err);
    fs.writeFileSync(
      SUMMARY_MD,
      `# Build reproducibility report\n\n**ERROR** (report-only exit 0)\n\n\`\`\`\n${msg}\n\`\`\`\n`
    );
    fs.writeFileSync(
      SUMMARY_JSON,
      `${JSON.stringify({ ok: false, error: String(err) }, null, 2)}\n`
    );
    process.exitCode = 0;
  }
}
