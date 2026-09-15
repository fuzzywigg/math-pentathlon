/**
 * Wave 67 leftover after tip/#316 — Contig cell radius/relative leftover.
 * Soft 48px / transition existed; lock radius 4px + position relative. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 67 contig — inject cell radius relative', () => {
  it('pins contig-cell border-radius 4px + position relative', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toMatch(/\.contig-cell\s*\{[\s\S]*?border-radius:\s*4px/);
    expect(css).toMatch(/\.contig-cell\s*\{[\s\S]*?position:\s*relative/);
  });
});
