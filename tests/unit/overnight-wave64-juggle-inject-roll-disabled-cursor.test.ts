/**
 * Wave 64 leftover after tip/#301 + open #303 wave63 — Juggle roll disabled cursor.
 * Wave59 locked opacity 0.5 only. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 64 juggle — inject roll disabled cursor', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects roll-btn:disabled cursor not-allowed', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.juggle-roll-btn:disabled\s*\{[^}]*cursor:\s*not-allowed/
    );
  });
});
