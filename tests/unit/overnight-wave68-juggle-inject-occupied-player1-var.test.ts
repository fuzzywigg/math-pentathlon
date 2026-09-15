/**
 * Wave 68 leftover after tip/#333 — occupied-player1 color var.
 * Soft inject existed; lock selector-scoped leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 68 juggle — inject occupied player1 var', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects occupied-player1 background var', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/\.juggle-cell\.occupied-player1\s*\{[^}]*background:\s*var\(--color-player1, #2196f3\)/);
  });
});
