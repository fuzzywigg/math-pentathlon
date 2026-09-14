/**
 * Wave 63 Contig/SD residual after tip #301 — Contig status pad/align chrome. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 63 contig — style status pad align', () => {
  it('pins status center/pad and seat color leftovers', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.contig-status\s*\{[\s\S]*?text-align:\s*center/);
    expect(css).toMatch(/\.contig-status\s*\{[\s\S]*?padding:\s*1rem/);
    expect(css).toMatch(
      /\.contig-status\.player1\s*\{[\s\S]*?color:\s*var\(--color-player1\)/
    );
    expect(css).toMatch(
      /\.contig-status\.player2\s*\{[\s\S]*?color:\s*var\(--color-player2\)/
    );
  });
});
