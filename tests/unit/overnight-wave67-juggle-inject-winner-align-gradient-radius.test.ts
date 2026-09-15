/**
 * Wave 67 leftover after tip/#316 — Juggle winner align/gradient/radius leftovers.
 * Soft banner pad/margin existed; lock text-align + gold gradient + radius leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 67 juggle — inject winner align gradient radius', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects winner banner align/gradient/radius leftovers', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.juggle-winner-banner\s*\{[^}]*text-align:\s*center/
    );
    expect(css).toMatch(
      /\.juggle-winner-banner\s*\{[^}]*background:\s*linear-gradient\(135deg, #ffd700, #ffec8b\)/
    );
    expect(css).toMatch(
      /\.juggle-winner-banner\s*\{[^}]*border-radius:\s*8px/
    );
  });
});
