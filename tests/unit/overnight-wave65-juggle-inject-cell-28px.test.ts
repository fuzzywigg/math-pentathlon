/**
 * Wave 65 leftover after tip/#311–#313 (unit-only) — Juggle cell 28×28.
 * Soft media 24px elsewhere; lock desktop 28px leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 65 juggle — inject cell 28px', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects .juggle-cell width/height 28px leftover', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/\.juggle-cell\s*\{[^}]*width:\s*28px/);
    expect(css).toMatch(/\.juggle-cell\s*\{[^}]*height:\s*28px/);
  });
});
