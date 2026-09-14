/**
 * Wave 42 leftovers D — ramrod opening hands scores. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import { CONFIG } from '../../src/games/ramrod/types';
import { createInitialState } from '../../src/games/ramrod/rules';

describe('Wave 42 ramrod — opening hands scores', () => {
  it('createInitialState hands length 5, scores 0, phase selectingRod', () => {
    const state = createInitialState();
    expect(state.playerRods.player1).toHaveLength(
      CONFIG.STARTING_RODS_PER_PLAYER
    );
    expect(state.playerRods.player2).toHaveLength(
      CONFIG.STARTING_RODS_PER_PLAYER
    );
    expect(state.scores).toEqual({ player1: 0, player2: 0 });
    expect(state.phase).toBe('selectingRod');
    expect(state.currentPlayer).toBe('player1');
    expect(state.selectedRod).toBeNull();
    expect(state.winner).toBeNull();
  });
});
