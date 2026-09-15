/**
 * Wave 68 leftover after tip/#337 — Contig expr-option column flex.
 * Soft pad/white existed; lock flex-direction column leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 68 contig — inject expr-option column', () => {
  it('pins contig-expr-option flex-direction column leftover', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.contig-expr-option\s*\{[\s\S]*?flex-direction:\s*column/
    );
  });
});
