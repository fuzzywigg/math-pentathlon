/**
 * Wave 65 leftover after tip/#311–#313 (unit-only) — Juggle dice-area column/pad.
 * Soft dice-display gap in #315; lock dice-area column leftovers. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 65 juggle — inject dice-area column', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects .juggle-dice-area column + pad 1rem + gap 0.5rem', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/\.juggle-dice-area\s*\{[^}]*flex-direction:\s*column/);
    expect(css).toMatch(/\.juggle-dice-area\s*\{[^}]*padding:\s*1rem/);
    expect(css).toMatch(/\.juggle-dice-area\s*\{[^}]*gap:\s*0\.5rem/);
  });
});
