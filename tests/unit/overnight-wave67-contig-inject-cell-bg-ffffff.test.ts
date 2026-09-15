/**
 * Wave 67 leftover after tip/#324 — Contig cell empty #ffffff leftover.
 * Soft 48px / transition existed; lock empty background. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 67 contig — inject cell bg ffffff', () => {
  it('pins contig-cell background #ffffff leftover', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toMatch(/\.contig-cell\s*\{[\s\S]*?background:\s*#ffffff/);
  });
});
