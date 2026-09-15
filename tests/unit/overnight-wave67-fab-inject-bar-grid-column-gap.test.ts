/**
 * Wave 67 leftover after tip/#316 — Fab bar-grid column gap.
 * Soft bar-grid; lock column + gap leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 67 fab — inject bar-grid column gap', () => {
  it('bar-grid is column flex with gap 0.75rem', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toMatch(
      /\.fab-bar-grid\s*\{[\s\S]*?flex-direction:\s*column[\s\S]*?gap:\s*0\.75rem/
    );
  });
});
