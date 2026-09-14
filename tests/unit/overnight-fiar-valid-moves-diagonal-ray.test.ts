/**
 * Overnight HEAVY — FIAR getValidMoves includes clear diagonal rays.
 * Distinct leftover vs wave42 blocked-ray (cardinal). Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getValidMoves } from '../../src/games/fiar/rules';
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

describe('Overnight fiar — diagonal valid moves', () => {
  it('center chip can slide diagonally into empty cells; stops at opponent', () => {
    const state = movementBoard([
      { id: '2-2', chip: 'player1' },
      { id: '4-4', chip: 'player2' }, // blocks down-right beyond 3-3
      { id: '0-4', chip: 'player2' },
      { id: '1-4', chip: 'player2' },
      { id: '3-0', chip: 'player2' },
    ]);
    const moves = getValidMoves(state, '2-2');
    expect(moves).toContain('0-0');
    expect(moves).toContain('1-1');
    expect(moves).toContain('3-3');
    expect(moves).not.toContain('4-4');
  });
});
