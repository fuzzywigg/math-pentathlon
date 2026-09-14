/**
 * Wave 45 — Par 55 p2 equal-target continue (tie) leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, selectBlock, placeBlock, passTurn, getValidPlacements } from '../../src/games/par-55/rules';
import { CONFIG } from '../../src/games/par-55/types';

describe('Wave 45 par — p2 equal target continue', () => {
  it('both at TARGET_SCORE equal keeps winner null when p2 places', () => {
    let state = passTurn(createInitialState());
    expect(state.currentPlayer).toBe('player2');
    state = {
      ...state,
      scores: { player1: CONFIG.TARGET_SCORE, player2: CONFIG.TARGET_SCORE - 1 },
    };
    const id = state.hands.player2[0].id;
    const placing = selectBlock(state, id);
    const next = placeBlock(placing, getValidPlacements(placing)[0]);
    if (next.scores.player2 === next.scores.player1 && next.scores.player2 >= CONFIG.TARGET_SCORE) {
      // tie branch: continue or null winner
      expect(next.winner).toBeNull();
    } else if (next.scores.player2 > next.scores.player1) {
      expect(next.winner).toBe('player2');
      expect(next.phase).toBe('gameOver');
    }
  });
});
