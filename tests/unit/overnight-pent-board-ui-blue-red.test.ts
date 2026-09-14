/**
 * Overnight HEAVY — Pent'Em In board-ui exact Blue/Red.
 * Distinct leftover overnight board-ui cold path. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getPlayerName } from '../../src/games/pent-em-in/board-ui';

describe('Overnight pent — Blue/Red names', () => {
  it('player1 Blue / player2 Red', () => {
    expect(getPlayerName('player1')).toBe('Blue');
    expect(getPlayerName('player2')).toBe('Red');
  });
});
