/**
 * Wave 63 Contig/SD residual after tip #301 — Contig pass-btn style chrome. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 63 contig — style pass-btn chrome', () => {
  it('pins neutral fill and hover leftover', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(
      /\.contig-pass-btn\s*\{[\s\S]*?background-color:\s*var\(--color-neutral-600\)/
    );
    expect(css).toMatch(/\.contig-pass-btn:hover\s*\{[\s\S]*?#334155/);
    expect(css).toMatch(/\.contig-pass-btn:focus-visible\s*\{[\s\S]*?outline-offset:\s*2px/);
  });
});
