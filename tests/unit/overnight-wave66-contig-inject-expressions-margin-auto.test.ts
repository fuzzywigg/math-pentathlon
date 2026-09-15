/**
 * Wave 66 leftover after tip/#316 — Contig expressions margin auto.
 * Soft max-width 500 existed; lock margin 0 auto + pad 1rem. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 66 contig — inject expressions margin auto', () => {
  it('pins expressions margin 0 auto + padding 1rem', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.contig-expressions\s*\{[\s\S]*?margin:\s*0 auto/
    );
    expect(css).toMatch(
      /\.contig-expressions\s*\{[\s\S]*?padding:\s*1rem/
    );
  });
});
