/**
 * Wave 65 leftover after tip/#315 — Juggle inject status align/pad.
 * Status copy locked (wave60/62); status CSS never. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 65 juggle — inject status align pad', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects .juggle-status text-align center + padding 1rem', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/\.juggle-status\s*\{[^}]*text-align:\s*center/);
    expect(css).toMatch(/\.juggle-status\s*\{[^}]*padding:\s*1rem/);
  });
});
