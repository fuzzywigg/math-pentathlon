/**
 * Wave 60 leftover after tip/#279 — Juggle control-btn gray fills.
 * Distinct from wave56 rotate/flip chrome. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 60 juggle — inject control btn gray', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects control-btn #e0e0e0 and hover #bdbdbd', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/\.juggle-control-btn\s*\{[^}]*background:\s*#e0e0e0/);
    expect(css).toMatch(
      /\.juggle-control-btn:hover\s*\{[^}]*background:\s*#bdbdbd/
    );
  });
});
