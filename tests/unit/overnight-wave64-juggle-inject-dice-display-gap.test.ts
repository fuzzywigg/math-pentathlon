/**
 * Wave 64 leftover after tip/#301 + open #303 wave63 — Juggle dice-display gap.
 * Distinct from wave62 boards gap 2rem. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 64 juggle — inject dice-display gap', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects dice-display gap 2rem', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/\.juggle-dice-display\s*\{[^}]*gap:\s*2rem/);
  });
});
