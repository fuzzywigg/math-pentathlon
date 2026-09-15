/**
 * Wave 67 leftover after tip/#324 — Contig no-moves border-radius 8px.
 * Soft #fff3e0 pad existed; lock radius leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 67 contig — inject no-moves radius 8', () => {
  it('pins contig-no-moves border-radius 8px leftover', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.contig-no-moves\s*\{[\s\S]*?border-radius:\s*8px/
    );
  });
});
