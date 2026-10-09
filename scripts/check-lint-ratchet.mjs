#!/usr/bin/env node
/**
 * Lint-rule ceiling ratchet (burn-1008-mp-lint-ratchet + q-mp-045 + q-mp-127).
 *
 * Counts violations for rules that are too widespread to hard-fail yet
 * (currently: curly "all", @typescript-eslint/no-non-null-assertion,
 * no-duplicate-imports).
 * Fails if any counted rule exceeds its ceiling so the debt can only go down.
 *
 * Usage: npm run lint:ratchet
 *
 * Ceilings live in docs/dev/lint-ratchet-ceilings.json — lower them when
 * cleaning up; never raise without tip-owner approval.
 */

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CEILINGS_PATH = path.join(ROOT, 'docs/dev/lint-ratchet-ceilings.json');

/** @typedef {{ rules: Record<string, number>, notes?: string }} CeilingFile */

/** @type {CeilingFile} */
const ceilings = JSON.parse(fs.readFileSync(CEILINGS_PATH, 'utf8'));

/**
 * Probe config: same base as eslint.config.js, but forces ceilinged rules so
 * we can count debt the live config does not hard-fail on yet:
 * - curly:all (live enforces multi-line only)
 * - @typescript-eslint/no-non-null-assertion (live unset; q-mp-045)
 * - no-duplicate-imports (live unset; q-mp-127)
 */
// Keep the probe config under the repo root so flat-config `import.meta.dirname`
// / relative imports to eslint.config.js resolve; always delete in `finally`.
const probeConfigPath = path.join(ROOT, '.eslint.ratchet.probe.config.js');

const probeSource = `
import base from './eslint.config.js';

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...base,
  {
    rules: {
      curly: ['error', 'all'],
      '@typescript-eslint/no-non-null-assertion': 'error',
      'no-duplicate-imports': 'error',
    },
  },
];
`;

fs.writeFileSync(probeConfigPath, probeSource, 'utf8');

try {
  const result = spawnSync(
    'npx',
    [
      'eslint',
      'src',
      '-c',
      probeConfigPath,
      '--format',
      'json',
      '--no-error-on-unmatched-pattern',
    ],
    {
      cwd: ROOT,
      encoding: 'utf8',
      maxBuffer: 64 * 1024 * 1024,
      shell: process.platform === 'win32',
    }
  );

  /** @type {Array<{ filePath: string, messages: Array<{ ruleId: string | null }> }>} */
  let report;
  try {
    report = JSON.parse(result.stdout || '[]');
  } catch {
    console.error('lint:ratchet failed to parse eslint JSON output');
    console.error((result.stderr || result.stdout || '').slice(0, 4000));
    process.exit(1);
  }

  /** @type {Record<string, number>} */
  const counts = {};
  for (const rule of Object.keys(ceilings.rules)) {
    counts[rule] = 0;
  }

  for (const file of report) {
    for (const message of file.messages) {
      if (!message.ruleId || !(message.ruleId in counts)) continue;
      counts[message.ruleId] += 1;
    }
  }

  console.log('Lint ratchet ceilings (docs/dev/lint-ratchet-ceilings.json)');
  let failed = false;
  for (const [rule, ceiling] of Object.entries(ceilings.rules)) {
    const count = counts[rule] ?? 0;
    const status = count <= ceiling ? 'ok' : 'FAIL';
    if (count > ceiling) failed = true;
    const headroom = ceiling - count;
    console.log(
      `  ${status.padEnd(4)} ${rule}: ${count} / ceiling ${ceiling}` +
        (headroom > 0 ? ` (−${headroom} headroom; lower the ceiling)` : '')
    );
  }

  if (failed) {
    console.error(
      '\nLint ratchet failed: a counted rule exceeded its ceiling. Fix new violations or (with tip-owner approval) adjust docs/dev/lint-ratchet-ceilings.json after a measured cleanup.'
    );
    process.exit(1);
  }

  console.log('Lint ratchet passed.');
  process.exit(0);
} finally {
  try {
    fs.unlinkSync(probeConfigPath);
  } catch {
    // ignore cleanup errors
  }
}
