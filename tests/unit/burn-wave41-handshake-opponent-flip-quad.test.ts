/**
 * Wave 41 handshake — Queens × FIAR getOpponent seat flip agreement.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { getOpponent as qgOpp } from '../../src/games/queens-guards/types';
import { getOpponent as fiarOpp } from '../../src/games/fiar/types';
import { getOpponent as kingsOpp } from '../../src/games/kings-quadraphages/rules';
import { getOpponent as remOpp } from '../../src/games/remainder-islands/types';

describe('Wave 41 handshake — multi-game getOpponent', () => {
  it('all four engines flip player1↔player2 identically', () => {
    const engines = [qgOpp, fiarOpp, kingsOpp, remOpp];
    for (const opp of engines) {
      expect(opp('player1')).toBe('player2');
      expect(opp('player2')).toBe('player1');
      expect(opp(opp('player1'))).toBe('player1');
    }
  });
});
