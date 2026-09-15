/**
 * Wave 65 leftover after tip/#315 — Juggle inject roll-btn border-radius 8px.
 * Wave63 locked gradient; radius leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 65 juggle — inject roll radius 8', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects .juggle-roll-btn border-radius 8px', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.juggle-roll-btn\s*\{[^}]*border-radius:\s*8px/
    );
  });
});
