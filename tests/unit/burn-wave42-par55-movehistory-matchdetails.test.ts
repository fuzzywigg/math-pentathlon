/** Wave 42 — Par 55 place appends moveHistory with points. Tests-only. */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  selectBlock,
  placeBlock,
  getValidPlacements,
  calculateScore,
} from '../../src/games/par-55/rules';

describe('Wave 42 par55 — moveHistory match details', () => {
  it('place appends one history entry with pointsScored', () => {
    let state = createInitialState();
    expect(state.moveHistory).toHaveLength(0);
    const block = state.hands.player1[0];
    state = selectBlock(state, block.id);
    const baseId = getValidPlacements(state)[0];
    const preview = calculateScore(state, block, baseId);
    const next = placeBlock(state, baseId);
    expect(next.moveHistory).toHaveLength(1);
    const move = next.moveHistory[0];
    expect(move.player).toBe('player1');
    expect(move.block.id).toBe(block.id);
    expect(move.baseId).toBe(baseId);
    expect(move.pointsScored).toBe(preview.totalPoints);
    expect(move.moveNumber).toBe(1);
  });

  it('matchDetails on history match calculateScore preview', () => {
    let state = createInitialState();
    const block = state.hands.player1[0];
    state = selectBlock(state, block.id);
    const baseId = getValidPlacements(state)[0];
    const preview = calculateScore(state, block, baseId);
    const next = placeBlock(state, baseId);
    expect(next.moveHistory[0].matchDetails).toEqual(preview.matchDetails);
  });

  it('second place appends moveNumber 2 for player2', () => {
    let state = createInitialState();
    state = selectBlock(state, state.hands.player1[0].id);
    state = placeBlock(state, getValidPlacements(state)[0]);
    expect(state.moveHistory).toHaveLength(1);
    const block2 = state.hands.player2[0];
    state = selectBlock(state, block2.id);
    const baseId = getValidPlacements(state)[0];
    const preview = calculateScore(state, block2, baseId);
    const next = placeBlock(state, baseId);
    expect(next.moveHistory).toHaveLength(2);
    expect(next.moveHistory[1].player).toBe('player2');
    expect(next.moveHistory[1].moveNumber).toBe(2);
    expect(next.moveHistory[1].pointsScored).toBe(preview.totalPoints);
  });

  it('identity place does not append history', () => {
    const state = createInitialState();
    const rejected = placeBlock(state, 'ghost');
    expect(rejected.moveHistory).toHaveLength(0);
    expect(rejected).toBe(state);
  });
});
