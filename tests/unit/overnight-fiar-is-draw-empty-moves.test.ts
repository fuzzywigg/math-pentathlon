/**
 * Overnight HEAVY — FIAR isDraw when no selectable chips have moves.
 * Distinct leftover vs wave42 can-move blocked ray. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { isDraw, getSelectableNodes } from '../../src/games/fiar/rules';
import {
  createInitialState,
  CONFIG,
  type FiarGameState,
} from '../../src/games/fiar/types';

function fillAll(owner: 'player1' | 'player2'): FiarGameState {
  const state = createInitialState();
  const nodes = new Map(state.board.nodes);
  for (const [id, node] of nodes) {
    nodes.set(id, { ...node, chip: owner });
  }
  return {
    ...state,
    board: { ...state.board, nodes },
    phase: 'movement',
    chipsPlaced: {
      player1: CONFIG.CHIPS_PER_PLAYER,
      player2: CONFIG.CHIPS_PER_PLAYER,
    },
    currentPlayer: 'player1',
  };
}

describe('Overnight fiar — isDraw jammed', () => {
  it('full board owned by opponent → draw for current player', () => {
    const state = fillAll('player2');
    expect(getSelectableNodes(state)).toEqual([]);
    expect(isDraw(state)).toBe(true);
  });

  it('placement phase is never a draw', () => {
    expect(isDraw(createInitialState())).toBe(false);
  });
});
