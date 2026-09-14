/**
 * Wave 45 — Par 55 empty-hands score settle leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, selectBlock, placeBlock, getValidPlacements } from '../../src/games/par-55/rules';
import type { AttributeBlock } from '../../src/games/par-55/types';

describe('Wave 45 par — empty hands settle', () => {
  it('last hand block with empty opponent hand settles by score', () => {
    const state = createInitialState();
    const only: AttributeBlock = state.hands.player1[0];
    const forged = {
      ...state,
      hands: { player1: [only], player2: [] as AttributeBlock[] },
      scores: { player1: 10, player2: 3 },
    };
    const placing = selectBlock(forged, only.id);
    const next = placeBlock(placing, getValidPlacements(placing)[0]);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player1');
  });
});
