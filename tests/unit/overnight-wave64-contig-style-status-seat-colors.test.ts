/**
 * Wave 64 leftover after tip/#303 — Contig status seat colors.
 * Sum status seats covered elsewhere; deepen Contig leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 64 contig — style status seat colors', () => {
  it('pins contig-status player1/player2 color vars', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(
      /\.contig-status\.player1\s*\{[\s\S]*?color:\s*var\(--color-player1\)/
    );
    expect(css).toMatch(
      /\.contig-status\.player2\s*\{[\s\S]*?color:\s*var\(--color-player2\)/
    );
  });
});
