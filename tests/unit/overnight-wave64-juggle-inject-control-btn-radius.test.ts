/**
 * Wave 64 leftover after tip/#301 + open #303 wave63 — Juggle control-btn radius.
 * Wave60 locked grays only. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 64 juggle — inject control-btn radius', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects control-btn border-radius 6px', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.juggle-control-btn\s*\{[^}]*border-radius:\s*6px/
    );
  });
});
