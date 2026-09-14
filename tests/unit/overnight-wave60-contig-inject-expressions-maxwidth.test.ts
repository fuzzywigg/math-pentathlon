/**
 * Wave 60 leftover after #282 — Contig expressions max-width. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 60 contig — inject expressions max-width', () => {
  it('pins max-width leftover', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toMatch(/\.contig-expressions\s*\{[\s\S]*?max-width:\s*500px/);
  });
});
