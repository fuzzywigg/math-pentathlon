/**
 * Wave 65 leftover after tip/#311–#313 (unit-only) — Juggle hint chrome.
 * Soft die-label elsewhere; lock .juggle-hint leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 65 juggle — inject hint chrome', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects .juggle-hint 0.9rem #666 margin-top leftover', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/\.juggle-hint\s*\{[^}]*font-size:\s*0\.9rem/);
    expect(css).toMatch(/\.juggle-hint\s*\{[^}]*color:\s*#666/);
    expect(css).toMatch(/\.juggle-hint\s*\{[^}]*margin-top:\s*0\.5rem/);
  });
});
