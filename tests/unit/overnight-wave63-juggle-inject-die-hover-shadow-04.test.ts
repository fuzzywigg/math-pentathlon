/**
 * Wave 63 leftover after tip/#301 — Juggle die selectable hover shadow 0.4.
 * Wave60 locked hover scale; deepen box-shadow opacity. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 63 juggle — inject die hover shadow 04', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects selectable:hover box-shadow rgba opacity 0.4', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toContain('0 4px 12px rgba(245, 124, 0, 0.4)');
    expect(css).toContain('.juggle-die.selectable:hover');
  });
});
