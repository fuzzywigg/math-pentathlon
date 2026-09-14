/**
 * Overnight TOKENMAXX — opponent flip cross-slice leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getOpponent as fiarOpp } from '../../src/games/fiar/types';
import { getOpponent as hexOpp } from '../../src/games/hex/types';
import { getOpponent as fracOpp } from '../../src/games/frac-fact/types';
import { getOpponent as hagOpp } from '../../src/games/hex-a-gone/types';
import { getOpponent as callaOpp } from '../../src/games/calla/types';

describe('Overnight handshake — opponent flips', () => {
  it('p1↔p2 across engines', () => {
    for (const opp of [fiarOpp, hexOpp, fracOpp, hagOpp, callaOpp]) {
      expect(opp('player1')).toBe('player2');
      expect(opp('player2')).toBe('player1');
    }
  });
});
