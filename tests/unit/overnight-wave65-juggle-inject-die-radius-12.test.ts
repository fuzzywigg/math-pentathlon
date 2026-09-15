/**
 * Wave 65 leftover after tip/#315 — Juggle inject die border-radius 12px.
 * Wave59 locked size/fill; radius leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 65 juggle — inject die radius 12', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects .juggle-die border-radius 12px', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.juggle-die\s*\{[^}]*border-radius:\s*12px/
    );
  });
});
