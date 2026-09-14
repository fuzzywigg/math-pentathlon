/**
 * Wave 63 leftover after tip/#301 — Juggle board border-color transition.
 * Wave56 locked active #ffc107; deepen transition timing. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 63 juggle — inject board border transition', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects .juggle-board transition border-color 0.2s', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.juggle-board\s*\{[^}]*transition:\s*border-color 0\.2s/
    );
  });
});
