/**
 * Wave 66 leftover after tip/#316 — Juggle inject grid radius 4.
 * Soft layout existed; lock selector-scoped leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 66 juggle — inject grid radius 4px', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects grid border-radius 4px', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/\.juggle-grid\s*\{[^}]*border-radius:\s*4px/);
  });
});
