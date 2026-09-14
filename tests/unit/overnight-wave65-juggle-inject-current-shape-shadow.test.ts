/**
 * Wave 65 leftover after tip/#311–#313 (unit-only) — Juggle current-shape shadow.
 * Soft border-radius 8 elsewhere; lock box-shadow leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 65 juggle — inject current-shape shadow', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects .juggle-current-shape box-shadow rgba leftover', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.juggle-current-shape\s*\{[^}]*box-shadow:\s*0 2px 8px rgba\(0,0,0,0\.1\)/
    );
  });
});
