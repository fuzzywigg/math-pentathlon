/**
 * Wave 64 leftover after tip/#303 — Contig valid cell cursor pointer.
 * Soft valid hover colors existed; lock cursor pointer. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 64 contig — inject valid cursor pointer', () => {
  it('pins .contig-cell-valid cursor pointer leftover', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.contig-cell-valid\s*\{[\s\S]*?cursor:\s*pointer/
    );
  });
});
