/**
 * Wave 60 leftover after #282 — Contig expr-header color/weight. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 60 contig — inject expr-header color', () => {
  it('pins color and font-weight leftovers', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toMatch(/\.contig-expr-header\s*\{[\s\S]*?font-weight:\s*500/);
    expect(css).toMatch(/\.contig-expr-header\s*\{[\s\S]*?color:\s*#555/);
  });
});
