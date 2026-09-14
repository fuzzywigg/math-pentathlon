/**
 * Wave 65 leftover after tip/#311–#313 (unit-only) — Juggle status pad.
 * Soft seat color vars elsewhere; lock .juggle-status pad leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 65 juggle — inject status pad', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects .juggle-status text-align center + padding 1rem', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/\.juggle-status\s*\{[^}]*text-align:\s*center/);
    expect(css).toMatch(/\.juggle-status\s*\{[^}]*padding:\s*1rem/);
  });
});
