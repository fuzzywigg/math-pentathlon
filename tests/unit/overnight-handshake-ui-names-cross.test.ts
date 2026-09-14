/**
 * Overnight TOKENMAXX — UI Blue/Red names cross-slice leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getPlayerName as fiarName } from '../../src/games/fiar/board-ui';
import { getPlayerName as fracName } from '../../src/games/frac-fact/board-ui';
import { getPlayerName as starsName } from '../../src/games/stars-bars/board-ui';

describe('Overnight handshake — UI names', () => {
  it('Blue/Red consistent', () => {
    for (const name of [fiarName, fracName, starsName]) {
      expect(name('player1')).toBe('Blue');
      expect(name('player2')).toBe('Red');
    }
  });
});
