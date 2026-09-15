/**
 * Wave 66 leftover after tip/#316 — Juggle inject die radius/transition.
 * Soft layout existed; lock selector-scoped leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 66 juggle — inject die radius transition', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects die border-radius 12px and transition all 0.2s', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/\.juggle-die\s*\{[^}]*border-radius:\s*12px/);
    expect(css).toMatch(/\.juggle-die\s*\{[^}]*transition:\s*all 0\.2s/);
  });
});
