/**
 * Wave 67 leftover after tip/#316 — Contig expr-header center leftover.
 * Soft weight/color existed; lock text-align center + margin-bottom. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 67 contig — inject expr-header center', () => {
  it('pins expr-header text-align center + margin-bottom 0.75rem', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.contig-expr-header\s*\{[\s\S]*?text-align:\s*center/
    );
    expect(css).toMatch(
      /\.contig-expr-header\s*\{[\s\S]*?margin-bottom:\s*0\.75rem/
    );
  });
});
