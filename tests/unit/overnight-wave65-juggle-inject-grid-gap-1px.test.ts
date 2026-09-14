/**
 * Wave 65 leftover after tip/#311–#313 (unit-only) — Juggle grid gap 1px.
 * Soft #ccc background elsewhere; lock gap 1px leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 65 juggle — inject grid gap 1px', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects .juggle-grid gap 1px + padding 1px', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/\.juggle-grid\s*\{[^}]*gap:\s*1px/);
    expect(css).toMatch(/\.juggle-grid\s*\{[^}]*padding:\s*1px/);
  });
});
