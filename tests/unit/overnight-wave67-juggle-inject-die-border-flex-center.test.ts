/**
 * Wave 67 leftover after tip/#316 — Juggle die border + flex center leftovers.
 * Soft 60px/#fff8e1 existed; lock #f57c00 border + flex center leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 67 juggle — inject die border flex center', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects die #f57c00 border and flex center leftovers', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.juggle-die\s*\{[^}]*border:\s*3px solid #f57c00/
    );
    expect(css).toMatch(/\.juggle-die\s*\{[^}]*align-items:\s*center/);
    expect(css).toMatch(/\.juggle-die\s*\{[^}]*justify-content:\s*center/);
    expect(css).toMatch(/\.juggle-die\s*\{[^}]*font-size:\s*40px/);
  });
});
