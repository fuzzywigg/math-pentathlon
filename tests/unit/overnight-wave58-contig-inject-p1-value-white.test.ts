/**
 * Wave 58 leftover after #275 — Contig p1 cell value white inject. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 58 contig — inject p1 value white', () => {
  it('pins .contig-cell-p1 .contig-cell-value white leftover', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toContain('.contig-cell-p1 .contig-cell-value');
    expect(css).toMatch(
      /\.contig-cell-p1 \.contig-cell-value\s*\{[\s\S]*?color:\s*white/
    );
  });
});
