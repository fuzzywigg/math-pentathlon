/**
 * Wave 67 leftover after tip/#316 — Contig cell-p2 player CSS var.
 * Soft p1 var / p2 value white existed; lock p2 background var. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 67 contig — inject cell-p2 player var', () => {
  it('pins contig-cell-p2 background player2 CSS var leftover', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.contig-cell-p2\s*\{[\s\S]*?var\(--color-player2, #f44336\)/
    );
  });
});
