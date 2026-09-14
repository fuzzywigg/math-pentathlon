/**
 * Wave 41 — FIAR selectChip toggle / getSelectableNodes / isDraw edges.
 * Beyond wave35/39 deselect leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  selectChip,
  deselectChip,
  getSelectableNodes,
  isDraw,
  placeChip,
  getValidMoves,
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

describe('Wave 41 fiar — select / draw matrix', () => {
  it('placement: selectable empty, isDraw false, select identity', () => {
    const state = createInitialState();
    expect(getSelectableNodes(state)).toEqual([]);
    expect(isDraw(state)).toBe(false);
    expect(selectChip(state, '0-0')).toBe(state);
  });

  it('movement: selectable ⊆ own chips with moves; toggle select', () => {
    const state = toMovement();
    const selectable = getSelectableNodes(state);
    expect(selectable.length).toBeGreaterThan(0);
    for (const id of selectable) {
      expect(state.board.nodes.get(id)?.chip).toBe(state.currentPlayer);
      expect(getValidMoves(state, id).length).toBeGreaterThan(0);
    }
    const first = selectable[0];
    const selected = selectChip(state, first);
    expect(selected.selectedNode).toBe(first);
    const toggled = selectChip(selected, first);
    expect(toggled.selectedNode).toBeNull();
    expect(deselectChip(selected).selectedNode).toBeNull();
  });

  it('select rejects opponent node even in movement', () => {
    const state = toMovement();
    let opp = '';
    for (const [id, node] of state.board.nodes) {
      if (node.chip && node.chip !== state.currentPlayer) {
        opp = id;
        break;
      }
    }
    expect(opp).toBeTruthy();
    expect(selectChip(state, opp)).toBe(state);
  });

  it('isDraw true when current player has no movable chips', () => {
    const state = {
      ...toMovement(),
      // Strip current player's chips
    };
    const nodes = new Map(state.board.nodes);
    for (const [id, node] of nodes) {
      if (node.chip === state.currentPlayer) {
        nodes.set(id, { ...node, chip: null });
      }
    }
    const stuck = { ...state, board: { ...state.board, nodes } };
    expect(getSelectableNodes(stuck)).toEqual([]);
    expect(isDraw(stuck)).toBe(true);
  });
});
