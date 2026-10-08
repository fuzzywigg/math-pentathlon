#!/usr/bin/env node
/**
 * Dead-code inventory (report-only) — burn-1008-mp-dead-code-removal-exec.
 *
 * Combines:
 *   1. knip (unused files / exports / deps) with dynamic-import-aware entries
 *   2. CSS class scan + dynamic-template awareness
 *   3. Feature-flag catalog (URL / localStorage toggles)
 *   4. Test-helper reachability (including side-effect imports)
 *   5. Grep + registry / dynamic-import verification for every candidate
 *
 * Always exits 0 (report-only). Writes docs/dev/dead-code-inventory.md.
 * Disposition column: removed (this PR) / kept / deferred (#526 fixtures).
 *
 * Usage: npm run report:dead-code
 */

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_MD = path.join(ROOT, 'docs/dev/dead-code-inventory.md');
const OUT_JSON = path.join(ROOT, 'docs/dev/dead-code-inventory.json');

/** Tip-fold keepers restored after #497 — do not recommend removal. */
const TIP_FOLD_KEEPERS = new Set([
  'BOARD_3D_PARAM',
  'isBoardActivateKey',
  'isKeyboardReachable',
  'BOARD_3D_LQ_PARAM',
  'BOARD_3D_LQ_STORAGE_KEY',
  'MP3D_READY_ATTR',
  'OwlComponent',
  'resetSettingsFlagsForTests',
]);

/** Open draft PRs that already cover adjacent cleanup — defer, don't redo. */
const DEFER_TO_OPEN_PRS = [
  {
    pr: 518,
    topic: 'UI helper dedupe',
    note: 'Shared seat/die/hex/timeout helpers — not dead-code removal',
  },
  {
    pr: 520,
    topic: 'lint ratchet',
    note: 'ESLint rule enablement — not unused-symbol inventory',
  },
  {
    pr: 523,
    topic: 'module boundaries (in tip)',
    note: 'Import-graph / layering ratchet already folded',
  },
  {
    pr: 526,
    topic: 'test fixture consolidation',
    note: 'Helper moves/merges — inventory lists unused helper *exports* only',
  },
];

/**
 * Removals executed in burn-1008-mp-dead-code-removal-exec (re-verified on tip).
 * Keys: `${kind}|${path}|${symbol}`.
 * @type {Map<string, { action: string; note: string }>}
 */
const EXECUTED_REMOVALS = new Map([
  [
    'export|src/core/dom-security.ts|setChildren',
    {
      action: 'removed',
      note: 'deleted unused export (zero external refs)',
    },
  ],
  [
    'export|src/core/storage/sanitize.ts|MAX_PROFILE_ID_LENGTH',
    {
      action: 'removed',
      note: 'demoted to module-private const',
    },
  ],
  [
    'export|src/core/storage/sanitize.ts|MAX_GAME_ID_LENGTH',
    {
      action: 'removed',
      note: 'demoted to module-private const',
    },
  ],
  [
    'export|src/core/storage/sanitize.ts|MAX_ACHIEVEMENT_ID_LENGTH',
    {
      action: 'removed',
      note: 'demoted to module-private const',
    },
  ],
  [
    'css-class|src/style.css|game-selector-header',
    {
      action: 'removed',
      note: 'deleted dead CSS rule (live class is game-selector-hero)',
    },
  ],
  [
    'css-class|src/style.css|tutorial-action-target',
    {
      action: 'removed',
      note: 'deleted dead CSS selectors (live class is tutorial-tap-target)',
    },
  ],
  [
    'export|src/ui/game-prefetch.ts|allowGamePrefetchImportsForTests',
    {
      action: 'removed',
      note: 'demoted to module-private; used by resetGamePrefetchForTests',
    },
  ],
  [
    'export|src/ui/game-route-mounts.ts|resetGameMountDepsForTests',
    {
      action: 'removed',
      note: 'deleted unused test-hook export (zero refs)',
    },
  ],
]);

/**
 * @param {{ kind: string; path: string; symbol?: string }} row
 * @returns {'removed' | 'deferred' | 'kept'}
 */
function dispositionFor(row) {
  const key = `${row.kind}|${row.path}|${row.symbol || ''}`;
  if (EXECUTED_REMOVALS.has(key)) return 'removed';
  if (row.kind === 'test-helper-export' && row.safeToRemove === 'yes') {
    return 'deferred';
  }
  return 'kept';
}

