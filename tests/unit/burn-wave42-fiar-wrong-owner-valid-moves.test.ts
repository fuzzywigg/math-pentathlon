/**
 * Wave 42 — FIAR wrong-owner getValidMoves empty. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { getValidMoves, canMove, moveChip, placeChip } from '../../src/games/fiar/rules';
import { createInitialState, CONFIG } from '../../src/games/fiar/types';

function toMovement() {
  let state = createInitialState();
  const ids = [...state.board.nodes.keys()];
  for (let i = 0; i < CONFIG.CHIPS_PER_PLAYER * 2; i++) {
    state = placeChip(state, ids[i]);
  }
  return state;
}

describe('Wave 42 fiar — wrong owner valid moves', () => {
  it('opponent chip yields empty getValidMoves', () => {
    const state = toMovement();
    let opp = '';
    for (const [id, node] of state.board.nodes) {
      if (node.chip && node.chip !== state.currentPlayer) {
        opp = id;
        break;
      }
    }
    expect(opp).toBeTruthy();
    expect(getValidMoves(state, opp)).toEqual([]);
  });

  it('canMove / moveChip reject wrong-owner origin', () => {
    const state = toMovement();
    let opp = '';
    let empty = '';
    for (const [id, node] of state.board.nodes) {
      if (node.chip && node.chip !== state.currentPlayer && !opp) opp = id;
      if (node.chip === null && !empty) empty = id;
    }
    expect(canMove(state, opp, empty)).toBe(false);
    expect(moveChip(state, opp, empty)).toBe(state);
  });

  it('empty node origin also yields empty valid moves', () => {
    const state = toMovement();
    let empty = '';
    for (const [id, node] of state.board.nodes) {
      if (node.chip === null) {
        empty = id;
        break;
      }
    }
    expect(getValidMoves(state, empty)).toEqual([]);
  });
});
