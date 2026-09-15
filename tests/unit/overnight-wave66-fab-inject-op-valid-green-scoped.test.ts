/**
 * Wave 66 leftover after tip/#316 — Fab op-valid green scoped.
 * Wave58 soft green tokens; lock .fab-op-valid leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 66 fab — inject op-valid green scoped', () => {
  it('op-valid uses #4caf50 border and #c8e6c9 fill', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toMatch(
      /\.fab-op-valid\s*\{[\s\S]*?border-color:\s*#4caf50[\s\S]*?background:\s*#c8e6c9/
    );
  });
});
