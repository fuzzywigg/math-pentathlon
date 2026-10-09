#!/usr/bin/env node
/**
 * Durable type-check ratchet for UI, core utilities/persistence, and test helpers.
 *
 * Runs `tsc -p tsconfig.ratchet.json` (stricter than main: noUncheckedIndexedAccess
 * + exactOptionalPropertyTypes) and fails only on errors in the scoped paths below.
 * Game AI / rules / most game modules stay out of scope until a human expands it.
 *
 * Usage: npm run typecheck:ratchet
 */

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PHASE2_BASELINE = path.join(
  ROOT,
  'docs/dev/type-ratchet-phase2-baseline.json'
);

/** Paths whose ratchet errors fail the check (must stay at zero). */
const IN_SCOPE = new RegExp(
  [
    '^src/(ui|core)/',
    // Phase 2 Batch 0 — demos + entry
    '^src/demos/',
    '^src/main\\.ts$',
    // Phase 2 Batch 1 — tiny-game non-AI shells (AI modules stay out of scope)
    '^src/games/remainder-islands/(types|board-ui)\\.ts$',
    '^src/games/hex-a-gone/(rules|board-ui)\\.ts$',
    '^src/games/star-track/(types|game-controller)\\.ts$',
    '^src/games/fab-a-diffy/(types|board-ui|rules)\\.ts$',
    '^src/games/fiar/(types|board-ui|rules)\\.ts$',
    '^src/games/par-55/(types|board-ui|rules)\\.ts$',
    // Phase 2 Batch 2 — rules-heavy / low-AI non-AI modules (AI stays out of scope)
    // Compliant recut: type-only assertions; no #537 runtime nullish rewrites.
    '^src/games/frac-fact/rules\\.ts$',
    '^src/games/fraction-pinball/rules\\.ts$',
    '^src/games/queens-guards/(types|board-ui|rules)\\.ts$',
    '^src/games/ramrod/(types|board-ui|rules)\\.ts$',
    '^src/games/sum-dominoes/(types|board-ui|rules|game-controller)\\.ts$',
    '^src/games/calla/(board-ui|rules)\\.ts$',
    // Phase 2 Batch 3 — medium-game UI/shell only (rules/AI/engine deferred)
    '^src/games/juggle/(board-ui|game-controller)\\.ts$',
    '^src/games/pent-em-in/(board-ui|types)\\.ts$',
    '^src/games/kwatro-sinko/board-ui\\.ts$',
    '^src/games/hex/board-ui\\.ts$',
    '^src/games/contig-60/(board-ui|types)\\.ts$',
    '^src/games/kings-quadraphages/(board-ui|board-renderer)\\.ts$',
    '^src/games/stars-bars/board-ui\\.ts$',
    // Phase 2 Batch 4 — prime-gold types + board-ui (rules/AI deferred)
    '^src/games/prime-gold/(types|board-ui)\\.ts$',
    // Phase 2 Batch 6 — remaining non-AI rules/engine (emit-identical ! only; EOPT rebuilds held)
    '^src/games/stars-bars/rules\\.ts$',
    '^src/games/hex/rules\\.ts$',
    '^src/games/prime-gold/rules\\.ts$',
    '^src/games/kwatro-sinko/rules\\.ts$',
    '^src/games/pent-em-in/rules\\.ts$',
    '^src/games/contig-60/rules\\.ts$',
    '^src/games/juggle/rules\\.ts$',
    '^src/games/kings-quadraphages/(game-state|board|rules)\\.ts$',
    // Phase 2 Batch 7 — remaining non-AI shell/types/UI/loaders + helper tests
    // (tutorials/copy skipped; prime-gold/game-controller owned by open #567)
    '^src/games/calla/(types|game-controller|index)\\.ts$',
    '^src/games/contig-60/game-controller\\.ts$',
    '^src/games/fab-a-diffy/game-controller\\.ts$',
    '^src/games/fiar/(game-controller|layout|board-3d-loader)\\.ts$',
    '^src/games/frac-fact/(types|board-ui|game-controller)\\.ts$',
    '^src/games/fraction-pinball/(types|board-ui|game-controller)\\.ts$',
    '^src/games/hex/(types|game-controller)\\.ts$',
    '^src/games/hex-a-gone/(types|game-controller|board-3d-loader)\\.ts$',
    '^src/games/juggle/types\\.ts$',
    '^src/games/kings-quadraphages/(game-controller|pieces|serialization|board-3d-loader)\\.ts$',
    '^src/games/kwatro-sinko/(types|game-controller|board-3d-loader)\\.ts$',
    '^src/games/par-55/game-controller\\.ts$',
    '^src/games/pent-em-in/(game-controller|board-3d-loader)\\.ts$',
    '^src/games/prime-gold/board-3d-loader\\.ts$',
    '^src/games/queens-guards/(game-controller|board-3d-loader)\\.ts$',
    '^src/games/ramrod/game-controller\\.ts$',
    '^src/games/remainder-islands/game-controller\\.ts$',
    '^src/games/star-track/(board-ui|board-3d-loader)\\.ts$',
    '^src/games/stars-bars/(types|game-controller)\\.ts$',
    '^tests/(helpers|unit/helpers|e2e/helpers)/',
    '^tests/visual/helpers\\.ts$',
    '^tests/unit/(ai-determinism|engine-invariants|undo-audit|fiar-test)-helpers\\.ts$',
    '^tests/unit/burn-wave14-types-helpers\\.test\\.ts$',
    '^tests/unit/burn-wave35-fab-a-diffy-format-helpers\\.test\\.ts$',
    '^tests/unit/burn-wave35-ramrod-box-format-helpers\\.test\\.ts$',
    '^tests/unit/burn-wave41-fab-pass-winner-helpers\\.test\\.ts$',
    '^tests/unit/overnight-dice-selector-reset-helpers\\.test\\.ts$',
    // Phase 2 Batch 8 — remaining helper-test floor + script-.mjs ambient (no @types/node)
    '^tests/unit/burn-wave35-fraction-pinball-format-helpers\\.test\\.ts$',
    '^tests/unit/burn-wave41-calla-types-helpers\\.test\\.ts$',
    '^tests/unit/burn-wave41-stars-types-diff-helpers\\.test\\.ts$',
    '^tests/unit/burn-wave42-fiar-types-graph-helpers\\.test\\.ts$',
    '^tests/unit/burn-wave42-kings-pieces-board-helpers\\.test\\.ts$',
    '^tests/unit/burn-wave42-pent-type-helpers\\.test\\.ts$',
    '^tests/unit/burn-wave44-fab-initial-types-helpers\\.test\\.ts$',
    '^tests/unit/burn-wave47-stars-types-diff-helpers\\.test\\.ts$',
    '^tests/unit/check-build-helpers\\.test\\.ts$',
    '^tests/unit/history-routing-helpers\\.test\\.ts$',
    '^tests/unit/offline-helpers\\.test\\.ts$',
    '^tests/unit/overnight-graph-directed-edge-helpers\\.test\\.ts$',
    '^tests/unit/overnight-wave50-calla-types-helpers-matrix\\.test\\.ts$',
    '^tests/unit/pwa-manifest-contract-helpers\\.test\\.ts$',
    '^tests/unit/report-licenses-helpers\\.test\\.ts$',
    // Soft-lock clean PWA shell modules (skip register/bootstrap-owl — open #568)
    '^src/pwa/(bootstrap|idle-warm)\\.ts$',
  ].join('|')
);

