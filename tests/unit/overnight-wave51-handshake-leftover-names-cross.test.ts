/**
 * Overnight HEAVY leftovers after #234 — Blue/Red name cross for leftover games. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getPlayerName as parName } from '../../src/games/par-55/board-ui';
import { getPlayerName as kwaName } from '../../src/games/kwatro-sinko/board-ui';
import { getPlayerName as starsName } from '../../src/games/stars-bars/board-ui';
import { getPlayerName as sumName } from '../../src/games/sum-dominoes/board-ui';
import { getPlayerName as remName } from '../../src/games/remainder-islands/board-ui';
import { getPlayerName as fiarName } from '../../src/games/fiar/board-ui';

describe('Wave 51 handshake — leftover Blue/Red names', () => {
  it('maps player1→Blue and player2→Red across leftovers', () => {
    for (const getName of [parName, kwaName, starsName, sumName, remName, fiarName]) {
      expect(getName('player1')).toBe('Blue');
      expect(getName('player2')).toBe('Red');
    }
  });
});
