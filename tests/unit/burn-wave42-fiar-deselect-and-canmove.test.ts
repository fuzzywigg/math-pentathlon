/**
 * Wave 42 — FIAR deselectChip + canMove mirrors getValidMoves. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  deselectChip,
  canMove,
  getValidMoves,
  placeChip,
  selectChip,
} from '../../src/games/fiar/rules';
import { createInitialState, CONFIG } from '../../src/games/fiar/types';

function toMovement() {
  let state = createInitialState();
  const ids = [...state.board.nodes.keys()];
  for (let i = 0; i < CONFIG.CHIPS_PER_PLAYER * 2; i++) {
    state = placeChip(state, ids[i]);
  }
  return state;
}

describe('Wave 42 fiar — deselect and canMove', () => {
  it('deselectChip clears selectedNode without touching phase', () => {
    const state = toMovement();
    const withSel = { ...state, selectedNode: '0-0' };
    const cleared = deselectChip(withSel);
    expect(cleared.selectedNode).toBeNull();
    expect(cleared.phase).toBe(withSel.phase);
    expect(cleared.board).toBe(withSel.board);
  });

  it('deselectChip on already-null selection stays null', () => {
    const state = toMovement();
    expect(state.selectedNode).toBeNull();
    expect(deselectChip(state).selectedNode).toBeNull();
  });

  it('canMove true iff toId is in getValidMoves(from)', () => {
    const state = toMovement();
    let from = '';
    for (const [id, node] of state.board.nodes) {
      if (node.chip === state.currentPlayer) {
        const moves = getValidMoves(state, id);
        if (moves.length > 0) {
          from = id;
          break;
        }
      }
    }
    expect(from).toBeTruthy();
    const valids = getValidMoves(state, from);
    for (const to of valids) {
      expect(canMove(state, from, to)).toBe(true);
    }
    // Occupied destination never mirrors as valid
    let occupied = '';
    for (const [id, node] of state.board.nodes) {
      if (node.chip && id !== from) {
        occupied = id;
        break;
      }
    }
    expect(valids).not.toContain(occupied);
    expect(canMove(state, from, occupied)).toBe(false);
  });

  it('select then deselect returns to no selection', () => {
    const state = toMovement();
    let pick = '';
    for (const [id, node] of state.board.nodes) {
      if (
        node.chip === state.currentPlayer &&
        getValidMoves(state, id).length > 0
      ) {
        pick = id;
        break;
      }
    }
    const selected = selectChip(state, pick);
    expect(selected.selectedNode).toBe(pick);
    expect(deselectChip(selected).selectedNode).toBeNull();
  });
});
