/**
 * Overnight HEAVY — FIAR board-ui exact Blue/Red labels.
 * Distinct leftover vs wave42 distinct-only asserts. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getPlayerName } from '../../src/games/fiar/board-ui';

describe('Overnight fiar — Blue/Red names', () => {
  it('player1 is Blue and player2 is Red', () => {
    expect(getPlayerName('player1')).toBe('Blue');
    expect(getPlayerName('player2')).toBe('Red');
  });
});
