/**
 * Wave 68 leftover after tip/#337 — Contig expr-option radius 8px.
 * Soft column flex existed; lock border-radius leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 68 contig — inject expr-option radius 8', () => {
  it('pins contig-expr-option border-radius 8px leftover', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.contig-expr-option\s*\{[\s\S]*?border-radius:\s*8px/
    );
  });
});
