/**
 * Overnight HEAVY — Prime Gold board-ui exact Blue/Red.
 * Distinct leftover (no overnight prime board-ui yet). Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getPlayerName } from '../../src/games/prime-gold/board-ui';

describe('Overnight prime — Blue/Red names', () => {
  it('player1 Blue / player2 Red', () => {
    expect(getPlayerName('player1')).toBe('Blue');
    expect(getPlayerName('player2')).toBe('Red');
  });
});
