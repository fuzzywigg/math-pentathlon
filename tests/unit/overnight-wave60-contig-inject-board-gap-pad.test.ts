/**
 * Wave 60 leftover after #282 — Contig board gap/pad/radius/bg inject. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 60 contig — inject board gap pad', () => {
  it('pins .contig-board gap/padding/radius/bg leftovers', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toMatch(/\.contig-board\s*\{[\s\S]*?gap:\s*2px/);
    expect(css).toMatch(/\.contig-board\s*\{[\s\S]*?padding:\s*4px/);
    expect(css).toMatch(/\.contig-board\s*\{[\s\S]*?border-radius:\s*8px/);
    expect(css).toMatch(/\.contig-board\s*\{[\s\S]*?background:\s*#999999/);
  });
});
