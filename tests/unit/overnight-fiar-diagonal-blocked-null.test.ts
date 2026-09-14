/**
 * Overnight HEAVY — FIAR down-left diagonal ownership never wins (cardinal scan).
 * Distinct leftover complementary to overnight diagonal win-matrix. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { checkWinner, findPaths } from '../../src/games/fiar/rules';
import {
  createInitialState,
  CONFIG,
  type FiarGameState,
} from '../../src/games/fiar/types';

function movementBoard(
  placements: Array<{ id: string; chip: 'player1' | 'player2' }>
): FiarGameState {
  const state = createInitialState();
  const nodes = new Map(state.board.nodes);
  for (const p of placements) {
    nodes.set(p.id, { ...nodes.get(p.id)!, chip: p.chip });
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

describe('Overnight fiar — down-left diagonal non-win', () => {
  it('player2 down-left diagonal four yields null winner and no length-4 path', () => {
    const state = movementBoard([
      { id: '0-3', chip: 'player2' },
      { id: '1-2', chip: 'player2' },
      { id: '2-1', chip: 'player2' },
      { id: '3-0', chip: 'player2' },
    ]);
    expect(checkWinner(state)).toBeNull();
    expect(findPaths(state, 'player2').every((p) => p.nodes.length < 4)).toBe(
      true
    );
  });
});
