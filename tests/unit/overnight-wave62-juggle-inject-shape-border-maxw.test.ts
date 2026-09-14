/**
 * Wave 62 leftover after #293 — Juggle shape-option #ddd + selector max-width.
 * Distinct from wave60 shape-option hover greens. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 62 juggle — inject shape border maxw', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects shape-option #ddd border and selector max-width 500px', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.juggle-shape-option\s*\{[^}]*border:\s*2px solid #ddd/
    );
    expect(css).toMatch(
      /\.juggle-shape-selector\s*\{[^}]*max-width:\s*500px/
    );
  });
});
