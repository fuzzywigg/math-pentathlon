/**
 * Wave 60 leftover after tip/#279 — Juggle die border #f57c00.
 * #289 locked size/bg/font; border leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 60 juggle — inject die border', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects .juggle-die 3px solid #f57c00 border', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.juggle-die\s*\{[^}]*border:\s*3px solid #f57c00/
    );
  });
});
