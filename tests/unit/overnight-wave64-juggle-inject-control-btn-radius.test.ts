/**
 * Wave 64 leftover after tip/#303 — Juggle inject control-btn radius 6px.
 * Wave60 locked #e0e0e0/#bdbdbd; deepen border-radius leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 64 juggle — inject control-btn radius', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects .juggle-control-btn border-radius 6px', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.juggle-control-btn\s*\{[^}]*border-radius:\s*6px/
    );
  });
});
