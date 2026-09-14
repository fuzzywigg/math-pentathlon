/**
 * Wave 64 leftover after tip/#303 — Contig p2 cell value white.
 * Wave58 locked p1 white; deepen p2 leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 64 contig — inject p2 value white', () => {
  it('pins .contig-cell-p2 .contig-cell-value white leftover', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.contig-cell-p2 \.contig-cell-value\s*\{[\s\S]*?color:\s*white/
    );
  });
});
