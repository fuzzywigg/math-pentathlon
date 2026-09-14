/**
 * Overnight TOKENMAXX HEAVY — pent-em-in unknown shape skip leftovers after #202.
 * Tests-only. Distinct from demos (#202) and wave43/44 Contig/SD/Star/Fab drafts.
 * No product inventing.
 */

import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/pent-em-in/types';
import { canPlayerMove } from '../../src/games/pent-em-in/rules';

describe('Overnight pent — unknown shape skip', () => {
  it('forged unknown shape id is skipped; known I still allows move', () => {
    const open = createInitialState();
    const forged = {
      ...open,
      player1Pieces: {
        ...open.player1Pieces,
        available: ['NOPE', 'I'],
      },
    };
    expect(canPlayerMove(forged, 'player1')).toBe(true);
  });
});
