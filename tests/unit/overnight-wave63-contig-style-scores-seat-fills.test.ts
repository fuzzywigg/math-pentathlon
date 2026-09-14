/**
 * Wave 63 Contig/SD residual after tip #301 — Contig score seat fill colors. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 63 contig — style scores seat fills', () => {
  it('pins Blue/Red soft score backgrounds leftovers', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.contig-score-p1\s*\{[\s\S]*?background:\s*#bbdefb/);
    expect(css).toMatch(/\.contig-score-p2\s*\{[\s\S]*?background:\s*#ffcdd2/);
    expect(css).toMatch(/\.contig-scores\s*\{[\s\S]*?gap:\s*2rem/);
    expect(css).toMatch(/\.contig-score\s*\{[\s\S]*?border-radius:\s*8px/);
  });
});
