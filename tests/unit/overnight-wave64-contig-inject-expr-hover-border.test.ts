/**
 * Wave 64 leftover after tip/#303 — Contig expr-option hover border valid.
 * Soft option pad/white existed; lock hover border-color. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 64 contig — inject expr hover border', () => {
  it('pins expr-option:hover border-color #4caf50 leftover', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.contig-expr-option:hover\s*\{[\s\S]*?border-color:\s*#4caf50/
    );
    expect(css).toMatch(
      /\.contig-expr-option:hover\s*\{[\s\S]*?background:\s*#c8e6c9/
    );
  });
});
