/**
 * Wave 65 leftover after tip/#311–#313 (unit-only) — Juggle die 60px / font 40.
 * Soft #fff8e1 / border elsewhere; lock size + font leftovers. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 65 juggle — inject die 60 font40', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects .juggle-die 60×60 + font-size 40px leftover', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/\.juggle-die\s*\{[^}]*width:\s*60px/);
    expect(css).toMatch(/\.juggle-die\s*\{[^}]*height:\s*60px/);
    expect(css).toMatch(/\.juggle-die\s*\{[^}]*font-size:\s*40px/);
  });
});
