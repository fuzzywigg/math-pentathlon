/**
 * Wave 42 — FIAR gameOver select/move identity. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  selectChip,
  moveChip,
  canMove,
  getValidMoves,
  getSelectableNodes,
  placeChip,
} from '../../src/games/fiar/rules';
import { createInitialState, CONFIG } from '../../src/games/fiar/types';

function toGameOver() {
  let state = createInitialState();
  const ids = [...state.board.nodes.keys()];
  for (let i = 0; i < CONFIG.CHIPS_PER_PLAYER * 2; i++) {
    state = placeChip(state, ids[i]);
  }
  // Find any own chip id for forged gameOver attempts
  let own = '';
  for (const [id, node] of state.board.nodes) {
    if (node.chip === state.currentPlayer) {
      own = id;
      break;
    }
  }
  return {
    ...state,
    phase: 'gameOver' as const,
    winner: 'player1' as const,
    own,
  };
}

describe('Wave 42 fiar — gameOver select move identity', () => {
  it('getSelectableNodes / getValidMoves empty in gameOver', () => {
    const { own, ...state } = toGameOver();
    expect(getSelectableNodes(state)).toEqual([]);
    expect(getValidMoves(state, own)).toEqual([]);
  });

  it('selectChip is identity in gameOver', () => {
    const { own, ...state } = toGameOver();
    expect(selectChip(state, own)).toBe(state);
  });

  it('canMove false and moveChip identity in gameOver', () => {
    const { own, ...state } = toGameOver();
    let empty = '';
    for (const [id, node] of state.board.nodes) {
      if (node.chip === null) {
        empty = id;
        break;
      }
    }
    expect(canMove(state, own, empty)).toBe(false);
    expect(moveChip(state, own, empty)).toBe(state);
  });
});
