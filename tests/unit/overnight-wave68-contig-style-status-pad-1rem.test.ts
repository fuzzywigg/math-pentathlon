/**
 * Wave 68 leftover after tip/#337 — Contig status padding 1rem.
 * Soft text-align existed; lock padding leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 contig — style status pad 1rem', () => {
  it('pins leftover chrome', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.contig-status\s*\{[\s\S]*?padding:\s*1rem/);
  });
});
