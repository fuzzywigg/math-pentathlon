/**
 * Wave 66 leftover after tip/#316 — Fab bar-disabled cursor scoped.
 * Wave61 soft not-allowed; lock .fab-bar-disabled leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 66 fab — inject bar-disabled cursor scoped', () => {
  it('bar-disabled uses not-allowed cursor', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toMatch(
      /\.fab-bar-disabled\s*\{[\s\S]*?cursor:\s*not-allowed/
    );
  });
});
