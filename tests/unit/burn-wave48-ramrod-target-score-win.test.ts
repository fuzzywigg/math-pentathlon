/**
 * Wave 48 — Ramrod placeRod completes box to hit TARGET_SCORE win. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  selectRod,
  placeRod,
  isValidPlacement,
} from '../../src/games/ramrod/rules';
import { CONFIG, createRod } from '../../src/games/ramrod/types';

describe('Wave 48 ramrod — target score win', () => {
  it('completing a box at TARGET_SCORE-adjacent settles gameOver', () => {
    const s = createInitialState();
    // Use box-0-0 target 5; place first rod length 2, second length 3
    const r2 = createRod('win-a', 2);
    const r3 = createRod('win-b', 3);
    r2.owner = 'player1';
    r3.owner = 'player1';
    const rods = new Map(s.rods);
    rods.set(r2.id, r2);
    rods.set(r3.id, r3);
    let state = {
      ...s,
      rods,
      playerRods: { player1: [r2.id, r3.id], player2: s.playerRods.player2 },
      scores: { player1: CONFIG.TARGET_SCORE - 5, player2: 0 },
    };
    state = selectRod(state, r2.id);
    expect(isValidPlacement(state, r2.id, 'box-0-0', 0)).toBe(true);
    state = placeRod(state, 'box-0-0', 0);
    // After first place, seat flips — force back to p1 for completing move
    state = {
      ...state,
      currentPlayer: 'player1',
      phase: 'selectingRod',
      selectedRod: null,
    };
    state = selectRod(state, r3.id);
    const next = placeRod(state, 'box-0-0', 1);
    expect(next.scores.player1).toBeGreaterThanOrEqual(CONFIG.TARGET_SCORE);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player1');
  });
});
