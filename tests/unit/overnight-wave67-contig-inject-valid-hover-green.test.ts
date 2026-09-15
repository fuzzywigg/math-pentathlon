/**
 * Wave 67 leftover after tip/#316 — Contig valid hover #4caf50 leftover.
 * Soft valid light / cursor existed; lock hover fill leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 67 contig — inject valid hover green', () => {
  it('pins contig-cell-valid:hover background #4caf50 leftover', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.contig-cell-valid:hover\s*\{[\s\S]*?background:\s*#4caf50/
    );
  });
});
