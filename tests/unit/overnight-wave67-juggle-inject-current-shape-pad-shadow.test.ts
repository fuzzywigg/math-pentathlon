/**
 * Wave 67 leftover after tip/#316 — Juggle current-shape pad/shadow leftovers.
 * Wave66 locked white bg; lock pad/radius/shadow leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 67 juggle — inject current-shape pad shadow', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects current-shape pad/radius/box-shadow leftovers', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/\.juggle-current-shape\s*\{[^}]*padding:\s*0\.5rem/);
    expect(css).toMatch(
      /\.juggle-current-shape\s*\{[^}]*border-radius:\s*8px/
    );
    expect(css).toMatch(
      /\.juggle-current-shape\s*\{[^}]*box-shadow:\s*0 2px 8px rgba\(0,0,0,0\.1\)/
    );
  });
});
