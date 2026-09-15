/**
 * Wave 67 leftover after tip/#316 — FIAR chip-icon.player1 seat var.
 * Soft chip seats; lock player1 background var leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFiarStyles } from '../../src/games/fiar/board-ui';

afterEach(() => {
  document.getElementById('fiar-styles')?.remove();
});

describe('Wave 67 fiar — inject chip-icon p1 var', () => {
  it('chip-icon.player1 uses player1 color var', () => {
    injectFiarStyles();
    const css = document.getElementById('fiar-styles')!.textContent || '';
    expect(css).toMatch(
      /\.fiar-chip-icon\.player1\s*\{[\s\S]*?background:\s*var\(--color-player1,\s*#2196f3\)/
    );
  });
});
