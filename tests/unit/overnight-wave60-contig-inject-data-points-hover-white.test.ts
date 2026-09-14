/**
 * Wave 60 leftover after #282 — Contig data-points hover white. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 60 contig — inject data-points hover white', () => {
  it('pins hover after color leftover', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toContain('.contig-cell-valid:hover[data-points]::after');
    expect(css).toMatch(
      /\.contig-cell-valid:hover\[data-points\]::after\s*\{[\s\S]*?color:\s*white/
    );
  });
});
