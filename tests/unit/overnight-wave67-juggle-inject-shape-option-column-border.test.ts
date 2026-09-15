/**
 * Wave 67 leftover after tip/#316 — Juggle shape-option column/border leftovers.
 * Wave66 locked white/radius; lock column + #ddd border leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 67 juggle — inject shape-option column border', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects shape-option column flex and #ddd border', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.juggle-shape-option\s*\{[^}]*flex-direction:\s*column/
    );
    expect(css).toMatch(
      /\.juggle-shape-option\s*\{[^}]*border:\s*2px solid #ddd/
    );
    expect(css).toMatch(/\.juggle-shape-option\s*\{[^}]*cursor:\s*pointer/);
  });
});
