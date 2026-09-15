/**
 * Wave 67 leftover after tip/#336 — Fab game-area max-width 1200px scoped.
 * Wave56 soft 1200; lock .fab-game-area max-width leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 67 fab — inject game-area maxwidth 1200', () => {
  it('game-area caps at max-width 1200px', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toMatch(/\.fab-game-area\s*\{[\s\S]*?max-width:\s*1200px/);
  });
});
