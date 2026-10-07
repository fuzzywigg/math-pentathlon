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
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

/** Paths whose ratchet errors fail the check (must stay at zero). */
const IN_SCOPE = new RegExp(
  [
    '^src/(ui|core)/',
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
  `  scope: src/ui, src/core, tests/helpers, tests/unit/helpers, tests/e2e/helpers, tests/visual/helpers.ts, unit *-helpers.ts`
);
console.log(`  in-scope errors:     ${inScope.length} (must be 0)`);
console.log(
  `  out-of-scope errors: ${outOfScope.length} (AI/rules/games — not blocking)`
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

console.log('Type ratchet passed.');
process.exit(0);
