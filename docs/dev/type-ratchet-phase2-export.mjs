#!/usr/bin/env node
/**
 * Export / verify Phase-2 type-ratchet baseline (out-of-scope errors only).
 *
 * Single command (from repo root):
 *   node docs/dev/type-ratchet-phase2-export.mjs
 *
 * Writes docs/dev/type-ratchet-phase2-baseline.json (report-only inventory).
 * Exit 0 always when export succeeds; use --check to fail if totals regress
 * above the checked-in baseline (counts may only go down).
 *
 * Scope matches scripts/check-type-ratchet.mjs: in-scope (ui/core/helpers) must
 * stay at 0; this export inventories everything else (games AI/rules/UI, demos, main).
 */

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');
const OUT = path.join(__dirname, 'type-ratchet-phase2-baseline.json');

/** Keep in sync with scripts/check-type-ratchet.mjs IN_SCOPE. */
const IN_SCOPE = new RegExp(
  [
    '^src/(ui|core)/',
    '^src/demos/',
    '^src/main\\.ts$',
    '^src/games/remainder-islands/(types|board-ui)\\.ts$',
    '^src/games/hex-a-gone/(rules|board-ui)\\.ts$',
    '^src/games/star-track/(types|game-controller)\\.ts$',
    '^src/games/fab-a-diffy/(types|board-ui|rules)\\.ts$',
    '^src/games/fiar/(types|board-ui|rules)\\.ts$',
    '^src/games/par-55/(types|board-ui|rules)\\.ts$',
    '^tests/(helpers|unit/helpers|e2e/helpers)/',
    '^tests/visual/helpers\\.ts$',
    '^tests/unit/(ai-determinism|engine-invariants|undo-audit|fiar-test)-helpers\\.ts$',
  ].join('|')
);

/**
 * @param {string} file
 */
function kindOf(file) {
  const base = path.basename(file);
  if (file === 'src/main.ts' || file.startsWith('src/demos/') || file.startsWith('src/pwa/')) {
    return 'shell_misc';
  }
  if (
    base === 'ai.ts' ||
    base === 'ai-client.ts' ||
    base === 'ai.worker.ts' ||
    /^(search|eval|scoring|heuristic)/i.test(base)
  ) {
    return 'ai_search_scoring';
  }
  if (/^(rules|game-state)\./.test(base)) return 'rules_engine';
  if (/^(board-ui|board-renderer|board)\./.test(base)) return 'game_ui';
  if (file.startsWith('src/games/')) return 'other_game_module';
  return 'other';
}

/**
 * @param {string} file
 */
function gameOf(file) {
  const m = /^src\/games\/([^/]+)\//.exec(file);
  if (m) return m[1];
  if (file.startsWith('src/demos/')) return '_demos';
  if (file === 'src/main.ts') return '_main';
  if (file.startsWith('src/pwa/')) return '_pwa';
  if (file.startsWith('tests/')) return '_tests';
  return '_other';
}

/**
 * @param {{ code: string, message: string }} e
 */
