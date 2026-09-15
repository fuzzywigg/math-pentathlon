/**
 * Wave 65 leftover after tip/#315 — Juggle inject die transition all 0.2s.
 * Wave59 locked size/fill; transition leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 65 juggle — inject die transition', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects .juggle-die transition all 0.2s', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.juggle-die\s*\{[^}]*transition:\s*all\s+0\.2s/
    );
  });
});
