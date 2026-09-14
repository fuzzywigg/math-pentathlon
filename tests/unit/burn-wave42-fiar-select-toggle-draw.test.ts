/**
 * Wave 42 — FIAR selectChip toggle, deselect, isDraw gate. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  selectChip,
  deselectChip,
  isDraw,
  getSelectableNodes,
  getValidMoves,
  placeChip,
} from '../../src/games/fiar/rules';
import { createInitialState, CONFIG, type FiarGameState } from '../../src/games/fiar/types';

function toMovement(): FiarGameState {
  let s = createInitialState();
  for (const id of ['0-0', '0-4', '1-0', '1-4', '2-0', '2-4', '3-0', '3-4']) {
    s = placeChip(s, id);
  }
  return s;
}

describe('Wave 42 fiar — select / draw', () => {
  it('select toggles same node off; deselect clears', () => {
    const state = toMovement();
    const selectable = getSelectableNodes(state);
    expect(selectable.length).toBeGreaterThan(0);
    const id = selectable[0];
    const a = selectChip(state, id);
    expect(a.selectedNode).toBe(id);
    const b = selectChip(a, id);
    expect(b.selectedNode).toBeNull();
    const c = selectChip(state, id);
    expect(deselectChip(c).selectedNode).toBeNull();
  });

  it('select unknown node identity; placement phase not draw', () => {
    const open = createInitialState();
    expect(selectChip(open, '0-0')).toBe(open);
    expect(isDraw(open)).toBe(false);
    expect(getValidMoves(open, '0-0')).toEqual([]);
  });

  it('isDraw true when no selectable in movement', () => {
    const state = createInitialState();
    const nodes = new Map(state.board.nodes);
    // fill entire board so no moves
    for (const [id, n] of nodes) {
      nodes.set(id, { ...n, chip: 'player1' });
    }
    const stuck: FiarGameState = {
      ...state,
      board: { ...state.board, nodes },
      phase: 'movement',
      chipsPlaced: { player1: CONFIG.CHIPS_PER_PLAYER, player2: CONFIG.CHIPS_PER_PLAYER },
    };
    expect(getSelectableNodes(stuck)).toEqual([]);
    expect(isDraw(stuck)).toBe(true);
  });
});