/**
 * @param {string} dir
 * @param {(p: string) => boolean} pred
 * @param {string[]} [out]
 */
function walk(dir, pred, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (
        ent.name === 'node_modules' ||
        ent.name === 'dist' ||
        ent.name === 'coverage' ||
        ent.name === 'test-results'
      ) {
        continue;
      }
      walk(p, pred, out);
    } else if (ent.isFile() && pred(p)) {
      out.push(p);
    }
  }
  return out;
}

/** @param {string} abs */
function relRoot(abs) {
  return path.relative(ROOT, abs).split(path.sep).join('/');
}

/** Explicit roots — ripgrep with only ignore-globs and no path can match nothing here. */
const RG_PATHS = ['src', 'tests', 'scripts', 'index.html', 'package.json'];
/** Docs are searched only for narrative evidence, never as "usage" (inventory self-hits). */

/**
 * @param {string} pattern
 * @param {string[]} [extraPaths]
 * @returns {string[]}
 */
function rgFiles(pattern, extraPaths = []) {
  const args = [
    '-l',
    '--glob',
    '!node_modules',
    '--glob',
    '!dist',
    pattern,
    ...RG_PATHS,
    ...extraPaths,
  ];
  const r = spawnSync('rg', args, {
    cwd: ROOT,
    encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024,
  });
  if (r.status !== 0 && r.status !== 1) {
    return [];
  }
  return (r.stdout || '')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * @param {string} pattern
 * @returns {string[]}
 */
function rgLines(pattern) {
  const r = spawnSync(
    'rg',
    [
      '-n',
      '--glob',
      '!node_modules',
      '--glob',
      '!dist',
      pattern,
      ...RG_PATHS,
    ],
    { cwd: ROOT, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 }
  );
  if (r.status !== 0 && r.status !== 1) return [];
  return (r.stdout || '')
    .split('\n')
    .map((s) => s.trimEnd())
    .filter(Boolean);
}

function runKnip() {
  // Pinned via npx (not a lockfile dep): knip→fast-glob→micromatch→braces
  // currently fails npm audit; keep the app lockfile at 0 vulnerabilities.
  const r = spawnSync(
    'npx',
    ['--yes', 'knip@5.88.1', '--reporter', 'json'],
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
    };
  }
  try {
    return JSON.parse(raw);
  } catch {
    const start = raw.indexOf('{');
    if (start >= 0) {
      try {
        return JSON.parse(raw.slice(start));
      } catch {
        /* fall through */
      }
    }
    return {
      files: [],
      issues: [],
      error: 'Failed to parse knip JSON',
      rawHead: raw.slice(0, 500),
    };
  }
}

/**
 * Normalize knip JSON ({ files, issues[] }) into flat candidate records.
 * @param {*} knip
 */
function flattenKnip(knip) {
  /** @type {Array<{kind:string,path:string,symbol?:string,source:string}>} */
  const out = [];
  for (const f of knip.files || []) {
    out.push({
      kind: 'file',
      path: typeof f === 'string' ? f : f.file,
      source: 'knip',
    });
  }
  for (const issue of knip.issues || []) {
    const file = issue.file;
    if (!file) continue;
    for (const exp of issue.exports || []) {
      const name = typeof exp === 'string' ? exp : exp.name;
      if (name) {
        out.push({ kind: 'export', path: file, symbol: name, source: 'knip' });
      }
    }
    for (const typ of issue.types || []) {
      const name = typeof typ === 'string' ? typ : typ.name;
      if (name) {
        out.push({
          kind: 'unused-type',
          path: file,
          symbol: name,
          source: 'knip',
        });
      }
    }
    for (const dep of issue.dependencies || []) {
      const name = typeof dep === 'string' ? dep : dep.name;
      if (name) {
        out.push({
          kind: 'dependency',
          path: 'package.json',
          symbol: name,
          source: 'knip',
        });
      }
    }
    for (const dep of issue.devDependencies || []) {
      const name = typeof dep === 'string' ? dep : dep.name;
      if (name) {
        out.push({
          kind: 'dependency',
          path: 'package.json',
          symbol: name,
          detail: 'devDependency',
          source: 'knip',
        });
      }
    }
  }
  return out;
}

