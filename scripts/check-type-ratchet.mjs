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
    // Phase 2 Batch 3 — medium-game UI/shell only (rules/AI/engine deferred)
    '^src/games/juggle/(board-ui|game-controller)\\.ts$',
    '^src/games/pent-em-in/(board-ui|types)\\.ts$',
    '^src/games/kwatro-sinko/board-ui\\.ts$',
    '^src/games/hex/board-ui\\.ts$',
    '^src/games/contig-60/(board-ui|types)\\.ts$',
    '^src/games/kings-quadraphages/(board-ui|board-renderer)\\.ts$',
    '^src/games/stars-bars/board-ui\\.ts$',
    '^tests/(helpers|unit/helpers|e2e/helpers)/',
    '^tests/visual/helpers\\.ts$',
    '^tests/unit/(ai-determinism|engine-invariants|undo-audit|fiar-test)-helpers\\.ts$',
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
  `  scope: src/ui, src/core, src/demos, src/main.ts, Batch-1 shells, Batch-3 UI/shell (non-rules), tests/helpers, unit *-helpers.ts`
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
