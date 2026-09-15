/**
 * Wave 65 leftover after tip/#315 — Juggle inject die border #f57c00.
 * Wave59 locked size/fill/font; border leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 65 juggle — inject die border f57c00', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects .juggle-die border 3px solid #f57c00', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.juggle-die\s*\{[^}]*border:\s*3px\s+solid\s+#f57c00/
    );
  });
});