function runDepcheck() {
  const r = spawnSync(
    'npx',
    [
      '--yes',
      'depcheck@1.4.7',
      '--json',
      '--ignores=virtual:pwa-register,@types/*,eslint-config-prettier',
    ],
    {
      cwd: ROOT,
      encoding: 'utf8',
      maxBuffer: 16 * 1024 * 1024,
      shell: process.platform === 'win32',
    }
  );
  try {
    const start = (r.stdout || '').indexOf('{');
    if (start < 0) return { dependencies: [], devDependencies: [] };
    return JSON.parse(r.stdout.slice(start));
  } catch {
    return { dependencies: [], devDependencies: [], error: 'depcheck parse fail' };
  }
}

/**
 * Collect dynamic-import specs and game registry ids for verification.
 */
function collectDynamicAndRegistry() {
  const mounts = fs.readFileSync(
    path.join(ROOT, 'src/ui/game-route-mounts.ts'),
    'utf8'
  );
  const prefetch = fs.readFileSync(
    path.join(ROOT, 'src/ui/game-prefetch.ts'),
    'utf8'
  );
  const main = fs.readFileSync(path.join(ROOT, 'src/main.ts'), 'utf8');
  const registry = fs.readFileSync(
    path.join(ROOT, 'src/core/game-registry.ts'),
    'utf8'
  );
  const dyn = new Set();
  for (const text of [mounts, prefetch, main]) {
    for (const m of text.matchAll(/import\(\s*['"]([^'"]+)['"]\s*\)/g)) {
      dyn.add(m[1]);
    }
  }
  const gameIds = [...registry.matchAll(/id:\s*'([^']+)'/g)].map((m) => m[1]);
  return { dynamicImports: [...dyn].sort(), gameIds };
}

/**
 * Verify a symbol/path candidate via grep + dynamic-import / registry checks.
 * @param {{ kind: string, path: string, symbol?: string }} cand
 */
