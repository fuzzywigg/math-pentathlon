/**
 * Wave 60 leftover after #282 — Contig cell-value typography inject. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 60 contig — inject cell-value typography', () => {
  it('pins font-weight/size/color leftovers', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toMatch(/\.contig-cell-value\s*\{[\s\S]*?font-weight:\s*600/);
    expect(css).toMatch(/\.contig-cell-value\s*\{[\s\S]*?font-size:\s*14px/);
    expect(css).toMatch(/\.contig-cell-value\s*\{[\s\S]*?color:\s*#333/);
  });
});
