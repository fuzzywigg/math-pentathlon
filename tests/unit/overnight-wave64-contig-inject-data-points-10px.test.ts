/**
 * Wave 64 leftover after tip/#303 — Contig data-points font-size 10px inset.
 * Absolute position covered elsewhere; deepen 10px + top/right 2px. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 64 contig — inject data-points 10px', () => {
  it('pins data-points ::after 10px + top/right 2px leftovers', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.contig-cell-valid\[data-points\]::after\s*\{[\s\S]*?font-size:\s*10px/
    );
    expect(css).toMatch(
      /\.contig-cell-valid\[data-points\]::after\s*\{[\s\S]*?top:\s*2px/
    );
    expect(css).toMatch(
      /\.contig-cell-valid\[data-points\]::after\s*\{[\s\S]*?right:\s*2px/
    );
  });
});
