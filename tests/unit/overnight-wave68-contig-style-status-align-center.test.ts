/**
 * Wave 68 leftover after tip/#337 — Contig status text-align center.
 * Soft seat colors existed; lock text-align leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 contig — style status align center', () => {
  it('pins leftover chrome', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.contig-status\s*\{[\s\S]*?text-align:\s*center/);
  });
});
