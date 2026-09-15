/**
 * Wave 67 leftover after tip/#324 — Contig expr-header margin-bottom 0.75rem.
 * Soft weight 500 / #555 existed; lock margin-bottom leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 67 contig — inject expr-header mb 0.75', () => {
  it('pins contig-expr-header margin-bottom 0.75rem leftover', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.contig-expr-header\s*\{[\s\S]*?margin-bottom:\s*0\.75rem/
    );
  });
});
