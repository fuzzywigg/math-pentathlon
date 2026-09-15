/**
 * Wave 67 leftover after tip/#316 — Contig cell flex center leftover.
 * Soft cell dims existed; lock align/justify center leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 67 contig — inject cell align center', () => {
  it('pins contig-cell flex align/justify center leftover', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toMatch(/\.contig-cell\s*\{[\s\S]*?display:\s*flex/);
    expect(css).toMatch(/\.contig-cell\s*\{[\s\S]*?align-items:\s*center/);
    expect(css).toMatch(/\.contig-cell\s*\{[\s\S]*?justify-content:\s*center/);
  });
});
