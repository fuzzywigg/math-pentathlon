/**
 * Wave 67 leftover after tip/#324 — Contig expr-header text-align center.
 * Soft #555 / weight 500 existed; lock text-align leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 67 contig — inject expr-header align center', () => {
  it('pins contig-expr-header text-align center leftover', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.contig-expr-header\s*\{[\s\S]*?text-align:\s*center/
    );
  });
});
