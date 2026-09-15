/**
 * Wave 68 leftover after tip/#337 — Contig cell position relative.
 * Soft transition existed; lock position relative leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 68 contig — inject cell position relative', () => {
  it('pins contig-cell position relative leftover', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toMatch(/\.contig-cell\s*\{[\s\S]*?position:\s*relative/);
  });
});
