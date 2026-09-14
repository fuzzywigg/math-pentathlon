/**
 * Wave 60 leftover after tip/#279 — Juggle roll-btn box-shadow leftover.
 * Distinct from wave58 roll gradient / #289 disabled opacity. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 60 juggle — inject roll shadow', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects roll-btn orange box-shadow', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toContain('box-shadow: 0 4px 12px rgba(245, 124, 0, 0.3)');
  });
});
