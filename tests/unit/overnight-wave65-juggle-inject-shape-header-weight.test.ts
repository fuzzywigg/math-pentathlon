/**
 * Wave 65 leftover after tip/#315 — Juggle inject shape-header font-weight 500.
 * Wave63 locked margin-bottom; weight/align leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 65 juggle — inject shape-header weight', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects .juggle-shape-header text-align center font-weight 500', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.juggle-shape-header\s*\{[^}]*text-align:\s*center/
    );
    expect(css).toMatch(
      /\.juggle-shape-header\s*\{[^}]*font-weight:\s*500/
    );
  });
});
