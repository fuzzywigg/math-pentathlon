/**
 * Wave 65 leftover after tip/#315 — Juggle inject status player color vars.
 * Wave64 locked board-header vars; status.player leftovers. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 65 juggle — inject status player vars', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects status.player1/2 color CSS vars', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.juggle-status\.player1\s*\{[^}]*color:\s*var\(--color-player1,\s*#2196f3\)/
    );
    expect(css).toMatch(
      /\.juggle-status\.player2\s*\{[^}]*color:\s*var\(--color-player2,\s*#f44336\)/
    );
  });
});
