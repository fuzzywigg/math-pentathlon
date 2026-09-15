/**
 * Wave 68 leftover after tip/#337 — Contig valid:hover #4caf50.
 * Soft #c8e6c9 fill existed; lock hover green leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 68 contig — inject cell-valid hover green', () => {
  it('pins contig-cell-valid:hover background #4caf50 leftover', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.contig-cell-valid:hover\s*\{[\s\S]*?background:\s*#4caf50/
    );
  });
});
