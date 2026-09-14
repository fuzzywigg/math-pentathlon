/**
 * Wave 41 — FIAR getValidMoves / canMove / moveChip phase rejects. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  getValidMoves,
  canMove,
  moveChip,
  placeChip,
} from '../../src/games/fiar/rules';
import {
  createInitialState,
  CONFIG,
} from '../../src/games/fiar/types';

function toMovement() {
  let state = createInitialState();
  const ids = [...state.board.nodes.keys()];
  for (let i = 0; i < CONFIG.CHIPS_PER_PLAYER * 2; i++) {
    state = placeChip(state, ids[i]);
  }
  return state;
}

describe('Wave 41 fiar — move phase rejects', () => {
  it('placement phase yields empty valid moves / identity moveChip', () => {
    const state = createInitialState();
    const id = [...state.board.nodes.keys()][0];
    expect(getValidMoves(state, id)).toEqual([]);
    expect(canMove(state, id, '0-1')).toBe(false);
    expect(moveChip(state, id, '0-1')).toBe(state);
  });

  it('opponent chip and empty node reject in movement', () => {
    const state = toMovement();
    // Find a player2 chip while seat is player1 after even placement count
    let oppId = '';
    let emptyId = '';
    for (const [id, node] of state.board.nodes) {
      if (node.chip === 'player2' && !oppId) oppId = id;
      if (node.chip === null && !emptyId) emptyId = id;
    }
    expect(oppId).toBeTruthy();
    expect(getValidMoves(state, oppId)).toEqual([]);
    expect(getValidMoves(state, emptyId)).toEqual([]);
    expect(moveChip(state, oppId, emptyId)).toBe(state);
  });

  it('legal move clears origin and flips seat', () => {
    const state = toMovement();
    let from = '';
    let to = '';
    for (const [id, node] of state.board.nodes) {
      if (node.chip !== state.currentPlayer) continue;
      const moves = getValidMoves(state, id);
      if (moves.length > 0) {
        from = id;
        to = moves[0];
        break;
      }
    }
    expect(from).toBeTruthy();
    expect(canMove(state, from, to)).toBe(true);
    const next = moveChip(state, from, to);
    expect(next).not.toBe(state);
    expect(next.board.nodes.get(from)?.chip).toBeNull();
    expect(next.board.nodes.get(to)?.chip).toBe(state.currentPlayer);
    expect(next.currentPlayer).not.toBe(state.currentPlayer);
    expect(next.selectedNode).toBeNull();
  });

  it('blocked destination identity', () => {
    const state = toMovement();
    // Find own chip with moves, try move onto occupied (forged)
    let from = '';
    for (const [id, node] of state.board.nodes) {
      if (node.chip === state.currentPlayer) {
        from = id;
        break;
      }
    }
    let occupied = '';
    for (const [id, node] of state.board.nodes) {
      if (node.chip && id !== from) {
        occupied = id;
        break;
      }
    }
    expect(canMove(state, from, occupied)).toBe(false);
    expect(moveChip(state, from, occupied)).toBe(state);
  });
});
