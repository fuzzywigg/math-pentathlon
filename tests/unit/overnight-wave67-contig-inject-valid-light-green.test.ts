/**
 * Wave 67 leftover after tip/#316 — Contig validMoveLight leftover.
 * Soft valid cursor/hover existed; lock #c8e6c9 valid base fill. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 67 contig — inject valid light green', () => {
  it('pins contig-cell-valid background #c8e6c9 leftover', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.contig-cell-valid\s*\{[\s\S]*?background:\s*#c8e6c9/
    );
  });
});
