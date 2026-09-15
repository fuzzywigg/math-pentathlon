/**
 * Wave 67 leftover after tip/#336 — FIAR chip-icon.player2 seat var.
 * Soft chip seats; lock player2 background var leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFiarStyles } from '../../src/games/fiar/board-ui';

afterEach(() => {
  document.getElementById('fiar-styles')?.remove();
});

describe('Wave 67 fiar — inject chip-icon p2 var', () => {
  it('chip-icon.player2 uses player2 color var', () => {
    injectFiarStyles();
    const css = document.getElementById('fiar-styles')!.textContent || '';
    expect(css).toMatch(
      /\.fiar-chip-icon\.player2\s*\{[\s\S]*?background:\s*var\(--color-player2,\s*#f44336\)/
    );
  });
});
