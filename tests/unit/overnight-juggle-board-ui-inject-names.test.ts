/**
 * Overnight HEAVY after #214/#215 — Juggle inject styles + seat names. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectJuggleStyles, getPlayerName } from '../../src/games/juggle/board-ui';

afterEach(() => {
  document.getElementById('juggle-styles')?.remove();
});

describe('Overnight juggle — board-ui chrome', () => {
  it('distinct seat names; styles inject idempotent', () => {
    expect(getPlayerName('player1')).toBeTruthy();
    expect(getPlayerName('player2')).toBeTruthy();
    expect(getPlayerName('player1')).not.toBe(getPlayerName('player2'));
    injectJuggleStyles();
    injectJuggleStyles();
    expect(document.getElementById('juggle-styles')).toBeTruthy();
  });
});
