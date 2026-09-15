/**
 * Wave 67 leftover after tip/#316 — Fab status.player2 seat var.
 * Wave54 soft seat vars; lock .fab-status.player2 leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 67 fab — inject status player2 var', () => {
  it('status.player2 uses player2 color var', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toMatch(
      /\.fab-status\.player2\s*\{[\s\S]*?color:\s*var\(--color-player2,\s*#f44336\)/
    );
  });
});