function verifyCandidate(cand) {
  const evidence = [];
  let externalRefs = 0;
  let dynamicHit = false;
  let registryHit = false;

  if (cand.symbol) {
    const files = rgFiles(`\\b${cand.symbol}\\b`);
    const external = files.filter(
      (f) =>
        f !== cand.path &&
        !f.startsWith('docs/') &&
        !f.endsWith('dead-code-inventory.md') &&
        !f.endsWith('dead-code-inventory.json')
    );
    externalRefs = external.length;
    evidence.push(
      external.length
        ? `grep: ${external.length} file(s) outside defining module (${external.slice(0, 3).join(', ')})`
        : 'grep: no references outside defining module'
    );
    // Dynamic string construction often uses template suffixes
    if (
      cand.symbol.startsWith('difficulty-') ||
      /-p[12]$/.test(cand.symbol) ||
      cand.symbol.includes('path-p')
    ) {
      evidence.push('note: may be built via template literal — check className patterns');
    }
  } else if (cand.path) {
    const base = path.basename(cand.path);
    const stem = base.replace(/\.(ts|mjs|js|css)$/, '');
    const files = rgFiles(stem);
    const external = files.filter(
      (f) =>
        f !== cand.path &&
        !f.startsWith('docs/') &&
        // Prefer real imports of this helper module
        (f.startsWith('tests/') || f.startsWith('scripts/') || f.startsWith('src/'))
    );
    // For helper modules, require import-shaped reference to the stem path
    if (cand.kind === 'test-helper-module' || cand.kind === 'file') {
      const real = external.filter((f) => {
        const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
        return (
          new RegExp(`['\"][^'\"]*${stem}['\"]`).test(t) ||
          t.includes(cand.path)
        );
      });
      externalRefs = real.length;
      evidence.push(
        real.length
          ? `import-shaped refs: ${real.length} (${real.slice(0, 4).join(', ')})`
          : 'grep stem: no import-shaped external references'
      );
    } else {
      externalRefs = external.length;
      evidence.push(
        external.length
          ? `grep stem: ${external.length} hit(s) (${external.slice(0, 4).join(', ')})`
          : 'grep stem: no external references'
      );
    }
  }

  const { dynamicImports, gameIds } = collectDynamicAndRegistry();
  if (cand.path?.includes('/games/')) {
    const parts = cand.path.split('/');
    const gi = parts.indexOf('games');
    const gameId = gi >= 0 ? parts[gi + 1] : null;
    if (gameId && gameIds.includes(gameId)) {
      registryHit = true;
      evidence.push(`registry: game id '${gameId}' is registered`);
    }
    const needle = cand.path
      .replace(/^src\//, '')
      .replace(/\.ts$/, '');
    if (dynamicImports.some((d) => d.includes(needle) || d.includes(gameId || ''))) {
      dynamicHit = true;
      evidence.push('dynamic-import: referenced from mounts/prefetch/main');
    }
  }

  return { externalRefs, dynamicHit, registryHit, evidence };
}

/**
 * Rank + safe-to-remove decision.
 * @param {*} cand
 * @param {*} verification
 */
function rankCandidate(cand, verification) {
  const sym = cand.symbol || '';
  if (TIP_FOLD_KEEPERS.has(sym)) {
    return {
      rank: 3,
      safeToRemove: 'no',
      reason: 'tip-fold keeper after #497 (intentional export surface)',
    };
  }
  if (cand.kind === 'file' && /^(src\/games\/|public\/|tests\/)/.test(cand.path)) {
    return {
      rank: 4,
      safeToRemove: 'no',
      reason: 'games / asset / test path — deletion barred by task rules',
    };
  }
  if (verification.dynamicHit || verification.registryHit) {
    return {
      rank: 4,
      safeToRemove: 'no',
      reason: 'reachable via dynamic import or game registry',
    };
  }
  if (cand.kind === 'css-class' && verification.externalRefs === 0) {
    // difficulty-* is template-built
    if (sym.startsWith('difficulty-')) {
      return {
        rank: 4,
        safeToRemove: 'no',
        reason: 'applied via `difficulty-${game.difficulty}` template',
      };
    }
    if (/star-track-path-p[12]/.test(sym)) {
      return {
        rank: 4,
        safeToRemove: 'no',
        reason: 'applied via `star-track-path-${p1|p2}` template in board-ui',
      };
    }
    return {
      rank: 1,
      safeToRemove: 'yes',
      reason: 'CSS class never assigned in TS/HTML (rule-only leftover)',
    };
  }
  if (cand.kind === 'unused-type' && verification.externalRefs === 0) {
    return {
      rank: 3,
      safeToRemove: 'review',
      reason: 'exported type unused outside module — often intentional public API',
    };
  }
  if (cand.kind === 'export' && verification.externalRefs === 0) {
    // Same-file-only usage: demote export rather than delete implementation
    const sameFileHits = rgLines(`\\b${cand.symbol}\\b`).filter((line) =>
      line.startsWith(`${cand.path}:`)
    );
    const usedInternally = sameFileHits.length > 1;
    if (cand.path.startsWith('tests/')) {
      return {
        rank: 2,
        safeToRemove: 'yes',
        reason: usedInternally
          ? 'test helper: demote export (used only inside helper module)'
          : 'test helper export with zero references (drop or demote)',
      };
    }
    if (cand.path.endsWith('/index.ts')) {
      return {
        rank: 2,
        safeToRemove: 'yes',
        reason: 'barrel re-export unused by importers (keep implementation module)',
      };
    }
    return {
      rank: 1,
      safeToRemove: 'yes',
      reason: usedInternally
        ? 'demote to module-private (used only inside defining file)'
        : 'production export with zero references after grep',
    };
  }
  if (cand.kind === 'dependency') {
    return {
      rank: 1,
      safeToRemove: 'yes',
      reason: 'depcheck reports unused direct dependency',
    };
  }
  if (cand.kind === 'feature-flag') {
    const sameFileHits = rgLines(`\\b${cand.symbol}\\b`).filter((line) =>
      line.startsWith(`${cand.path}:`)
    );
    if (sameFileHits.length > 1) {
      return {
        rank: 4,
        safeToRemove: 'no',
        reason: 'flag constant used inside its defining module',
      };
    }
    return {
      rank: verification.externalRefs > 0 ? 4 : 2,
      safeToRemove: verification.externalRefs > 0 ? 'no' : 'review',
      reason:
        verification.externalRefs > 0
          ? 'flag is read at runtime'
          : 'flag constant has no readers — confirm before removal',
    };
  }
  if (
    (cand.kind === 'test-helper-module' ||
      cand.kind === 'test-helper-export') &&
    verification.externalRefs > 0
  ) {
    return {
      rank: 4,
      safeToRemove: 'no',
      reason: 'helper is imported / referenced by tests',
    };
  }
  if (verification.externalRefs > 0) {
    return {
      rank: 4,
      safeToRemove: 'no',
      reason: 'external references found',
    };
  }
  if (
    cand.kind === 'test-helper-module' ||
    cand.kind === 'test-helper-export'
  ) {
    return {
      rank: 2,
      safeToRemove: 'yes',
      reason: 'test helper with zero importers after grep',
    };
  }
  return {
    rank: 2,
    safeToRemove: 'review',
    reason: 'candidate needs human judgment',
  };
}

function scanCssClasses() {
  const cssFiles = walk(
    path.join(ROOT, 'src'),
    (p) => p.endsWith('.css')
  );
  /** @type {Map<string, string[]>} */
  const defined = new Map();
  const classRe = /(?<![0-9A-Za-z_-])\.([A-Za-z_][A-Za-z0-9_-]*)/g;
  for (const cf of cssFiles) {
    let text = fs.readFileSync(cf, 'utf8');
    text = text.replace(/\/\*[\s\S]*?\*\//g, '');
    for (const m of text.matchAll(classRe)) {
      const cls = m[1];
      const list = defined.get(cls) || [];
      list.push(relRoot(cf));
      defined.set(cls, list);
    }
  }

  // Build searchable corpus excluding pure CSS definitions
  const tsHtml = [
    ...walk(path.join(ROOT, 'src'), (p) => /\.(ts|tsx|html)$/.test(p)),
    ...walk(path.join(ROOT, 'tests'), (p) => /\.(ts|tsx|html|mjs)$/.test(p)),
    path.join(ROOT, 'index.html'),
  ];
  const corpus = tsHtml
    .filter((p) => fs.existsSync(p))
    .map((p) => ({ path: relRoot(p), text: fs.readFileSync(p, 'utf8') }));

  /** @type {Array<{kind:string,path:string,symbol:string}>} */
  const unused = [];
  for (const [cls, origins] of [...defined.entries()].sort()) {
    const re = new RegExp(`\\b${cls.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`);
    let found = false;
    for (const { text } of corpus) {
      if (re.test(text)) {
        found = true;
        break;
      }
    }
    if (!found) {
      unused.push({
        kind: 'css-class',
        path: origins[0],
        symbol: cls,
        origins,
      });
    }
  }
  return { total: defined.size, unused };
}

function catalogFeatureFlags() {
  const files = [
    'src/core/feature-flags.ts',
    'src/core/settings-flags.ts',
    'src/core/url-flags.ts',
    'src/ui/three/tablet-gl.ts',
  ];
  /** @type {Array<{kind:string,path:string,symbol:string,detail:string}>} */
  const flags = [];
  for (const rel of files) {
    const abs = path.join(ROOT, rel);
    if (!fs.existsSync(abs)) continue;
    const text = fs.readFileSync(abs, 'utf8');
    for (const m of text.matchAll(
      /(?:export\s+)?const\s+([A-Z0-9_]+_(?:PARAM|STORAGE_KEY)|[A-Z0-9_]*FLAG[A-Z0-9_]*)\s*=\s*['"]([^'"]+)['"]/g
    )) {
      flags.push({
        kind: 'feature-flag',
        path: rel,
        symbol: m[1],
        detail: `token/value '${m[2]}'`,
      });
    }
    for (const m of text.matchAll(
      /export\s+function\s+(is\w+Enabled|get\w+Flag|set\w+Flag|reset\w+ForTests|parseAllowlistedFlag|readUrlOrStorageFlag)\b/g
    )) {
      flags.push({
        kind: 'feature-flag',
        path: rel,
        symbol: m[1],
        detail: 'flag API',
      });
    }
  }
  return flags;
}

/**
 * Test helper modules: files under helpers/ or *helpers*.ts that are not *.test.ts
 */
function scanTestHelpers() {
  const helpers = walk(path.join(ROOT, 'tests'), (p) => {
    const rel = relRoot(p);
    if (!/\.(ts|mjs)$/.test(p)) return false;
    if (/\.test\.(ts|mjs)$/.test(p) || /\.spec\.(ts|mjs)$/.test(p)) return false;
    return (
      /\/helpers\//.test(rel) ||
      /helpers?\.ts$/.test(rel) ||
      /-helpers\.ts$/.test(rel) ||
      /test-helpers\.ts$/.test(rel) ||
      /harness\.ts$/.test(rel) ||
      rel === 'tests/e2e/fixtures.ts' ||
      rel === 'tests/e2e/fullgame/_shared.ts'
    );
  });

  /** @type {Array<{kind:string,path:string,symbol?:string,detail?:string}>} */
  const unusedModules = [];
  /** @type {Array<{kind:string,path:string,symbol:string}>} */
  const unusedExports = [];

  for (const abs of helpers) {
    const rel = relRoot(abs);
    const text = fs.readFileSync(abs, 'utf8');
    // Module reachability: import of stem or path, including side-effect imports
    const stem = path.basename(rel, path.extname(rel));
    const importers = rgFiles(stem).filter((f) => f !== rel);
    // Narrow to real imports of this module
    const realImporters = importers.filter((f) => {
      const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
      return (
        new RegExp(`from\\s+['\"][^'\"]*${stem}['\"]`).test(t) ||
        new RegExp(`import\\(\\s*['\"][^'\"]*${stem}['\"]`).test(t) ||
        new RegExp(`import\\s+['\"][^'\"]*${stem}['\"]`).test(t)
      );
    });
    if (realImporters.length === 0) {
      unusedModules.push({
        kind: 'test-helper-module',
        path: rel,
        detail: 'no importing test/script found',
      });
    }

    // Exported names
    const exportNames = new Set();
    for (const m of text.matchAll(
      /^export\s+(?:async\s+)?function\s+(\w+)/gm
    )) {
      exportNames.add(m[1]);
    }
    for (const m of text.matchAll(/^export\s+const\s+(\w+)/gm)) {
      exportNames.add(m[1]);
    }
    for (const m of text.matchAll(/^export\s+class\s+(\w+)/gm)) {
      exportNames.add(m[1]);
    }
    for (const m of text.matchAll(/^export\s+\{([^}]+)\}/gm)) {
      for (const part of m[1].split(',')) {
        const name = part.trim().split(/\s+as\s+/)[0].trim();
        if (name) exportNames.add(name);
      }
    }
    for (const name of exportNames) {
      const files = rgFiles(`\\b${name}\\b`).filter(
        (f) => f !== rel && !f.startsWith('docs/')
      );
      const used = files.length > 0;
      if (!used) {
        unusedExports.push({
          kind: 'test-helper-export',
          path: rel,
          symbol: name,
        });
      }
    }
  }
  return { helpers: helpers.map(relRoot), unusedModules, unusedExports };
}

function scanUnreferencedSrcFiles(dynamicImports) {
  const srcFiles = walk(
    path.join(ROOT, 'src'),
    (p) => p.endsWith('.ts') && !p.endsWith('.d.ts')
  );
  const blobs = walk(ROOT, (p) => {
    const rel = relRoot(p);
    if (rel.startsWith('node_modules') || rel.startsWith('dist')) return false;
    return /\.(ts|tsx|mjs|js|html|md)$/.test(p);
  }).map((p) => ({
    rel: relRoot(p),
    text: fs.readFileSync(p, 'utf8'),
  }));

  /** @type {string[]} */
  const unref = [];
  for (const abs of srcFiles) {
    const rel = relRoot(abs);
    const stem = rel.replace(/^src\//, '').replace(/\.ts$/, '');
    if (rel === 'src/main.ts') continue;
    if (rel.endsWith('.worker.ts') || rel.endsWith('/ai.worker.ts')) continue;

    let hit = false;
    for (const d of dynamicImports) {
      if (d.includes(stem) || d.endsWith(stem.split('/').pop() || '')) {
        hit = true;
        break;
      }
    }
    if (!hit) {
      for (const { rel: from, text } of blobs) {
        if (from === rel) continue;
        if (
          text.includes(stem) ||
          text.includes(`/${path.basename(stem)}`) ||
          text.includes(rel)
        ) {
          // Prefer import-shaped hits
          if (
            new RegExp(
              `['\"][^'\"]*${stem.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['\"]`
            ).test(text) ||
            text.includes(path.basename(stem))
          ) {
            hit = true;
            break;
          }
        }
      }
    }
    if (!hit) unref.push(rel);
  }
  return unref;
}

function main() {
  console.log('dead-code inventory — running knip…');
  const knip = runKnip();
  console.log('dead-code inventory — depcheck…');
  const depcheck = runDepcheck();
  console.log('dead-code inventory — CSS / flags / helpers…');
  const { dynamicImports, gameIds } = collectDynamicAndRegistry();
  const css = scanCssClasses();
  const flags = catalogFeatureFlags();
  const helpers = scanTestHelpers();
  const unrefSrc = scanUnreferencedSrcFiles(dynamicImports);

  /** @type {Array<any>} */
  const candidates = [...flattenKnip(knip)];

  for (const u of css.unused) {
    candidates.push({ ...u, source: 'css-scan' });
  }
  for (const f of flags) {
    candidates.push({ ...f, source: 'flag-catalog' });
  }
  for (const m of helpers.unusedModules) {
    candidates.push({ ...m, source: 'test-helper-scan' });
  }
  for (const e of helpers.unusedExports) {
    candidates.push({ ...e, source: 'test-helper-scan' });
  }
  for (const dep of depcheck.dependencies || []) {
    candidates.push({
      kind: 'dependency',
      path: 'package.json',
      symbol: dep,
      source: 'depcheck',
    });
  }
  for (const dep of depcheck.devDependencies || []) {
    candidates.push({
      kind: 'dependency',
      path: 'package.json',
      symbol: dep,
      detail: 'devDependency',
      source: 'depcheck',
    });
  }
  for (const p of unrefSrc) {
    candidates.push({ kind: 'file', path: p, source: 'import-graph' });
  }

  // Deduplicate by kind+path+symbol
  const seen = new Set();
  const unique = [];
  for (const c of candidates) {
    const key = `${c.kind}|${c.path}|${c.symbol || ''}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(c);
  }

  /** @type {Array<any>} */
  const rows = [];
  for (const c of unique) {
    const verification = verifyCandidate(c);
    const ranking = rankCandidate(c, verification);
    rows.push({
      ...c,
      evidence: verification.evidence.join('; '),
      externalRefs: verification.externalRefs,
      dynamicHit: verification.dynamicHit,
      registryHit: verification.registryHit,
      rank: ranking.rank,
      safeToRemove: ranking.safeToRemove,
      reason: ranking.reason,
    });
  }

  rows.sort((a, b) => a.rank - b.rank || a.path.localeCompare(b.path));

  for (const r of rows) {
    r.disposition = dispositionFor(r);
  }

  const generatedAt = new Date().toISOString();
  const executedRemovalRows = [...EXECUTED_REMOVALS.entries()].map(
    ([key, meta]) => {
      const [kind, pathPart, symbol] = key.split('|');
      return {
        kind,
        path: pathPart,
        symbol,
        disposition: 'removed',
        action: meta.action,
        note: meta.note,
      };
    }
  );
  const summary = {
    generatedAt,
    taskId: 'burn-1008-mp-dead-code-removal-exec',
    foldOrder: 'fold last',
    gameIds,
    dynamicImportCount: dynamicImports.length,
    cssClassTotal: css.total,
    cssUnusedCandidates: css.unused.length,
    knipError: knip.error || null,
    depcheckUnused: {
      dependencies: depcheck.dependencies || [],
      devDependencies: depcheck.devDependencies || [],
    },
    candidateCount: rows.length,
    safeYes: rows.filter((r) => r.safeToRemove === 'yes').length,
    executedRemovals: executedRemovalRows.length,
    deferredSafeHelpers: rows.filter((r) => r.disposition === 'deferred')
      .length,
    deferPrs: DEFER_TO_OPEN_PRS,
    executedRemovalRows,
  };

  const md = renderMarkdown(summary, rows, dynamicImports);
  fs.mkdirSync(path.dirname(OUT_MD), { recursive: true });
  fs.writeFileSync(OUT_MD, md, 'utf8');
  fs.writeFileSync(
    OUT_JSON,
    JSON.stringify({ summary, rows }, null, 2),
    'utf8'
  );

  console.log(`\nWrote ${relRoot(OUT_MD)} (${rows.length} candidates)`);
  console.log(
    `Safe-to-remove yes: ${summary.safeYes}; review/no: ${rows.length - summary.safeYes}`
  );
  console.log('Ranked top (safe=yes / rank≤2):');
  for (const r of rows.filter((x) => x.rank <= 2).slice(0, 40)) {
    console.log(
      `  [R${r.rank} ${r.safeToRemove}] ${r.kind} ${r.path}${r.symbol ? '#' + r.symbol : ''} — ${r.reason}`
    );
  }
  console.log('\nReport-only: exit 0');
}

/**
 * @param {*} summary
 * @param {any[]} rows
 * @param {string[]} dynamicImports
 */
function renderMarkdown(summary, rows, dynamicImports) {
  const lines = [];
  lines.push('# Dead-code inventory');
  lines.push('');
  lines.push(`**Task id:** \`${summary.taskId}\``);
  lines.push(`**Generated:** ${summary.generatedAt}`);
  lines.push(
    '**Fold order:** **FOLD LAST** (after every other wave5 tip draft)'
  );
  lines.push('');
  lines.push('## Method');
  lines.push('');
  lines.push('1. `knip@5.88.1` with committed `knip.json` (HTML + `src/main.ts` + game workers + scripts/tests/docs entries so dynamic game mounts stay reachable).');
  lines.push('2. `depcheck` for unused `dependencies` / `devDependencies`.');
  lines.push('3. CSS class scan across `src/**/*.css` vs TS/HTML corpus (templates checked in ranking).');
  lines.push('4. Feature-flag catalog from `feature-flags` / `settings-flags` / `url-flags` / `tablet-gl`.');
  lines.push('5. Test-helper module + export reachability (including side-effect imports).');
  lines.push('6. Every candidate verified with `rg` plus game-registry / dynamic-import checks (`game-route-mounts`, `game-prefetch`, `main`).');
  lines.push('');
  lines.push('## Executed removals (this PR)');
  lines.push('');
  lines.push(
    `Re-verified on live tip then applied (**${summary.executedRemovals}** items). Skipped all safe-to-remove test-helper exports (coordinate with #526).`
  );
  lines.push('');
  lines.push('| Disposition | Kind | Path / symbol | Action |');
  lines.push('| --- | --- | --- | --- |');
  for (const r of summary.executedRemovalRows || []) {
    const sym = r.symbol
      ? `\`${r.path}\` → \`${r.symbol}\``
      : `\`${r.path}\``;
    lines.push(
      `| removed | ${r.kind} | ${sym} | ${(r.note || '').replace(/\|/g, '\\|')} |`
    );
  }
  lines.push('');
  lines.push('## Defer — do not redo');
  lines.push('');
  for (const d of summary.deferPrs) {
    lines.push(`- PR #${d.pr} (${d.topic}): ${d.note}`);
  }
  lines.push('');
  lines.push('## Registry / dynamic imports');
  lines.push('');
  lines.push(`- Registered games: ${summary.gameIds.length} (\`${summary.gameIds.join('`, `')}\`)`);
  lines.push(`- Dynamic import specs observed: ${dynamicImports.length}`);
  lines.push('');
  lines.push('## Dependencies');
  lines.push('');
  const deps = summary.depcheckUnused.dependencies;
  const devDeps = summary.depcheckUnused.devDependencies;
  if (deps.length === 0 && devDeps.length === 0) {
    lines.push('No unused direct `dependencies` or `devDependencies` (depcheck).');
  } else {
    lines.push(`- dependencies: ${deps.join(', ') || '(none)'}`);
    lines.push(`- devDependencies: ${devDeps.join(', ') || '(none)'}`);
  }
  lines.push('');
  lines.push('## Ranked removal list (remaining)');
  lines.push('');
  lines.push('Rank 1 = strongest removal candidate; Rank 4 = keep.');
  lines.push('**Safe-to-remove** applies to the *symbol/rule* unless `kind=file`.');
  lines.push(
    '**Disposition:** `removed` (this PR) / `deferred` (safe test-helper export — leave for #526) / `kept` (do not remove).'
  );
  lines.push('This PR does **not** delete games, assets, or tests. File deletion only when `kind=file` and safe-to-remove=yes.');
  lines.push('');
  lines.push(
    '| Rank | Safe? | Disposition | Kind | Path / symbol | Evidence | Reason |'
  );
  lines.push('| --- | --- | --- | --- | --- | --- | --- |');
  for (const r of rows) {
    const sym = r.symbol ? `\`${r.path}\` → \`${r.symbol}\`` : `\`${r.path}\``;
    const ev = (r.evidence || '').replace(/\|/g, '\\|').slice(0, 180);
    const reason = (r.reason || '').replace(/\|/g, '\\|');
    lines.push(
      `| ${r.rank} | ${r.safeToRemove} | ${r.disposition || 'kept'} | ${r.kind} | ${sym} | ${ev} | ${reason} |`
    );
  }
  lines.push('');
  lines.push('## File deletions in this PR');
  lines.push('');
  lines.push(
    'None (symbol/CSS demotions and deletions only). After grep + registry/dynamic-import verification, no non-game / non-asset / non-test *file* was provably unreferenced.'
  );
  lines.push('');
  lines.push('## Reproduce');
  lines.push('');
  lines.push('```bash');
  lines.push('npm run report:dead-code');
  lines.push('```');
  lines.push('');
  lines.push('Artifacts: `docs/dev/dead-code-inventory.md`, `docs/dev/dead-code-inventory.json`.');
  lines.push('');
  return lines.join('\n');
}

main();
