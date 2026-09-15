/**
 * Wave 68 leftover after tip/#337 — Contig cell-value font-size 14px.
 * Soft font-weight 600 existed; lock 14px leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 68 contig — inject cell-value 14px', () => {
  it('pins contig-cell-value font-size 14px leftover', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toMatch(/\.contig-cell-value\s*\{[\s\S]*?font-size:\s*14px/);
  });
});
