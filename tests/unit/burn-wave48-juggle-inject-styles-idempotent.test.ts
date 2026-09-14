/**
 * Wave 48 — Juggle injectJuggleStyles idempotent. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 48 juggle — inject styles', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });
  it('injects once', () => {
    injectJuggleStyles();
    injectJuggleStyles();
    expect(document.querySelectorAll('#juggle-styles').length).toBe(1);
  });
});
