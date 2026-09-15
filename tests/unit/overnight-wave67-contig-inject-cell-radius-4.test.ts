/**
 * Wave 67 leftover after tip/#324 — Contig cell border-radius 4px.
 * Soft 48px square existed; lock radius leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 67 contig — inject cell radius 4', () => {
  it('pins contig-cell border-radius 4px leftover', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toMatch(/\.contig-cell\s*\{[\s\S]*?border-radius:\s*4px/);
  });
});
