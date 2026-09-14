/**
 * Wave 60 leftover after tip/#279 — Juggle board background #f5f5f5.
 * Distinct from wave58 cell 28px / #289 die chrome. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 60 juggle — inject board bg f5', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects .juggle-board background #f5f5f5', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/\.juggle-board\s*\{[^}]*background:\s*#f5f5f5/);
  });
});
