/**
 * Wave 68 leftover after tip/#337 — Contig valid cell #c8e6c9 fill.
 * Soft valid cursor existed; lock light-green fill leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 68 contig — inject cell-valid c8e6c9', () => {
  it('pins contig-cell-valid background #c8e6c9 leftover', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toMatch(/\.contig-cell-valid\s*\{[\s\S]*?background:\s*#c8e6c9/);
  });
});
