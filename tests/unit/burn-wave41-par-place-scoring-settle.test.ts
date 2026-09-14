/**
 * Wave 41 — Par 55 placeBlock scoring identity leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  selectBlock,
  placeBlock,
  getValidPlacements,
  calculateScore,
} from '../../src/games/par-55/rules';

describe('Wave 41 par — place scoring settle', () => {
  it('placeBlock score matches calculateScore preview', () => {
    let state = createInitialState();
    const block = state.hands.player1[0];
    state = selectBlock(state, block.id);
    const baseId = getValidPlacements(state)[0];
    const preview = calculateScore(state, block, baseId);
    const next = placeBlock(state, baseId);
    expect(next.scores.player1).toBe(preview.totalPoints);
    expect(next.moveHistory[0].pointsScored).toBe(preview.totalPoints);
    expect(next.moveHistory[0].matchDetails).toEqual(preview.matchDetails);
  });

  it('second seat place increments opponent score only', () => {
    let state = createInitialState();
    state = selectBlock(state, state.hands.player1[0].id);
    state = placeBlock(state, getValidPlacements(state)[0]);
    expect(state.currentPlayer).toBe('player2');
    const p1Score = state.scores.player1;
    const block2 = state.hands.player2[0];
    state = selectBlock(state, block2.id);
    const baseId = getValidPlacements(state)[0];
    const preview = calculateScore(state, block2, baseId);
    const next = placeBlock(state, baseId);
    expect(next.scores.player1).toBe(p1Score);
    expect(next.scores.player2).toBe(preview.totalPoints);
  });
});
