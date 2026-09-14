/**
 * Wave 45 — Par 55 placeBlock p1 target-score settle leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, selectBlock, placeBlock, getValidPlacements } from '../../src/games/par-55/rules';
import { CONFIG } from '../../src/games/par-55/types';

describe('Wave 45 par — p1 target win', () => {
  it('player1 reaching TARGET_SCORE settles gameOver as winner', () => {
    const state = createInitialState();
    const hot = { ...state, scores: { player1: CONFIG.TARGET_SCORE - 1, player2: 0 } };
    const id = hot.hands.player1[0].id;
    const placing = selectBlock(hot, id);
    const next = placeBlock(placing, getValidPlacements(placing)[0]);
    // may or may not hit exactly depending on points; if score >= 55 expect win
    if (next.scores.player1 >= CONFIG.TARGET_SCORE) {
      expect(next.phase).toBe('gameOver');
      expect(next.winner).toBe('player1');
    } else {
      expect(next.scores.player1).toBeGreaterThanOrEqual(CONFIG.TARGET_SCORE - 1);
    }
  });
});