/**
 * @param {string} line
 * @returns {string | null}
 */
function errorFile(line) {
  const m = /^(.+?)\(\d+,\d+\): error TS\d+:/.exec(line);
  return m ? m[1].replace(/\\/g, '/') : null;
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

/** @type {string[]} */
const inScope = [];
/** @type {string[]} */
const outOfScope = [];

for (const line of errorLines) {
  const file = errorFile(line);
  if (file && IN_SCOPE.test(file)) {
    inScope.push(line);
  } else {
    outOfScope.push(line);
  }
}

console.log('Type ratchet (tsconfig.ratchet.json)');
console.log(
  `  flags: noUncheckedIndexedAccess, exactOptionalPropertyTypes, noImplicitOverride, forceConsistentCasingInFileNames, noImplicitReturns`
);
console.log(
  `  scope: src/ui, src/core, src/demos, src/main.ts, Batch-1/2/3/4/6/7/8 shells+rules+helpers, tests/helpers, unit *-helpers.ts`
);
console.log(`  in-scope errors:     ${inScope.length} (must be 0)`);
console.log(
  `  out-of-scope errors: ${outOfScope.length} (remaining AI/rules/games — not blocking here)`
);

if (inScope.length > 0) {
  console.error('\nIn-scope type errors:');
  for (const line of inScope) {
    console.error(`  ${line}`);
  }
  process.exit(1);
}

if (result.status !== 0 && outOfScope.length === 0 && errorLines.length === 0) {
  console.error('tsc failed with no parseable errors:');
  console.error(output.slice(0, 4000));
  process.exit(result.status ?? 1);
}

// Phase-2 ceiling: out-of-scope count must not rise above the committed baseline.
if (fs.existsSync(PHASE2_BASELINE)) {
  const prev = JSON.parse(fs.readFileSync(PHASE2_BASELINE, 'utf8'));
  const ceiling =
    typeof prev.outOfScopeErrors === 'number'
      ? prev.outOfScopeErrors
      : prev.totals?.outOfScopeErrors;
  if (typeof ceiling === 'number' && outOfScope.length > ceiling) {
    console.error(
      `FAIL: out-of-scope errors ${outOfScope.length} > Phase-2 baseline ${ceiling} (counts may only go down).`
    );
    process.exit(1);
  }
  console.log(
    `  Phase-2 ceiling:     ${outOfScope.length} ≤ baseline ${ceiling}`
  );
}

console.log('Type ratchet passed.');
process.exit(0);
