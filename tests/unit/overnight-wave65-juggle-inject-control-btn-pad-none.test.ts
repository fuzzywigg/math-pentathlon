/**
 * Wave 65 leftover after tip/#315 — Juggle inject control-btn pad/border-none.
 * Gray bg/hover + radius locked; deepen pad/border/weight/transition. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 65 juggle — inject control btn pad none', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects control-btn pad, border none, weight 500, transition', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.juggle-control-btn\s*\{[^}]*padding:\s*0\.5rem 1rem/
    );
    expect(css).toMatch(/\.juggle-control-btn\s*\{[^}]*border:\s*none/);
    expect(css).toMatch(/\.juggle-control-btn\s*\{[^}]*font-weight:\s*500/);
    expect(css).toMatch(
      /\.juggle-control-btn\s*\{[^}]*transition:\s*background 0\.15s/
    );
  });
});
