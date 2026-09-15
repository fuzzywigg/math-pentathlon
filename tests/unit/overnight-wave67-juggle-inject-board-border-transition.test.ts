/**
 * Wave 67 leftover after tip/#316 — Juggle board border/transition leftovers.
 * Wave66 locked pad 1rem; lock transparent border + transition leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 67 juggle — inject board border transition', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects board 3px transparent border and border-color transition', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.juggle-board\s*\{[^}]*border:\s*3px solid transparent/
    );
    expect(css).toMatch(
      /\.juggle-board\s*\{[^}]*transition:\s*border-color 0\.2s/
    );
  });
});
