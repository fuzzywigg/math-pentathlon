/**
 * Wave 49 — Handshake queens inject + Blue/Red names. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { getPlayerName, injectQGStyles } from '../../src/games/queens-guards/board-ui';

describe('Wave 49 handshake — queens inject/names', () => {
  beforeEach(() => {
    document.getElementById('qg-styles')?.remove();
  });
  it('injects styles and names seats', () => {
    injectQGStyles();
    expect(document.getElementById('qg-styles')).toBeTruthy();
    expect(getPlayerName('player1')).toBe('Blue');
    expect(getPlayerName('player2')).toBe('Red');
  });
});
