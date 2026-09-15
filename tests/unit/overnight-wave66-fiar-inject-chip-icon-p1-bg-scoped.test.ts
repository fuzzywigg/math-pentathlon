/**
 * Wave 66 leftover after tip/#316 — FIAR chip-icon.player1 bg scoped.
 * Soft seat class existed; lock player1 fill leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFiarStyles } from '../../src/games/fiar/board-ui';

afterEach(() => {
  document.getElementById('fiar-styles')?.remove();
});

describe('Wave 66 fiar — inject chip-icon p1 bg scoped', () => {
  it('chip-icon.player1 uses player1 CSS color var', () => {
    injectFiarStyles();
    const css = document.getElementById('fiar-styles')!.textContent || '';
    expect(css).toMatch(
      /\.fiar-chip-icon\.player1\s*\{[\s\S]*?background:\s*var\(--color-player1, #2196f3\)/
    );
  });
});
