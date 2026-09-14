/**
 * Overnight HEAVY leftover after #234 — Handshake inject style ids juggle/ramrod. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';
import { injectRamrodStyles } from '../../src/games/ramrod/board-ui';

describe('Wave 52 handshake — inject styles', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
    document.getElementById('ramrod-styles')?.remove();
  });

  it('juggle/ramrod style ids stay single after double inject', () => {
    injectJuggleStyles();
    injectRamrodStyles();
    injectJuggleStyles();
    injectRamrodStyles();
    expect(document.querySelectorAll('#juggle-styles').length).toBe(1);
    expect(document.querySelectorAll('#ramrod-styles').length).toBe(1);
  });
});
