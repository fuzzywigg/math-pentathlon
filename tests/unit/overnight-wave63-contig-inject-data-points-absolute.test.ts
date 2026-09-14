/**
 * Wave 63 Contig/SD residual after tip #301 — Contig data-points absolute leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 63 contig — inject data-points absolute', () => {
  it('pins position absolute on data-points ::after leftover', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.contig-cell-valid\[data-points\]::after\s*\{[\s\S]*?position:\s*absolute/
    );
  });
});
