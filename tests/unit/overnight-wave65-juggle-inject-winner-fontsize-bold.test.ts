/**
 * Wave 65 leftover after tip/#315 — Juggle inject winner font-size/bold.
 * Gradient/pad/margin/glow locked; deepen type chrome. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 65 juggle — inject winner fontsize bold', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects winner-banner font-size 1.5rem + bold + center', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.juggle-winner-banner\s*\{[^}]*font-size:\s*1\.5rem/
    );
    expect(css).toMatch(
      /\.juggle-winner-banner\s*\{[^}]*font-weight:\s*bold/
    );
    expect(css).toMatch(
      /\.juggle-winner-banner\s*\{[^}]*text-align:\s*center/
    );
  });
});
