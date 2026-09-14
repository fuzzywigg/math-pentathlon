/**
 * Wave 63 Contig/SD residual after tip #301 — Sum status seat colors leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 63 sum — style status seat colors', () => {
  it('pins player1/player2 status color leftovers', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(
      /\.sd-status\.player1\s*\{[\s\S]*?color:\s*var\(--color-player1\)/
    );
    expect(css).toMatch(
      /\.sd-status\.player2\s*\{[\s\S]*?color:\s*var\(--color-player2\)/
    );
    expect(css).toMatch(
      /\.sd-hand-label\.player1\s*\{[\s\S]*?color:\s*var\(--color-player1\)/
    );
    expect(css).toMatch(
      /\.sd-hand-label\.player2\s*\{[\s\S]*?color:\s*var\(--color-player2\)/
    );
  });
});
