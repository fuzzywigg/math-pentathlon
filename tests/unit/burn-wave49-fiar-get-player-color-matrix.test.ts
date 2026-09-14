/**
 * Wave 49 leftover after #221/#226/#227 — FIAR getPlayerColor distinct seats. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getPlayerColor, getPlayerName } from '../../src/games/fiar/board-ui';

describe('Wave 49 fiar — colors', () => {
  it('returns distinct colors and Blue/Red names', () => {
    expect(getPlayerName('player1')).toBe('Blue');
    expect(getPlayerName('player2')).toBe('Red');
    expect(getPlayerColor('player1')).not.toBe(getPlayerColor('player2'));
    expect(getPlayerColor('player1').length).toBeGreaterThan(0);
  });
});
