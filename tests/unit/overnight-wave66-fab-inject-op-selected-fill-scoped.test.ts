/**
 * Wave 66 leftover after tip/#316 — Fab op-selected fill scoped.
 * Wave61 soft #fff3e0; lock .fab-op-selected leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 66 fab — inject op-selected fill scoped', () => {
  it('op-selected fills #fff3e0 with #ff9800 border', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toMatch(
      /\.fab-op-selected\s*\{[\s\S]*?border-color:\s*#ff9800[\s\S]*?background:\s*#fff3e0/
    );
  });
});
