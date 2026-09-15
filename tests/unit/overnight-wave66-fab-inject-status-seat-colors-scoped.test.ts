/**
 * Wave 66 leftover after tip/#316 — Fab status seat color vars scoped.
 * Soft seat colors existed; lock .fab-status.player1/2 leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 66 fab — inject status seat colors scoped', () => {
  it('status seats use player1/2 CSS color vars', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toMatch(
      /\.fab-status\.player1\s*\{[\s\S]*?color:\s*var\(--color-player1, #2196f3\)/
    );
    expect(css).toMatch(
      /\.fab-status\.player2\s*\{[\s\S]*?color:\s*var\(--color-player2, #f44336\)/
    );
  });
});
