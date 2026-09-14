/**
 * Wave 43 — getOpponent involution across leftover engines. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getOpponent as callaOpp } from '../../src/games/calla/types';
import { getOpponent as juggleOpp } from '../../src/games/juggle/types';
import { getOpponent as hagOpp } from '../../src/games/hex-a-gone/types';
import { getOpponent as ramrodOpp } from '../../src/games/ramrod/types';

describe('Wave 43 handshake — five engine opponents', () => {
  it('getOpponent involution across calla/juggle/hag/ramrod', () => {
    for (const opp of [callaOpp, juggleOpp, hagOpp, ramrodOpp]) {
      expect(opp('player1')).toBe('player2');
      expect(opp(opp('player1'))).toBe('player1');
    }
  });
});