function rootCause(e) {
  const { code, message: msg } = e;
  if (code === 'TS2375' || code === 'TS2379' || code === 'TS2412' || code === 'TS2790') {
    return 'exact_optional_property_types';
  }
  if (code === 'TS2532' || code === 'TS18048' || code === 'TS2493') {
    return 'unchecked_index_access';
  }
  if (code === 'TS2531' || code === 'TS2533') return 'null_narrowing';
  if (code === 'TS2722') return 'possibly_undefined_callable';
  if (code === 'TS2538') return 'undefined_as_index';
  if (code === 'TS2488') return 'possibly_undefined_iterable';
  if (code === 'TS2339' && /\| undefined/.test(msg)) return 'unchecked_index_access';
  if (
    code === 'TS2345' &&
    (/\| undefined/.test(msg) || /undefined is not assignable/.test(msg))
  ) {
    return 'unchecked_index_access';
  }
  if (code === 'TS2322') {
    if (/optional property|exactOptionalPropertyTypes/i.test(msg)) {
      return 'exact_optional_property_types';
    }
    if (/\| undefined'|Type 'undefined'/.test(msg)) return 'unchecked_index_access';
    return 'type_assignability';
  }
  if (
    code === 'TS7006' ||
    code === 'TS7034' ||
    code === 'TS7053' ||
    /implicitly has an? 'any'/.test(msg)
  ) {
    return 'implicit_any';
  }
  if (code === 'TS2339') return 'property_does_not_exist';
  if (code === 'TS2345') return 'argument_type_mismatch';
  return `other_${code}`;
}

/**
 * @param {Record<string, number>} o
 */
function sortCounts(o) {
  return Object.fromEntries(
    Object.entries(o).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  );
}

const result = spawnSync(
  'npx',
  ['tsc', '--noEmit', '-p', 'tsconfig.ratchet.json', '--pretty', 'false'],
  {
    cwd: ROOT,
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024,
    shell: process.platform === 'win32',
  }
);

const output = `${result.stdout ?? ''}${result.stderr ?? ''}`;
const errorLines = output
  .split('\n')
  .map((l) => l.trimEnd())
  .filter((l) => /error TS\d+:/.test(l));

/** @type {{ file: string, line: number, col: number, code: string, message: string, kind: string, game: string, rootCause: string }[]} */
const parsed = [];
for (const line of errorLines) {
  const m = /^(.+?)\((\d+),(\d+)\): error (TS\d+): (.+)$/.exec(line);
  if (!m) continue;
  const file = m[1].replace(/\\/g, '/');
  const entry = {
    file,
    line: Number(m[2]),
    col: Number(m[3]),
    code: m[4],
    message: m[5],
    kind: kindOf(file),
    game: gameOf(file),
    rootCause: '',
  };
  entry.rootCause = rootCause(entry);
  parsed.push(entry);
}

const inScope = parsed.filter((e) => IN_SCOPE.test(e.file));
const outOfScope = parsed.filter((e) => !IN_SCOPE.test(e.file));

/** @type {Record<string, number>} */
const byGame = {};
/** @type {Record<string, number>} */
const byFile = {};
/** @type {Record<string, number>} */
const byCode = {};
/** @type {Record<string, number>} */
const byRootCause = {};
/** @type {Record<string, number>} */
const byKind = {};
/** @type {Record<string, { total: number, ai_search_scoring: number, rules_engine: number, game_ui: number, other_game_module: number, shell_misc: number, other: number }>} */
const perGame = {};

for (const e of outOfScope) {
  byGame[e.game] = (byGame[e.game] || 0) + 1;
  byFile[e.file] = (byFile[e.file] || 0) + 1;
  byCode[e.code] = (byCode[e.code] || 0) + 1;
  byRootCause[e.rootCause] = (byRootCause[e.rootCause] || 0) + 1;
  byKind[e.kind] = (byKind[e.kind] || 0) + 1;

  if (!perGame[e.game]) {
    perGame[e.game] = {
      total: 0,
      ai_search_scoring: 0,
      rules_engine: 0,
      game_ui: 0,
      other_game_module: 0,
      shell_misc: 0,
      other: 0,
    };
  }
  const g = perGame[e.game];
  g.total++;
  if (e.kind in g) {
    // @ts-expect-error dynamic
    g[e.kind]++;
  } else {
    g.other++;
  }
}

const tipSha = spawnSync('git', ['rev-parse', 'HEAD'], {
  cwd: ROOT,
  encoding: 'utf8',
}).stdout.trim();

const baseline = {
  schemaVersion: 1,
  reportOnly: true,
  description:
    'Phase-2 type-ratchet baseline: out-of-scope errors under tsconfig.ratchet.json. Counts must only decrease.',
  taskId: 'burn-1007-mp-typeratchet-plan',
  generatedAt: new Date().toISOString(),
  tipSha,
  commands: {
    export: 'node docs/dev/type-ratchet-phase2-export.mjs',
    check: 'node docs/dev/type-ratchet-phase2-export.mjs --check',
    summary: 'npm run typecheck:ratchet',
    rawTsc: 'npx tsc --noEmit -p tsconfig.ratchet.json --pretty false',
  },
  ratchetFlags: [
    'noUncheckedIndexedAccess',
    'exactOptionalPropertyTypes',
    'noImplicitOverride',
    'forceConsistentCasingInFileNames',
    'noImplicitReturns',
  ],
  inScopeErrors: inScope.length,
  outOfScopeErrors: outOfScope.length,
  fileCount: Object.keys(byFile).length,
  byKind: sortCounts(byKind),
  byRootCause: sortCounts(byRootCause),
  byCode: sortCounts(byCode),
  byGame: sortCounts(byGame),
  perGame: Object.fromEntries(
    Object.entries(perGame).sort((a, b) => b[1].total - a[1].total || a[0].localeCompare(b[0]))
  ),
  byFile: sortCounts(byFile),
  errors: outOfScope.map((e) => ({
    file: e.file,
    line: e.line,
    col: e.col,
    code: e.code,
    rootCause: e.rootCause,
    kind: e.kind,
    game: e.game,
    message: e.message,
  })),
};

const check = process.argv.includes('--check');
if (check) {
  if (!fs.existsSync(OUT)) {
    console.error(`Missing baseline at ${OUT}. Run without --check first.`);
    process.exit(1);
  }
  const prev = JSON.parse(fs.readFileSync(OUT, 'utf8'));
  const prevTotal = prev.outOfScopeErrors;
  const prevIn = prev.inScopeErrors;
  let failed = false;
  if (inScope.length > 0) {
    console.error(`FAIL: in-scope errors rose to ${inScope.length} (must stay 0).`);
    failed = true;
  } else if (prevIn !== 0 && inScope.length !== 0) {
    failed = true;
  }
  if (outOfScope.length > prevTotal) {
    console.error(
      `FAIL: out-of-scope errors ${outOfScope.length} > baseline ${prevTotal} (ratchet: counts may only go down).`
    );
    failed = true;
  }
  console.log(
    `Phase-2 baseline check: in-scope=${inScope.length} out-of-scope=${outOfScope.length} (baseline ${prevTotal})`
  );
  process.exit(failed ? 1 : 0);
}

fs.writeFileSync(OUT, `${JSON.stringify(baseline, null, 2)}\n`);
console.log(`Wrote ${path.relative(ROOT, OUT)}`);
console.log(`  in-scope errors:     ${inScope.length}`);
console.log(`  out-of-scope errors: ${outOfScope.length}`);
console.log(`  files with errors:   ${Object.keys(byFile).length}`);
console.log(`  tipSha: ${tipSha}`);
process.exit(0);
