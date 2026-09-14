/**
 * Wave 64 leftover after tip/#303 — Juggle inject boards flex-wrap.
 * Wave62 locked gap/transparent border; deepen flex-wrap leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 64 juggle — inject boards flex-wrap', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects .juggle-boards flex-wrap wrap + justify-center', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/\.juggle-boards\s*\{[^}]*flex-wrap:\s*wrap/);
    expect(css).toMatch(
      /\.juggle-boards\s*\{[^}]*justify-content:\s*center/
    );
  });
});
