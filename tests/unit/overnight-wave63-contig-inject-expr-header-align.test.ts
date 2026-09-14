/**
 * Wave 63 Contig/SD residual after tip #301 — Contig expr-header align leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 63 contig — inject expr-header align', () => {
  it('pins text-align and margin-bottom leftovers', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toMatch(/\.contig-expr-header\s*\{[\s\S]*?text-align:\s*center/);
    expect(css).toMatch(/\.contig-expr-header\s*\{[\s\S]*?margin-bottom:\s*0\.75rem/);
  });
});
