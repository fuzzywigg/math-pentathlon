/**
 * Wave 67 leftover after tip/#316 — Juggle occupied-player CSS var leftovers.
 * Soft cell chrome existed; lock occupied-player1/2 var leftovers. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 67 juggle — inject occupied player vars', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects occupied-player1/2 CSS var backgrounds', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.juggle-cell\.occupied-player1\s*\{[^}]*background:\s*var\(--color-player1, #2196f3\)/
    );
    expect(css).toMatch(
      /\.juggle-cell\.occupied-player2\s*\{[^}]*background:\s*var\(--color-player2, #f44336\)/
    );
  });
});
