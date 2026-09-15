/**
 * Wave 68 leftover after tip/#337 — Contig cell justify-content center.
 * Soft align-items existed; lock justify-content leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 68 contig — inject cell justify center', () => {
  it('pins contig-cell justify-content center leftover', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toMatch(/\.contig-cell\s*\{[\s\S]*?justify-content:\s*center/);
  });
});
