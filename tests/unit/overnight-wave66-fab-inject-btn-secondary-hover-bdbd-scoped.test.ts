/**
 * Wave 66 leftover after tip/#316 — Fab btn-secondary hover #bdbdbd scoped.
 * Wave59 soft hover fill; lock :hover leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 66 fab — inject btn-secondary hover bdbd scoped', () => {
  it('secondary hover fills #bdbdbd', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toMatch(
      /\.fab-btn-secondary:hover\s*\{[\s\S]*?background:\s*#bdbdbd/
    );
  });
});
