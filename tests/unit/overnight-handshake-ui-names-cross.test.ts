/**
 * Overnight HEAVY — Blue/Red handshake across four leftover engines.
 * Distinct leftover cross-engine chrome (not #209 UI shell). Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getPlayerName as primeName } from '../../src/games/prime-gold/board-ui';
import { getPlayerName as fiarName } from '../../src/games/fiar/board-ui';
import { getPlayerName as fracName } from '../../src/games/frac-fact/board-ui';
import { getPlayerName as pentName } from '../../src/games/pent-em-in/board-ui';

describe('Overnight handshake — ui names cross', () => {
  it('all four engines share Blue/Red seat labels', () => {
    for (const getName of [primeName, fiarName, fracName, pentName]) {
      expect(getName('player1')).toBe('Blue');
      expect(getName('player2')).toBe('Red');
    }
  });
});
