/**
 * Wave 67 leftover after tip/#316 — Juggle roll-btn weight/cursor/shadow.
 * Wave66 locked white/border/radius; lock weight/cursor/shadow leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 67 juggle — inject roll-btn weight cursor shadow', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects roll-btn bold/cursor/box-shadow leftovers', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/\.juggle-roll-btn\s*\{[^}]*font-weight:\s*bold/);
    expect(css).toMatch(/\.juggle-roll-btn\s*\{[^}]*cursor:\s*pointer/);
    expect(css).toMatch(
      /\.juggle-roll-btn\s*\{[^}]*box-shadow:\s*0 4px 12px rgba\(245, 124, 0, 0\.3\)/
    );
  });
});
