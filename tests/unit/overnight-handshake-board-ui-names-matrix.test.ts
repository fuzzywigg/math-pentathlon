/**
 * Overnight TOKENMAXX HEAVY — handshake board-ui names matrix leftovers after #202.
 * Tests-only. Distinct from demos (#202) and wave43/44 Contig/SD/Star/Fab drafts.
 * No product inventing.
 */

import { describe, it, expect } from 'vitest';
import { getPlayerName as parName } from '../../src/games/par-55/board-ui';
import { getPlayerName as primeName } from '../../src/games/prime-gold/board-ui';
import { getPlayerName as pentName } from '../../src/games/pent-em-in/board-ui';
import { getPlayerName as queensName } from '../../src/games/queens-guards/board-ui';
import { getPlayerName as fracName } from '../../src/games/frac-fact/board-ui';

describe('Overnight handshake — board-ui names matrix', () => {
  it('all leftover engines label seats Blue/Red distinctly', () => {
    for (const get of [parName, primeName, pentName, queensName, fracName]) {
      expect(get('player1')).toBe('Blue');
      expect(get('player2')).toBe('Red');
    }
  });
});
