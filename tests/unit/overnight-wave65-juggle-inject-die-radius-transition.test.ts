/**
 * Wave 65 leftover after tip/#315 — Juggle inject die radius + transition.
 * Size/bg/font/border locked; deepen radius 12px + transition. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 65 juggle — inject die radius transition', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects .juggle-die border-radius 12px + transition all 0.2s', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/\.juggle-die\s*\{[^}]*border-radius:\s*12px/);
    expect(css).toMatch(/\.juggle-die\s*\{[^}]*transition:\s*all 0\.2s/);
  });
});
