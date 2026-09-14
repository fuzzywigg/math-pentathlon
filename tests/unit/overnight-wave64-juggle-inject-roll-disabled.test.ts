/**
 * Wave 64 leftover after tip/#303 — Juggle inject roll disabled opacity/cursor.
 * Unsaturated :disabled not-allowed / opacity 0.5 leftovers. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 64 juggle — inject roll disabled', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects roll-btn:disabled opacity 0.5 and not-allowed', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.juggle-roll-btn:disabled\s*\{[^}]*opacity:\s*0\.5/
    );
    expect(css).toMatch(
      /\.juggle-roll-btn:disabled\s*\{[^}]*cursor:\s*not-allowed/
    );
  });
});
