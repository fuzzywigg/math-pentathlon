/**
 * Wave 66 leftover after tip/#316 — Contig expr-option pad/white leftover.
 * Soft border #ddd existed; lock padding 0.75rem + white bg. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 66 contig — inject expr-option pad white', () => {
  it('pins expr-option padding 0.75rem + white background', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.contig-expr-option\s*\{[\s\S]*?padding:\s*0\.75rem/
    );
    expect(css).toMatch(
      /\.contig-expr-option\s*\{[\s\S]*?background:\s*white/
    );
  });
});
