/**
 * Wave 43 — Ramrod board-ui seat names leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getPlayerName } from '../../src/games/ramrod/board-ui';

describe('Wave 43 ramrod — ui names', () => {
  it('Blue vs Red distinct seats', () => {
    expect(getPlayerName('player1')).toBe('Blue');
    expect(getPlayerName('player2')).toBe('Red');
    expect(getPlayerName('player1')).not.toBe(getPlayerName('player2'));
  });
});
