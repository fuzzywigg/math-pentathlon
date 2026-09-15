/**
 * Wave 67 leftover after tip/#324 — Contig no-moves p margin exact.
 * Soft #fff3e0 / #e65100 existed; lock p margin leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 67 contig — inject no-moves p margin', () => {
  it('pins contig-no-moves p margin 0 0 1rem 0 leftover', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.contig-no-moves p\s*\{[\s\S]*?margin:\s*0 0 1rem 0/
    );
  });
});
