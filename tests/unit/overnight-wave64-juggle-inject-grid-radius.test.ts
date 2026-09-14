/**
 * Wave 64 leftover after tip/#301 + open #303 wave63 — Juggle grid border-radius.
 * Wave63 locked gap/#ccc/padding; lock radius 4px. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 64 juggle — inject grid border-radius', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects juggle-grid border-radius 4px', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/\.juggle-grid\s*\{[^}]*border-radius:\s*4px/);
  });
});
