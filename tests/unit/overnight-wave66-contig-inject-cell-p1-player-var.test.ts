/**
 * Wave 66 leftover after tip/#316 — Contig cell-p1 player CSS var leftover.
 * Soft p2 value white existed; lock p1 var(--color-player1). Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 66 contig — inject cell-p1 player var', () => {
  it('pins contig-cell-p1 background player1 CSS var leftover', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.contig-cell-p1\s*\{[\s\S]*?var\(--color-player1, #2196f3\)/
    );
    expect(css).toMatch(
      /\.contig-cell-p1 \.contig-cell-value\s*\{[\s\S]*?color:\s*white/
    );
  });
});
