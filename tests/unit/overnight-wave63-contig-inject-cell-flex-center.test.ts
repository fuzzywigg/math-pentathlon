/**
 * Wave 63 Contig/SD residual after tip #301 — Contig cell flex center leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 63 contig — inject cell flex center', () => {
  it('pins align/justify center + relative/transition leftovers', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toMatch(/\.contig-cell\s*\{[\s\S]*?align-items:\s*center/);
    expect(css).toMatch(/\.contig-cell\s*\{[\s\S]*?justify-content:\s*center/);
    expect(css).toMatch(/\.contig-cell\s*\{[\s\S]*?position:\s*relative/);
    expect(css).toMatch(/\.contig-cell\s*\{[\s\S]*?transition:\s*all 0\.15s ease/);
  });
});
