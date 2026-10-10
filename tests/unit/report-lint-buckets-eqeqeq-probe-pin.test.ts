/**
 * q-mp-792 — pin that report:lint-buckets probe overlay includes stricter
 * eqeqeq (matching check-lint-ratchet.mjs). Source-string only; no ceiling edits.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const BUCKETS = resolve(process.cwd(), 'scripts/report-lint-buckets.mjs');
const RATCHET = resolve(process.cwd(), 'scripts/check-lint-ratchet.mjs');

describe('q-mp-792 report-lint-buckets eqeqeq probe pin', () => {
  it('buckets probe source includes eqeqeq always overlay', () => {
    const src = readFileSync(BUCKETS, 'utf8');
    expect(src).toContain("eqeqeq: ['error', 'always']");
  });

  it('ratchet probe source still includes eqeqeq always overlay', () => {
    const src = readFileSync(RATCHET, 'utf8');
    expect(src).toContain("eqeqeq: ['error', 'always']");
  });
});
