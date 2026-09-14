/**
 * Wave 63 Contig/SD residual after tip #301 — Contig roll-btn style chrome. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 63 contig — style roll-btn chrome', () => {
  it('pins primary pad/min-width/weight leftovers', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.contig-roll-btn\s*\{[\s\S]*?padding:\s*10px 20px/);
    expect(css).toMatch(/\.contig-roll-btn\s*\{[\s\S]*?min-width:\s*120px/);
    expect(css).toMatch(/\.contig-roll-btn\s*\{[\s\S]*?font-weight:\s*600/);
    expect(css).toMatch(/\.contig-roll-btn\s*\{[\s\S]*?background-color:\s*var\(--color-primary\)/);
  });
});
