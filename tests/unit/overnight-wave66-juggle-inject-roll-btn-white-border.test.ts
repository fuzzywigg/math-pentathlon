/**
 * Wave 66 leftover after tip/#316 — Juggle inject roll white/border.
 * Soft layout existed; lock selector-scoped leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 66 juggle — inject roll btn white border', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects roll-btn white color, border none, radius 8px', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/\.juggle-roll-btn\s*\{[^}]*color:\s*white/);
    expect(css).toMatch(/\.juggle-roll-btn\s*\{[^}]*border:\s*none/);
    expect(css).toMatch(/\.juggle-roll-btn\s*\{[^}]*border-radius:\s*8px/);
  });
});
