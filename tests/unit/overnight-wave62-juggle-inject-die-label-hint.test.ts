/**
 * Wave 62 leftover after #293 — Juggle die-label / hint #666 typography leftovers.
 * Distinct from wave59 die 60px chrome. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 62 juggle — inject die-label hint', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects die-label 0.75rem and hint 0.9rem #666', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/\.juggle-die-label\s*\{[^}]*font-size:\s*0\.75rem/);
    expect(css).toMatch(/\.juggle-die-label\s*\{[^}]*color:\s*#666/);
    expect(css).toMatch(/\.juggle-hint\s*\{[^}]*font-size:\s*0\.9rem/);
    expect(css).toMatch(/\.juggle-hint\s*\{[^}]*color:\s*#666/);
  });
});
