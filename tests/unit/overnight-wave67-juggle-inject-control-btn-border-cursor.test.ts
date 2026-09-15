/**
 * Wave 67 leftover after tip/#316 — Juggle control-btn border/cursor leftovers.
 * Wave66 locked weight/pad/transition; lock border none + cursor leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 67 juggle — inject control-btn border cursor', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects control-btn border none and cursor pointer', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/\.juggle-control-btn\s*\{[^}]*border:\s*none/);
    expect(css).toMatch(/\.juggle-control-btn\s*\{[^}]*cursor:\s*pointer/);
  });
});
