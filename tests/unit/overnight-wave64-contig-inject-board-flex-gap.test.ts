/**
 * Wave 64 leftover after tip/#303 — Contig board flex-direction + gap 2px.
 * Soft gap/pad board tokens existed; lock column + row gap. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 64 contig — inject board flex gap', () => {
  it('pins board column flex and row/board gap 2px', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.contig-board\s*\{[\s\S]*?flex-direction:\s*column/
    );
    expect(css).toMatch(/\.contig-board\s*\{[\s\S]*?gap:\s*2px/);
    expect(css).toMatch(/\.contig-row\s*\{[\s\S]*?gap:\s*2px/);
  });
});
