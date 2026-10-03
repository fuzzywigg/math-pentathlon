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
} from '../../src/games/fiar/rules';
import {
  createInitialState,
  CONFIG,
  type FiarGameState,
} from '../../src/games/fiar/types';
import { placeToMovement } from './fiar-test-helpers';

describe('Wave 42 fiar — select / draw', () => {
  it('select toggles same node off; deselect clears', () => {
    const state = placeToMovement();
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
    for (const [id, n] of nodes) {
      nodes.set(id, { ...n, chip: 'player1', chipKind: 'plain' });
    }
    const stuck: FiarGameState = {
      ...state,
      board: { ...state.board, nodes },
      phase: 'movement',
      chipsPlaced: {
        player1: CONFIG.CHIPS_PER_PLAYER,
        player2: CONFIG.CHIPS_PER_PLAYER,
      },
      chipInventory: {
        player1: { plain: 0, marked: 0 },
        player2: { plain: 0, marked: 0 },
      },
    };
    expect(getSelectableNodes(stuck)).toEqual([]);
    expect(isDraw(stuck)).toBe(true);
  });
});
