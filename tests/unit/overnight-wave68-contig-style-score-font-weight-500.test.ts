/**
 * Wave 68 leftover after tip/#337 — Contig score font-weight 500.
 * Soft pad/radius existed; lock font-weight leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 contig — style score font-weight 500', () => {
  it('pins leftover chrome', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.contig-score\s*\{[\s\S]*?font-weight:\s*500/);
  });
});
