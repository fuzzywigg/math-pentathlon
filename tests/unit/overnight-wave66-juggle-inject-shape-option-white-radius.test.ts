/**
 * Wave 66 leftover after tip/#316 — Juggle inject shape-option white.
 * Soft layout existed; lock selector-scoped leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 66 juggle — inject shape option white radius', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects shape-option white bg and radius 8px', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/\.juggle-shape-option\s*\{[^}]*background:\s*white/);
    expect(css).toMatch(/\.juggle-shape-option\s*\{[^}]*border-radius:\s*8px/);
  });
});
