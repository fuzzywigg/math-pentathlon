/**
 * Wave 67 leftover after tip/#316 — Juggle boards justify-content center.
 * Wave66 locked display flex; lock justify-content leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 67 juggle — inject boards justify center', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects .juggle-boards justify-content center', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.juggle-boards\s*\{[^}]*justify-content:\s*center/
    );
  });
});
