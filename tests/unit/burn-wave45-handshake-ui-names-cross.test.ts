/**
 * Wave 45 TOKENMAXX — cross-engine board-ui names handshake. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getPlayerName as queens } from '../../src/games/queens-guards/board-ui';
import { getPlayerName as rem } from '../../src/games/remainder-islands/board-ui';
import { getPlayerName as par } from '../../src/games/par-55/board-ui';
import { getPlayerName as pin } from '../../src/games/fraction-pinball/board-ui';
import { getPlayerName as kwa } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 45 handshake — ui names', () => {
  it('each engine distinguishes seats', () => {
    for (const fn of [queens, rem, par, pin, kwa]) {
      expect(fn('player1')).not.toBe(fn('player2'));
    }
  });
});
