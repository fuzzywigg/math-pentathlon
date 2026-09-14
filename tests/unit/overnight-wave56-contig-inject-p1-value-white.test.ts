/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Contig owned value white. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => document.getElementById('contig-styles')?.remove());

describe('Wave 56 contig — inject owned value white', () => {
  it('p1/p2 cell values paint white leftover', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toContain('.contig-cell-p1 .contig-cell-value');
    expect(css).toContain('.contig-cell-p2 .contig-cell-value');
    expect(css).toMatch(/\.contig-cell-p1 \.contig-cell-value[\s\S]*?color: white/);
    expect(css).toMatch(/\.contig-cell-p2 \.contig-cell-value[\s\S]*?color: white/);
  });
});
