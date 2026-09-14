/**
 * Wave 64 leftover after tip/#303 — Contig cell-value weight/color.
 * Soft font-size 14px existed; lock weight 600 + #333. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 64 contig — inject cell value weight', () => {
  it('pins cell-value font-weight 600 and color #333', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.contig-cell-value\s*\{[\s\S]*?font-weight:\s*600/
    );
    expect(css).toMatch(/\.contig-cell-value\s*\{[\s\S]*?color:\s*#333/);
  });
});
