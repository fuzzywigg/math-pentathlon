/**
 * Wave 65 leftover after tip/#315 — Juggle inject boards justify-content center.
 * Wave64 locked flex-wrap; justify-content leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 65 juggle — inject boards justify center', () => {
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
