/**
 * Wave 58 leftover after #275 — Contig p2 cell value white inject. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 58 contig — inject p2 value white', () => {
  it('pins .contig-cell-p2 .contig-cell-value white leftover', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toContain('.contig-cell-p2 .contig-cell-value');
    expect(css).toMatch(
      /\.contig-cell-p2 \.contig-cell-value\s*\{[\s\S]*?color:\s*white/
    );
  });
});
