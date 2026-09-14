/**
 * Wave 60 leftover after #282 — Contig data-points inset chrome. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 60 contig — inject data-points inset', () => {
  it('pins top/right/font-size leftovers', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toContain('[data-points]::after');
    expect(css).toMatch(/top:\s*2px/);
    expect(css).toMatch(/right:\s*2px/);
    expect(css).toMatch(/font-size:\s*10px/);
  });
});
