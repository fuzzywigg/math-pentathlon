/**
 * Wave 67 leftover after tip/#316 — Fab game-area column + gap 1rem.
 * Soft layout; lock flex-direction column + gap leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 67 fab — inject game-area column gap', () => {
  it('game-area is column flex with gap 1rem', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toMatch(
      /\.fab-game-area\s*\{[\s\S]*?flex-direction:\s*column[\s\S]*?gap:\s*1rem/
    );
  });
});
