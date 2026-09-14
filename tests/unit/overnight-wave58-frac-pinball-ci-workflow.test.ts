/**
 * Overnight TOKENMAXX HEAVY leftovers after #272 — CI keeps unit + chromium e2e gates.
 * Distinct filename from open fab/fiar wave58 CI smoke. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('Wave 58 frac/pinball CI — unit/e2e gates', () => {
  it('ci.yml keeps test:unit and chromium playwright leftover', () => {
    const ci = readFileSync(
      resolve(process.cwd(), '.github/workflows/ci.yml'),
      'utf8'
    );
    expect(ci).toMatch(/test:unit/);
    expect(ci).toMatch(/playwright|test:e2e/);
    expect(ci).toMatch(/chromium/i);
  });
});
