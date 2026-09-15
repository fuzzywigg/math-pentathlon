/**
 * Wave 67 leftover after tip/#316 — Contig no-moves pad/radius leftover.
 * Soft #fff3e0/#e65100 contains existed; lock pad/radius selector-scoped. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 67 contig — inject no-moves pad radius', () => {
  it('pins no-moves text-align center + pad 1rem + radius 8px', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.contig-no-moves\s*\{[\s\S]*?text-align:\s*center/
    );
    expect(css).toMatch(/\.contig-no-moves\s*\{[\s\S]*?padding:\s*1rem/);
    expect(css).toMatch(
      /\.contig-no-moves\s*\{[\s\S]*?border-radius:\s*8px/
    );
    expect(css).toMatch(
      /\.contig-no-moves\s*\{[\s\S]*?background:\s*#fff3e0/
    );
  });
});
