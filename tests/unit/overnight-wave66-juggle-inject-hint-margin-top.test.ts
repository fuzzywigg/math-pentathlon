/**
 * Wave 66 leftover after tip/#316 — Juggle inject hint margin-top.
 * Soft layout existed; lock selector-scoped leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 66 juggle — inject hint margin top', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects hint margin-top 0.5rem', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/\.juggle-hint\s*\{[^}]*margin-top:\s*0\.5rem/);
  });
});
