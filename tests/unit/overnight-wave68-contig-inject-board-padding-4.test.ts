/**
 * Wave 68 leftover after tip/#337 — Contig board padding 4px.
 * Soft gap/bg/#999 existed; lock padding leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 68 contig — inject board padding 4', () => {
  it('pins contig-board padding 4px leftover', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toMatch(/\.contig-board\s*\{[\s\S]*?padding:\s*4px/);
  });
});
