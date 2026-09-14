/**
 * Overnight HEAVY leftover after #229 — Handshake Blue/Red across prime/frac/pent. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getPlayerName as primeName } from '../../src/games/prime-gold/board-ui';
import { getPlayerName as fracName } from '../../src/games/frac-fact/board-ui';
import { getPlayerName as pentName } from '../../src/games/pent-em-in/board-ui';

describe('Wave 50 handshake — Blue/Red names', () => {
  it('all three engines map player1→Blue / player2→Red', () => {
    for (const get of [primeName, fracName, pentName]) {
      expect(get('player1')).toBe('Blue');
      expect(get('player2')).toBe('Red');
    }
  });
});
