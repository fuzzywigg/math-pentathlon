/**
 * Wave 62 leftover after #293 — Juggle current-shape box-shadow leftover.
 * Distinct from wave60 control-btn grays. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 62 juggle — inject current-shape shadow', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects current-shape soft box-shadow', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.juggle-current-shape\s*\{[^}]*box-shadow:\s*0 2px 8px rgba\(0,0,0,0\.1\)/
    );
  });
});
