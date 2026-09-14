/**
 * Wave 64 leftover after tip/#303 — Juggle inject player color CSS vars.
 * Unsaturated --color-player1/2 fallback leftovers. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 64 juggle — inject player color vars', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects player1/player2 header color CSS var fallbacks', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toContain('var(--color-player1, #2196f3)');
    expect(css).toContain('var(--color-player2, #f44336)');
    expect(css).toContain(
      '.juggle-board.player1 .juggle-board-header'
    );
    expect(css).toContain(
      '.juggle-board.player2 .juggle-board-header'
    );
  });
});
