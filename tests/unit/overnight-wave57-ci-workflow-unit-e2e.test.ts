/**
 * Overnight TOKENMAXX HEAVY leftovers after #260 — CI keeps unit + chromium e2e gates.
 * Wave56 asserted scripts; deepen playwright project chromium leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('Wave 57 CI — unit/e2e gates', () => {
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
