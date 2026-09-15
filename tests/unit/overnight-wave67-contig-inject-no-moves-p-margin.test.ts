/**
 * Wave 67 leftover after tip/#316 — Contig no-moves p margin leftover.
 * Soft p #e65100 existed; lock margin 0 0 1rem 0 leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 67 contig — inject no-moves p margin', () => {
  it('pins no-moves p margin 0 0 1rem 0 + #e65100', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.contig-no-moves p\s*\{[\s\S]*?margin:\s*0 0 1rem 0/
    );
    expect(css).toMatch(
      /\.contig-no-moves p\s*\{[\s\S]*?color:\s*#e65100/
    );
  });
});
