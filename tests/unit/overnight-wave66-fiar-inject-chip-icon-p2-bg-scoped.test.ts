/**
 * Wave 66 leftover after tip/#316 — FIAR chip-icon.player2 bg scoped.
 * Soft seat class existed; lock player2 fill leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFiarStyles } from '../../src/games/fiar/board-ui';

afterEach(() => {
  document.getElementById('fiar-styles')?.remove();
});

describe('Wave 66 fiar — inject chip-icon p2 bg scoped', () => {
  it('chip-icon.player2 uses player2 CSS color var', () => {
    injectFiarStyles();
    const css = document.getElementById('fiar-styles')!.textContent || '';
    expect(css).toMatch(
      /\.fiar-chip-icon\.player2\s*\{[\s\S]*?background:\s*var\(--color-player2, #f44336\)/
    );
  });
});
