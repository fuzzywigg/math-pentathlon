/**
 * Wave 45 TOKENMAXX — cross-engine getOpponent handshake. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getOpponent as kingsOpp } from '../../src/games/kings-quadraphages/rules';
import { getOpponent as queensOpp } from '../../src/games/queens-guards/types';
import { getOpponent as remOpp } from '../../src/games/remainder-islands/types';
import { getOpponent as parOpp } from '../../src/games/par-55/types';
import { getOpponent as pinOpp } from '../../src/games/fraction-pinball/types';
import { getOpponent as kwaOpp } from '../../src/games/kwatro-sinko/types';

describe('Wave 45 handshake — opponent flips', () => {
  it('all engines flip seats', () => {
    for (const fn of [kingsOpp, queensOpp, remOpp, parOpp, pinOpp, kwaOpp]) {
      expect(fn('player1')).toBe('player2');
      expect(fn('player2')).toBe('player1');
    }
  });
});
