/**
 * Wave 67 leftover after tip/#324 — Contig board border-radius 8px.
 * Soft shadow 0.15 / pad 4px existed; lock radius leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 67 contig — inject board radius 8', () => {
  it('pins contig-board border-radius 8px leftover', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toMatch(/\.contig-board\s*\{[\s\S]*?border-radius:\s*8px/);
  });
});
