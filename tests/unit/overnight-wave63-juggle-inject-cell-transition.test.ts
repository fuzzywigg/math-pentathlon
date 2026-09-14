/**
 * Wave 63 leftover after tip/#301 — Juggle cell transition background 0.1s.
 * Distinct from size/preview color locks. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 63 juggle — inject cell transition', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects .juggle-cell transition background 0.1s + white fill', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.juggle-cell\s*\{[^}]*transition:\s*background 0\.1s/
    );
    expect(css).toMatch(/\.juggle-cell\s*\{[^}]*background:\s*#ffffff/);
  });
});
