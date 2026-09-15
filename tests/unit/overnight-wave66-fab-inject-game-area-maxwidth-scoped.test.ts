/**
 * Wave 66 leftover after tip/#316 — Fab game-area max-width 1200 scoped.
 * Wave56 soft max-width; lock .fab-game-area leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 66 fab — inject game-area maxwidth scoped', () => {
  it('game-area caps at max-width 1200px', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toMatch(
      /\.fab-game-area\s*\{[\s\S]*?max-width:\s*1200px/
    );
  });
});
