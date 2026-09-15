/**
 * Wave 66 leftover after tip/#316 — Juggle inject status center pad.
 * Soft layout existed; lock selector-scoped leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 66 juggle — inject status center pad', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects status text-align center and pad 1rem', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/\.juggle-status\s*\{[^}]*text-align:\s*center/);
    expect(css).toMatch(/\.juggle-status\s*\{[^}]*padding:\s*1rem/);
  });
});
