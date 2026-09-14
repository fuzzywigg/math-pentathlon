/**
 * Overnight HEAVY — Frac Fact board-ui exact Blue/Red.
 * Distinct leftover (no overnight frac board-ui). Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getPlayerName } from '../../src/games/frac-fact/board-ui';

describe('Overnight frac — Blue/Red names', () => {
  it('player1 Blue / player2 Red', () => {
    expect(getPlayerName('player1')).toBe('Blue');
    expect(getPlayerName('player2')).toBe('Red');
  });
});
