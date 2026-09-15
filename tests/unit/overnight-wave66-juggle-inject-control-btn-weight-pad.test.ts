/**
 * Wave 66 leftover after tip/#316 — Juggle inject control weight/pad.
 * Soft layout existed; lock selector-scoped leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 66 juggle — inject control btn weight pad', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects control-btn font-weight 500 and pad 0.5rem 1rem', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/\.juggle-control-btn\s*\{[^}]*font-weight:\s*500/);
    expect(css).toMatch(/\.juggle-control-btn\s*\{[^}]*padding:\s*0\.5rem 1rem/);
    expect(css).toMatch(/\.juggle-control-btn\s*\{[^}]*transition:\s*background 0\.15s/);
  });
});
