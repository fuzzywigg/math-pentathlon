/**
 * Wave 63 Contig/SD residual after tip #301 — Contig board shadow rgba leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 63 contig — inject board shadow rgba', () => {
  it('pins rgba(0,0,0,0.15) board shadow leftover', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.contig-board\s*\{[\s\S]*?box-shadow:\s*0 4px 12px rgba\(0,0,0,0\.15\)/
    );
  });
});
